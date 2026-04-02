// app/api/chat/proxy/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 30;

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

const chatRequestSchema = z.object({
    message: z.string().max(2000).optional(),
    chatInput: z.string().max(2000).optional(),
    sessionId: z.string().uuid().optional(),
});

async function fetchWithTimeout(url: string, options: RequestInit, timeout = 25000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error: unknown) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Request timeout - n8n took too long to respond');
        }
        throw error;
    }
}

export async function POST(req: NextRequest) {
    if (!N8N_WEBHOOK_URL) {
        console.error("N8N_WEBHOOK_URL environment variable is not set");
        return NextResponse.json(
            { error: "Chatbot service is not configured" },
            { status: 503 }
        );
    }

    try {
        const rawBody = await req.json();
        const parsed = chatRequestSchema.safeParse(rawBody);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid request format" },
                { status: 400 }
            );
        }

        const body = parsed.data;
        const sharedSecret = process.env.N8N_SHARED_SECRET || "";

        const payload: Record<string, string> = {
            chatInput: body.message || body.chatInput || "",
        };
        if (body.sessionId) {
            payload.sessionId = body.sessionId;
        }

        let lastError: Error | null = null;
        const maxRetries = 2;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const n8nRes = await fetchWithTimeout(
                    N8N_WEBHOOK_URL,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "X-Shared-Secret": sharedSecret,
                        },
                        body: JSON.stringify(payload),
                        cache: "no-store",
                    },
                    25000
                );

                if (!n8nRes.ok) {
                    const text = await n8nRes.text();
                    console.error(`N8N Error Status ${n8nRes.status}:`, text);

                    if (n8nRes.status >= 400 && n8nRes.status < 500) {
                        return NextResponse.json(
                            { error: `Request error: ${text}` },
                            { status: n8nRes.status }
                        );
                    }

                    lastError = new Error(`N8N returned status ${n8nRes.status}: ${text}`);

                    if (attempt < maxRetries) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        continue;
                    }

                    throw lastError;
                }

                const data = await n8nRes.json();
                return NextResponse.json(data);

            } catch (fetchError: unknown) {
                const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error';
                lastError = fetchError instanceof Error ? fetchError : new Error(errorMessage);
                console.error(`Attempt ${attempt} failed:`, errorMessage);

                if (errorMessage.includes('timeout') && attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    continue;
                }

                if (attempt === maxRetries) {
                    throw lastError;
                }
            }
        }

        throw lastError || new Error('All retry attempts failed');

    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        const errorStack = err instanceof Error ? err.stack : undefined;

        console.error("Chat Proxy Exception:", {
            message: errorMessage,
            stack: errorStack,
            timestamp: new Date().toISOString()
        });

        let userMessage = "Unable to reach chatbot service";
        if (errorMessage.includes('timeout')) {
            userMessage = "The chatbot is taking too long to respond. Please try again.";
        } else if (errorMessage.includes('network')) {
            userMessage = "Network error - please check your connection and try again.";
        }

        return NextResponse.json(
            { error: userMessage },
            { status: 500 }
        );
    }
}

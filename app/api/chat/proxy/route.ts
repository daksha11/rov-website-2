// app/api/chat/proxy/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30; // Max 30 seconds for this route

// Helper function to create fetch with timeout
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
    } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timeout - n8n took too long to respond');
        }
        throw error;
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const n8nUrl = "https://rangeofviewstudios.app.n8n.cloud/webhook/16706b5d-2ad3-4c5e-bb89-6a573883b89f/chat";

        // Get shared secret (optional if n8n webhook doesn't require auth)
        const sharedSecret = process.env.N8N_SHARED_SECRET || "";
        if (!sharedSecret) {
            // N8N_SHARED_SECRET not set - webhook must not require authentication
        }

        // Build the payload
        const payload: any = {
            chatInput: body.message || body.chatInput || "",
        };
        if (body.sessionId) {
            payload.sessionId = body.sessionId;
        }

        // Attempt to fetch with timeout and retry logic
        let lastError: any = null;
        const maxRetries = 2;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const n8nRes = await fetchWithTimeout(
                    n8nUrl,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "X-Shared-Secret": sharedSecret,
                        },
                        body: JSON.stringify(payload),
                        cache: "no-store",
                    },
                    25000 // 25 second timeout
                );

                if (!n8nRes.ok) {
                    const text = await n8nRes.text();
                    console.error(`❌ N8N Error Status ${n8nRes.status}:`, text);

                    // Don't retry on 4xx errors (client errors)
                    if (n8nRes.status >= 400 && n8nRes.status < 500) {
                        return NextResponse.json(
                            { error: `Request error: ${text}` },
                            { status: n8nRes.status }
                        );
                    }

                    // Store error for potential retry
                    lastError = new Error(`N8N returned status ${n8nRes.status}: ${text}`);

                    // Retry on 5xx errors if we have attempts left
                    if (attempt < maxRetries) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        continue;
                    }

                    throw lastError;
                }

                const data = await n8nRes.json();
                return NextResponse.json(data);

            } catch (fetchError: any) {
                lastError = fetchError;
                console.error(`❌ Attempt ${attempt} failed:`, fetchError.message);

                // If it's a timeout and we have retries left, try again
                if (fetchError.message.includes('timeout') && attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    continue;
                }

                // If this was the last attempt, throw the error
                if (attempt === maxRetries) {
                    throw lastError;
                }
            }
        }

        // If we get here, all retries failed
        throw lastError || new Error('All retry attempts failed');

    } catch (err: any) {
        console.error("💥 Chat Proxy Exception:", {
            message: err.message,
            stack: err.stack,
            timestamp: new Date().toISOString()
        });

        // Provide user-friendly error messages
        let errorMessage = "Unable to reach chatbot service";
        if (err.message.includes('timeout')) {
            errorMessage = "The chatbot is taking too long to respond. Please try again.";
        } else if (err.message.includes('network')) {
            errorMessage = "Network error - please check your connection and try again.";
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}

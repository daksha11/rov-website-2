"use client";

// The demo that does the selling on /brand.
//
// Four real touchpoints rendered twice: once the way most businesses actually
// send them, once on-brand. A toggle flips between the two. This exists because
// the wedge argument ("your receipt looks like a different company made it") is
// far more convincing shown than described, and because a page selling
// touchpoint consistency should demonstrate touchpoint consistency.
//
// Everything is HTML and CSS. No screenshots, so nothing goes stale and the
// text stays selectable and legible at any width.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";

// Generic side: system serif, grey, cramped. Branded side: the real tokens.
const CREAM = "#FFF4E3";
const ESPRESSO = "#3B2114";
const RUST = "#90422C";
const ORANGE = "#EA9A61";

type Surface = "email" | "receipt" | "thanks" | "review";

const LABELS: { key: Surface; name: string }[] = [
    { key: "email", name: "Confirmation email" },
    { key: "receipt", name: "Receipt" },
    { key: "thanks", name: "Thank-you page" },
    { key: "review", name: "Review request" },
];

function Generic({ surface }: { surface: Surface }) {
    const base: React.CSSProperties = {
        fontFamily: "Times New Roman, Times, serif",
        background: "#ffffff",
        color: "#222",
        padding: 18,
        borderRadius: 4,
        border: "1px solid #ccc",
        fontSize: 13,
        lineHeight: 1.45,
        height: "100%",
    };

    if (surface === "email")
        return (
            <div style={base}>
                <p style={{ margin: 0, fontWeight: 700 }}>Order Confirmation #48812</p>
                <hr style={{ border: 0, borderTop: "1px solid #ddd", margin: "10px 0" }} />
                <p style={{ margin: 0 }}>Dear Customer,</p>
                <p style={{ margin: "8px 0 0" }}>
                    Thank you for your order. Your order has been received and is being processed.
                </p>
                <p style={{ margin: "8px 0 0", color: "#0000EE", textDecoration: "underline" }}>
                    View order status
                </p>
                <p style={{ margin: "14px 0 0", fontSize: 11, color: "#888" }}>
                    This is an automated message. Do not reply to this email.
                </p>
            </div>
        );

    if (surface === "receipt")
        return (
            <div style={{ ...base, fontFamily: "Courier New, monospace" }}>
                <p style={{ margin: 0, textAlign: "center", fontWeight: 700 }}>RECEIPT</p>
                <p style={{ margin: "10px 0 0", fontSize: 11 }}>ITEM 1 .............. 24.00</p>
                <p style={{ margin: 0, fontSize: 11 }}>ITEM 2 .............. 18.00</p>
                <p style={{ margin: 0, fontSize: 11 }}>TAX ................. 3.57</p>
                <hr style={{ border: 0, borderTop: "1px dashed #bbb", margin: "8px 0" }} />
                <p style={{ margin: 0, fontSize: 11, fontWeight: 700 }}>TOTAL ............. 45.57</p>
                <p style={{ margin: "14px 0 0", fontSize: 10, color: "#999", textAlign: "center" }}>
                    THANK YOU COME AGAIN
                </p>
            </div>
        );

    if (surface === "thanks")
        return (
            <div style={{ ...base, textAlign: "center", display: "grid", placeContent: "center" }}>
                <p style={{ margin: 0, fontSize: 30, color: "#22a06b" }}>✓</p>
                <p style={{ margin: "8px 0 0", fontWeight: 700, fontSize: 16 }}>Success!</p>
                <p style={{ margin: "6px 0 0", fontSize: 12, color: "#777" }}>
                    Your submission has been received.
                </p>
            </div>
        );

    return (
        <div style={base}>
            <p style={{ margin: 0, fontWeight: 700 }}>How did we do?</p>
            <p style={{ margin: "8px 0 0" }}>
                Please take a moment to rate your recent experience with us. Your feedback is
                important to us.
            </p>
            <p style={{ margin: "10px 0 0", fontSize: 20, letterSpacing: 2, color: "#f5a623" }}>
                ☆☆☆☆☆
            </p>
            <p style={{ margin: "12px 0 0", fontSize: 11, color: "#888" }}>Sent via ReviewTool Pro</p>
        </div>
    );
}

function Branded({ surface }: { surface: Surface }) {
    const base: React.CSSProperties = {
        fontFamily: BODY,
        background: CREAM,
        color: ESPRESSO,
        padding: 20,
        borderRadius: 14,
        border: `1px solid ${ORANGE}55`,
        fontSize: 13,
        lineHeight: 1.55,
        height: "100%",
    };
    const eyebrow: React.CSSProperties = {
        margin: 0,
        fontSize: 9.5,
        fontWeight: 700,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: RUST,
    };
    const h: React.CSSProperties = { fontFamily: HEADING, fontWeight: 700, margin: "8px 0 0" };

    if (surface === "email")
        return (
            <div style={base}>
                <p style={eyebrow}>Your table, confirmed</p>
                <p style={{ ...h, fontSize: 19, lineHeight: 1.2 }}>Friday at 7:30. We&apos;ve got you.</p>
                <p style={{ margin: "10px 0 0" }}>
                    Two of you, corner booth if it&apos;s free. Parking is easiest on the side street.
                </p>
                <p style={{ margin: "14px 0 0" }}>
                    <span
                        style={{
                            display: "inline-block",
                            background: ESPRESSO,
                            color: CREAM,
                            padding: "8px 16px",
                            borderRadius: 999,
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                        }}
                    >
                        Change or cancel →
                    </span>
                </p>
                <p style={{ margin: "14px 0 0", fontSize: 11, color: `${ESPRESSO}99` }}>
                    Need us before then? Just reply. A person reads these.
                </p>
            </div>
        );

    if (surface === "receipt")
        return (
            <div style={base}>
                <p style={eyebrow}>Receipt · 3 Aug</p>
                <p style={{ ...h, fontSize: 17 }}>Thanks, Marcus.</p>
                <div style={{ margin: "12px 0 0", fontSize: 12.5 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Tasting flight</span>
                        <span>$24.00</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                        <span>Small plates</span>
                        <span>$18.00</span>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: 10,
                            paddingTop: 10,
                            borderTop: `1px solid ${ESPRESSO}22`,
                            fontWeight: 700,
                        }}
                    >
                        <span>Total</span>
                        <span>$45.57</span>
                    </div>
                </div>
                <p style={{ margin: "14px 0 0", fontSize: 11, color: `${ESPRESSO}99` }}>
                    The flight you had rotates monthly. We&apos;ll tell you when it changes.
                </p>
            </div>
        );

    if (surface === "thanks")
        return (
            <div style={{ ...base, display: "grid", placeContent: "center", textAlign: "center" }}>
                <p style={eyebrow}>You&apos;re on the list</p>
                <p style={{ ...h, fontSize: 21, lineHeight: 1.2 }}>That&apos;s sorted.</p>
                <p style={{ margin: "8px 0 0", fontSize: 12.5 }}>
                    Your report lands within three business days. While you wait, the Beltline audit is
                    the closest thing to a preview.
                </p>
                <p style={{ margin: "14px 0 0" }}>
                    <span
                        style={{
                            display: "inline-block",
                            background: ESPRESSO,
                            color: CREAM,
                            padding: "8px 16px",
                            borderRadius: 999,
                            fontSize: 11,
                            fontWeight: 700,
                        }}
                    >
                        Read the audit →
                    </span>
                </p>
            </div>
        );

    return (
        <div style={base}>
            <p style={eyebrow}>One question</p>
            <p style={{ ...h, fontSize: 18, lineHeight: 1.25 }}>Was the corner booth worth it?</p>
            <p style={{ margin: "10px 0 0" }}>
                You came in Friday. If it was good, a line from you helps someone else find us. If it
                wasn&apos;t, tell us instead and we&apos;ll fix it.
            </p>
            <p style={{ margin: "14px 0 0", display: "flex", gap: 8 }}>
                <span
                    style={{
                        background: ESPRESSO,
                        color: CREAM,
                        padding: "8px 14px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 700,
                    }}
                >
                    It was good →
                </span>
                <span
                    style={{
                        border: `1px solid ${ESPRESSO}33`,
                        padding: "8px 14px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 700,
                    }}
                >
                    Something was off
                </span>
            </p>
        </div>
    );
}

export default function TouchpointToggle() {
    const [branded, setBranded] = useState(false);

    return (
        <section
            id="see-it"
            className="relative bg-black"
            style={{ padding: "clamp(60px, 10vw, 100px) clamp(16px, 5vw, 60px)" }}
        >
            <div className="mx-auto max-w-6xl">
                <span
                    className="mb-3 block text-xs uppercase tracking-[0.3em] text-[#EA9A61]"
                    style={{ fontFamily: BODY }}
                >
                    The same four emails, twice
                </span>
                <h2
                    className="mb-4 max-w-2xl text-3xl font-bold italic text-white md:text-4xl lg:text-5xl"
                    style={{ fontFamily: HEADING }}
                >
                    This is the whole argument
                </h2>
                <p
                    className="mb-8 max-w-xl text-sm leading-relaxed text-white/40"
                    style={{ fontFamily: BODY }}
                >
                    Flip the switch. Nothing about the business changed: same order, same customer,
                    same four messages. Only whether anyone designed them.
                </p>

                {/* Toggle */}
                <div
                    className="mb-10 inline-flex rounded-full border border-white/10 p-1"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                    role="group"
                    aria-label="Compare touchpoints"
                >
                    {[
                        { on: false, label: "What most send" },
                        { on: true, label: "The Full View" },
                    ].map((opt) => (
                        <button
                            key={opt.label}
                            type="button"
                            onClick={() => setBranded(opt.on)}
                            aria-pressed={branded === opt.on}
                            className="rounded-full px-5 py-2.5 text-[0.72rem] font-bold uppercase tracking-[0.1em] transition-all"
                            style={{
                                fontFamily: BODY,
                                color: branded === opt.on ? "#fff" : "rgba(255,255,255,0.45)",
                                background:
                                    branded === opt.on
                                        ? "linear-gradient(132deg, #EA9A61 4.77%, #B16937 40%, #A64D2B 70%, #42201C 100%)"
                                        : "transparent",
                            }}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {LABELS.map(({ key, name }) => (
                        <div key={key}>
                            <p
                                className="mb-3 text-[0.7rem] uppercase tracking-[0.2em] text-white/30"
                                style={{ fontFamily: BODY }}
                            >
                                {name}
                            </p>
                            <div style={{ minHeight: 230 }}>
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.div
                                        key={branded ? "b" : "g"}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.28 }}
                                        style={{ height: "100%" }}
                                    >
                                        {branded ? <Branded surface={key} /> : <Generic surface={key} />}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    ))}
                </div>

                <p
                    className="mt-10 max-w-2xl text-[0.9375rem] leading-relaxed text-white/55"
                    style={{ fontFamily: BODY }}
                >
                    The left-hand version is not a strawman. It is what the default settings in your
                    booking tool, your card reader, and your form builder actually send, and it is what
                    most of your competitors are sending right now.{" "}
                    <span className="text-white">
                        Nobody was ever assigned these four screens.
                    </span>{" "}
                    That is the gap, and it is the cheapest ground you will ever take.
                </p>
            </div>
        </section>
    );
}

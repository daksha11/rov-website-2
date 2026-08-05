"use client";

// For everyone who isn't an artist or a manager: designers, producers,
// videographers, venue and press people.
//
// This exists because "I work behind the scenes" used to be a dead end. The
// gate offered it, someone picked it, and nothing happened at all. Deliberately
// not a funnel and deliberately not a quiz: three honest routes and an email.
// The Karina credit on the intro flyer is the proof that the first one is real.

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Handshake, Share2, Briefcase } from "lucide-react";
import { CONSULT_BOOKING_URL, CONTACT_EMAIL } from "@/data/soundPricing";
import CalBookButton from "@/components/sound/CalBookButton";
import { useEffectiveRole } from "@/components/music/IntakeContext";
import RoleInline from "@/components/music/RoleInline";

const HEADING = "Norwige, sans-serif";
const BODY = "'Roboto', sans-serif";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

function mailto(subject: string, body: string) {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const ROUTES = [
  {
    icon: Handshake,
    title: "Work with us",
    body: "We bring in designers, shooters, and players constantly, and we credit everyone publicly. Send what you make.",
    cta: "Send your work",
    href: mailto(
      "Collaboration: [your name]",
      "What you do, a link to your work, and what you'd want to work on. We reply to everything."
    ),
  },
  {
    icon: Share2,
    title: "Refer an artist",
    body: "If you're already working with an artist who needs a mix, a rollout, or the whole backend built, point them here.",
    cta: "Talk about referrals",
    href: mailto(
      "Referral",
      "Who you'd like to refer and what they need. Tell us how you'd want to be looped in."
    ),
  },
  {
    icon: Briefcase,
    title: "Hire us for something else",
    body: "Venues, labels, brands, and agencies use us for sound, video, and design outside of artist work.",
    cta: "Book a call",
    cal: true,
  },
] as const;

export default function CollaboratorCard() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const role = useEffectiveRole();

  // Only for the third audience. Artists and managers have the audit instead.
  if (role !== "other") return null;

  return (
    <section
      ref={ref}
      id="collaborate"
      className="scroll-mt-24 relative bg-black"
      style={{ padding: "clamp(60px, 10vw, 110px) clamp(16px, 5vw, 60px)" }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={spring}
          className="block text-xs uppercase tracking-[0.3em] text-[#EA9A61] mb-3 text-center"
          style={{ fontFamily: BODY }}
        >
          Behind the scenes
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.08 }}
          className="text-white text-3xl md:text-4xl font-bold italic mb-3 text-center"
          style={{ fontFamily: HEADING }}
        >
          We collaborate, and we credit.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.14 }}
          className="text-white/45 text-sm md:text-base leading-relaxed max-w-lg mx-auto text-center mb-3"
          style={{ fontFamily: BODY }}
        >
          Most of what we put out has someone else&apos;s hands on it, and their name on
          it too. Pick whichever one you are.
        </motion.p>
        <div className="flex justify-center mb-10">
          <RoleInline verb="Viewing" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ROUTES.map((r, i) => {
            const Icon = r.icon;
            const inner = (
              <>
                <Icon className="w-6 h-6 text-[#EA9A61] mb-4" strokeWidth={1.5} />
                <h3
                  className="text-white text-lg md:text-xl font-bold italic mb-2"
                  style={{ fontFamily: HEADING }}
                >
                  {r.title}
                </h3>
                <p
                  className="text-white/45 text-sm leading-relaxed flex-1 mb-5"
                  style={{ fontFamily: BODY }}
                >
                  {r.body}
                </p>
                <span
                  className="inline-flex items-center gap-2 text-[#EA9A61]/85 group-hover:text-[#EA9A61] text-sm font-semibold transition-colors"
                  style={{ fontFamily: HEADING }}
                >
                  {r.cta}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </span>
              </>
            );

            const cls =
              "group text-left rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 flex flex-col hover:border-[#EA9A61]/40 hover:bg-[#EA9A61]/[0.03] transition-all duration-300 cursor-pointer";

            return (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ ...spring, delay: 0.2 + i * 0.08 }}
              >
                {"cal" in r && r.cal ? (
                  <CalBookButton calLink={CONSULT_BOOKING_URL} className={`${cls} w-full h-full`}>
                    {inner}
                  </CalBookButton>
                ) : (
                  <a href={"href" in r ? r.href : undefined} className={`${cls} h-full`}>
                    {inner}
                  </a>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react";
// Same reasoning as MusicNav: "start a session" is the paid Studio Session,
// not the unattached generic 15-minute call.
import { CAL_LINKS, CONTACT_EMAIL } from "@/data/soundPricing";
import CalBookButton from "@/components/sound/CalBookButton";
import FooterRoleSwitch from "@/components/music/FooterRoleSwitch";

// Music-branded footer for rovmusic.com. Mirrors the studios footer's visual
// language (black, Norwige headings, ROV logo) but drops the B2B service links,
// India-time toggle, and skylines. Music-only: submit, follow, book.

export default function MusicFooter() {
  return (
    <footer className="relative w-full bg-black text-white overflow-hidden">
      {/* Logo + MUSIC wordmark */}
      <div className="px-6 md:px-12 pl-6 md:pl-16 pt-10 pb-12">
        <Link href="/" className="flex items-center gap-4 md:gap-6 w-fit">
          <Image
            src="/brand/rov-logo.webp"
            alt="Range of View Music"
            width={120}
            height={60}
            className="object-contain w-[80px] md:w-[120px]"
          />
          <h2
            className="text-3xl md:text-5xl uppercase tracking-wider font-bold"
            style={{ fontFamily: "Norwige, sans-serif" }}
          >
            MUSIC
          </h2>
        </Link>
      </div>

      {/* Columns */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-12 pb-16">
        {/* Services */}
        <div className="flex flex-col gap-3 pl-0 md:pl-8">
          <h3
            className="text-2xl md:text-4xl uppercase tracking-wider mb-2 font-bold"
            style={{ fontFamily: "Norwige, sans-serif" }}
          >
            STUDIO
          </h3>
          <ul className="flex flex-col gap-1 text-base md:text-xl" style={{ fontFamily: "Roboto, sans-serif" }}>
            <li className="text-white/80">Mixing</li>
            <li className="text-white/80">Mastering</li>
            <li className="text-white/80">Recording</li>
            <li className="text-white/80">Cover Art &amp; Visuals</li>
          </ul>
        </div>

        {/* Follow / Submit */}
        <div className="flex flex-col gap-3">
          <h3
            className="text-2xl md:text-4xl uppercase tracking-wider mb-2 font-bold"
            style={{ fontFamily: "Norwige, sans-serif" }}
          >
            FOLLOW
          </h3>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-base md:text-xl hover:text-gray-400 transition-colors duration-300 mb-1"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            {CONTACT_EMAIL}
          </a>
          <div className="flex items-center gap-5">
            <a
              href="https://www.instagram.com/rangeofviewstudios/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Range of View Music on Instagram"
              className="transition hover:scale-110"
            >
              <Instagram size={30} className="md:w-10 md:h-10" />
            </a>
            <a
              href="https://open.spotify.com/user/31uh2vy4lgdzfrp47tudxzn7bhuq"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Range of View Music on Spotify"
              className="transition hover:scale-110"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 496 512" className="w-[30px] h-[30px] md:w-10 md:h-10">
                <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm113.7 364.7c-4.1 6.6-12.8 8.6-19.4 4.5-53.1-32.3-119.8-39.6-198.4-21.6-7.5 1.7-15-3.1-16.7-10.6-1.7-7.5 3.1-15 10.6-16.7 84.5-19.2 158.1-10.8 217.8 25.3 6.6 4.1 8.6 12.8 4.5 19.4zm26.6-58.6c-5.1 8.3-16 10.9-24.3 5.8-60.8-37.2-153.8-48-224.7-26.2-9.1 2.7-18.6-2.5-21.3-11.6-2.7-9.1 2.5-18.6 11.6-21.3 79.6-23.8 181.4-11.7 249.7 30.1 8.3 5.1 10.9 16 5.8 24.3z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Book */}
        <div className="flex flex-col gap-3">
          <h3
            className="text-2xl md:text-4xl uppercase tracking-wider mb-2 font-bold"
            style={{ fontFamily: "Norwige, sans-serif" }}
          >
            BOOK
          </h3>
          <CalBookButton
            calLink={CAL_LINKS.hourlySession}
            className="inline-flex items-center justify-center w-fit px-6 py-3 rounded-full text-sm uppercase tracking-wide transition-colors hover:bg-white/5"
            style={{ fontFamily: "'Neue Montreal', sans-serif", border: "1px solid rgba(234,154,97,0.6)", letterSpacing: "0.08em" }}
          >
            Start a session
          </CalBookButton>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-6 md:px-12 py-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5">
          <p className="text-white/40 text-xs md:text-sm" style={{ fontFamily: "Roboto, sans-serif" }}>
            © {new Date().getFullYear()} Range of View. Atlanta, GA.
          </p>
          <FooterRoleSwitch />
        </div>
        <a
          href="https://www.rovstudios.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Back to Range of View Studios"
          className="group inline-flex items-center gap-3 pl-3 pr-4 py-2 rounded-full border border-white/12 hover:border-white/30 hover:bg-white/5 transition-colors"
        >
          <Image
            src="/brand/rov-logo.webp"
            alt="Range of View Studios"
            width={28}
            height={28}
            className="object-contain w-6 h-6 opacity-80 group-hover:opacity-100 transition-opacity"
          />
          <span
            className="text-white/60 group-hover:text-white text-xs md:text-sm uppercase transition-colors"
            style={{ fontFamily: "'Neue Montreal', sans-serif", letterSpacing: "0.06em" }}
          >
            Range of View Studios
          </span>
          <span className="text-white/40 group-hover:text-white/80 text-sm transition-colors">↗</span>
        </a>
      </div>
    </footer>
  );
}

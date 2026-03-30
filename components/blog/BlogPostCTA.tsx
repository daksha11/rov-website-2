import Link from "next/link";

export function BlogPostCTA() {
  return (
    <section className="mx-auto max-w-[720px] border-t border-white/10 px-5 py-16 text-center">
      <h2
        className="text-2xl text-white sm:text-3xl"
        style={{ fontFamily: "Norwige, sans-serif" }}
      >
        Need a website that drives results?
      </h2>

      <p className="mx-auto mt-4 max-w-md text-base text-gray-400">
        Book a free strategy call and see how ROV Studios can elevate your brand.
      </p>

      <Link
        href="https://calendly.com/rangeofviewmusic/30min"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-block rounded-full border border-white/20 bg-white px-8 py-3 text-sm font-medium text-black transition-colors duration-200 hover:bg-gray-200"
      >
        Let&apos;s Talk
      </Link>
    </section>
  );
}

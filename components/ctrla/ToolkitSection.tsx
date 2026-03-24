"use client"

export default function ToolkitSection() {
  return (
    <section
      className="relative pb-24 pt-16 bg-[#604f45] min-h-screen flex flex-col justify-center items-center  text-white font-['Poppins'] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/background/new6.webp')",}} 
    >
      

      {/* Content wrapper */}
      <div className="relative md:pl-18 pl-0   w-full">
        {/* Title */}
        <h1
          className="text-center text-[#ffffff] md:text-[170px] text-8xl  tracking-wider"
          style={{ fontFamily: "pagaki" }}
        >
          TOOLKIT
        </h1>

        {/* Boxes */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  {/* Left box */}
  <div className="bg-[#42210b] text-white rounded-3xl px-8 lg:px-12 pb-18 pt-10 shadow-lg">
    <h2
      style={{ fontFamily: "pagaki" }}
      className="text-4xl tracking-wider mb-4"
    >
      CTRL A TOOLKIT
    </h2>
    <p className="text-lg leading-relaxed">
      A handpicked library of design, web, music, and branding tools—
      each with clear use cases and pro tips to help you create smarter,
      faster, and with soul. Built for indie artists, designers, and
      creatives leveling up on their own terms.
    </p>
  </div>

  {/* Right box */}
  <div className="bg-[#42210b] text-white rounded-l-3xl px-8 lg:px-12 pb-18 pt-10 shadow-lg ml-auto">
    <h2
      style={{ fontFamily: "pagaki" }}
      className="text-4xl tracking-wider mb-4"
    >
      CTRL A IMMERSIVE <br /> SOUND GUIDE
    </h2>
    <p className="text-lg leading-relaxed">
      A no-fluff, step-by-step guide to help indie artists understand
      mixing like a pro—without the techy overwhelm. From vocal prep to
      final bounce, we break down every stage so your music hits harder,
      cleaner, and realer.
    </p>
  </div>
</div>

      </div>
    </section>
  );
}
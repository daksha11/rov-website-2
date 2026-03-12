/* eslint-disable @next/next/no-img-element */
"use client"
import { TypeAnimation } from "react-type-animation";

export default function ArtistBreakthrough() {
  return (
    <section
      className="relative py-20 bg-cover bg-center text-white rounded-t-[50px] -mt-[34px] "
      style={{
        backgroundImage: "url('/assets/images/Untitled-3.gif')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 rounded-t-[50px]"></div>

      <div className="relative z-10 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Content - 6 columns */}
        <div className="lg:col-span-6 space-y-8">
          <div className="md:pl-24 pl-8">
            <h2 style={{fontFamily:"futura"}} className="text-3xl md:text-4xl font-serif mb-4">
              Our artists don&rsquo;t just release <br /> music.
            </h2>
            <h2
              style={{ fontFamily: "anton" }}
              className="text-4xl md:text-5xl text-[#dcd7c8]"
            >
              <TypeAnimation
                sequence={["THEY BREAK THROUGH.", 2000, "", 500]}
                wrapper="span"
                cursor={true}
                repeat={Infinity}
                style={{ display: "inline-block" }}
              />
            </h2>
            <p style={{fontFamily:"futura"}} className="text-3xl md:text-3xl leading-tight mt-10 font-serif">
              We&rsquo;re not chasing clout. We&rsquo;re <br /> building careers.
            </p>
            <p style={{fontFamily:"futura"}} className="text-3xl md:text-3xl mt-2 font-serif">
              One mix at a time.
            </p>
          </div>

          <div className="bg-[#dcd7c8] md:pl-24 pl-7 py-10 rounded-r-4xl">
            <p
              style={{ fontFamily: "futura" }}
              className="text-3xl text-[#201a14] leading-tight font-serif font-bold mb-2"
            >
              Apple Music Radio features On the Radar premieres <br /> Editorial
              playlist placements 200K+ streams <br /> from bedroom producers
            </p>
          </div>
        </div>

        {/* Right Image - 6 columns */}
        <div className="lg:col-span-6 md:pr-20 pr-3">
          <div
            className="w-full md:ml-0 ml-1 rounded-lg flex items-center justify-center bg-cover bg-center"
            style={{
              backgroundImage: "url('/assets/background/6.png')",
            }}
          >
            <img
              src="/assets/images/gallery10.webp"
              className="h-full w-full p-6"
              alt="ROV Studios artist breakthrough showcase"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
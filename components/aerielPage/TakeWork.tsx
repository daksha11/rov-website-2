import Image from "next/image";
import TestimonialsSection from "./TestimonialSection";

export default function TakeWork() {
  return (
    <section
      className="relative md:rounded-t-[50px] md:-mt-[28px]  bg-cover lg:bg-center bg-start bg-no-repeat md:pt-10 pt-4 overflow-hidden"
      style={{
        backgroundImage: "url('/assets/background/new2.webp')",
      }}
    >
      {/* Top Right Decorative Image */}
      <div className="absolute top-0 right-4  md:right-8 xl:block hidden md:w-28 lg:w-72 z-10">
        <Image
          src="/assets/images/arrowvision.webp"
          alt=""
          width={250}
          height={250}
          className="object-contain w-full h-auto float-y"
        />
      </div>

      {/* Text Content */}
      <div
        className="flex flex-col md:flex-row md:items-end sink text-[#302218] px-4 sm:px-8 md:px-20 gap-4"
      >
        <h2
          className="text-2xl  md:text-4xl lg:text-6xl xl:text-8xl tracking-wider uppercase leading-tight"
          style={{fontFamily: "anton"}}
        >
          Don’t Take Our <br />
          <span>Word For It /</span>
        </h2>
        <p
          className="underline italic text-xl md:text-2xl lg:text-3xl font-bold leading-tight md:mb-6 tracking-wider"
          style={{fontFamily: "futura"}}
        >
          Here’s what our clients say about <br /> our flights
        </p>
      </div>

      {/* Hand Image */}
      <div className="w-full flex justify-end mt-6 md:mt-0">
       <div
      className=" w-full max-w-7xl bg-cover  xl:h-[560px] lg:h-[520px] md:h-[400px] h-[240px] bg-center bg-no-repeat"
      style={{ backgroundImage: `url(/assets/images/takeworkhand.webp)` }}
    >
 <TestimonialsSection/>
    </div>
      </div>
    </section>
  );
}
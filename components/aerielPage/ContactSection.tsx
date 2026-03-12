"use client"

export default function ContactSection() {
    return (
        <section className="relative w-full h-screen overflow-hidden">
            {/* Background Video */}
            <video
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                aria-label="Aerial drone footage background by ROV Studios"
                title="ROV Studios Aerial Contact"
            >
                <source src="/bg-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Overlay (dark effect) */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-4 h-full text-center text-[#E4D5C3] px-4">
                <p style={{fontFamily:"futura"}} className="italic font-semibold tracking-wider text-3xl lg:text-3xl text-[#dcd7c8]">
                    Join us for takeoff
                </p>

                <h1
                    className="text-4xl lg:text-7xl sink tracking-wider leading-snug md:leading-[1.4]"
                >
                    Don’t keep waiting in the <br /> runway.
                </h1>

                {/* Button */}
                <button
                    className="mt-6 bg-[#5B3A29] text-[#dcd7c8] text-2xl cursor-pointer hover:bg-[#7A4E37] transition"
                    style={{
                        width: "200px",
                        height: "100px",
                        borderRadius: "100px / 50px",
                    }}
                >
                    Contact Now
                </button>
            </div>

            {/* Bottom-left Info */}
            <div className="absolute bottom-6 left-4 md:bottom-10 md:left-10  text-[#dcd7c8] px-3 py-2 text-xs sm:text-sm md:text-base">
                <p className="font-bold">Atlanta | Georgia</p>
                <p className="italic">Working Globally</p>
            </div>
        </section>
    );
}
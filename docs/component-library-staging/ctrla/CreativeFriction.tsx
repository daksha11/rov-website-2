import Image from "next/image";

export default function CreativeFriction() {
    return (
        <section
            className="relative py-16 px-4 md:px-16 "
            style={{
                backgroundImage: "url('/assets/background/new1.webp')",
                backgroundSize: "cover",
                backgroundPosition: "right",
            }}>
            <h1 className="text-[#d8d5d4]  text-2xl">Range Of View Studios</h1>
            <div
                className=" rounded-md mt-8 max-w-3xl md:ml-10 bg-cover bg-center bg-no-repeat p-3"
                style={{ backgroundImage: "url('/assets/images/musicbg.webp')" }}
            >
                <div className="flex justify-between items-center ">
                    <div className="flex justify-center gap-3 items-center">
                        <div className="h-5 w-5 rounded-full bg-red-600"></div>
                        <div className="h-5 w-5 rounded-full bg-yellow-600"></div>
                        <div className="h-5 w-5 rounded-full bg-green-600"></div>
                    </div>
                    <Image
                        src="/assets/images/diffImg.webp"
                        alt="Range of View logo"
                        width={80}
                        height={80}
                        className="object-cover rounded-full"
                        priority
                    />
                </div>
                <div
                    className="relative rounded-md text-[#d8d5d4] bg-cover bg-center bg-no-repeat overflow-hidden"
                    style={{ backgroundImage: "url('/assets/background/carpetbg.webp')" }}
                >
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black/50"></div>

                    {/* Content */}
                    <h1
                        style={{ fontFamily: "anton" }}
                        className="relative text-6xl leading-[1.2] px-3 py-7"
                    >
                        Creative,<br />
                        friction?<br />
                        we can through <br />
                        it
                    </h1>
                </div>
            </div>
            <div className="flex justify-around item-end -mt-[10%]">
                <div>
                </div>
                <Image
                    src="https://media.canva.com/v2/image-resize/format:PNG/height:191/quality:100/uri:ifs%3A%2F%2FM%2Ff2f89f4f-81c3-4aab-90b7-18a97bc2fc3f/watermark:F/width:200?csig=AAAAAAAAAAAAAAAAAAAAALGjArHYvUhf4sQcltj_VAewok5GgKCHe0gHhVXfxRqd&exp=1758633700&osig=AAAAAAAAAAAAAAAAAAAAAAXePO2YK-sFjI--4FdCafkG4xFK6YqXIPZ22hLZoyJq&signer=media-rpc&x-canva-quality=thumbnail"
                    alt="Decorative Art"
                    width={300}
                    height={300}
                    className="rotate-[170deg] w-[300px] h-[300px] mr-36"
                />
            </div>
            <div className="-mt-[8%] md:ml-10 text-[#eeeef2]">
                <h2 style={{ fontFamily: "anton" }} className="text-4xl">Born in Atlanta.</h2>
                <p style={{ fontFamily: "pagaki" }} className="text-4xl mt-6">Rooted in <span className="text-[#f86a4f]">rhythm,</span> <span className="text-[#f0ad4c]">color,</span> and <span className="text-[#6cb5c6]">code.</span></p>
                <p style={{ fontFamily: "pagaki" }} className="mt-8 text-5xl leading-[1.2]">We mix tracks, build brands, and launch sites— <br />
                    fast, clean, and always for the city.</p>
                <div style={{ fontFamily: "anton" }} className="text-5xl space-y-3 mt-7 uppercase tracking-widest">
                    <h2>No middlemen.</h2>
                    <h2>No waiting.</h2>
                    <h2>Just work that moves.</h2>
                </div>

            </div>
        </section>
    )
}
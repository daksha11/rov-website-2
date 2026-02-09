"use client";

import TiltedCard from "./TiltedCard";

const DigiMagCtrlA = () => {
    return (
        <div
            id="digi-mag-ctrla"
            className="w-full px-6 sm:px-12 md:px-16 mt-16 mb-24 relative"
        >
            {/* Top Left Gradient Blob */}
            <div
                className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full pointer-events-none z-0"
                style={{
                    background: 'rgba(96, 62, 37, 0.60)',
                    filter: 'blur(200px)',
                    transform: 'translate(-30%, -30%)'
                }}
            />
            {/* Bottom Right Gradient Blob */}
            <div
                className="absolute bottom-0 right-0 w-[800px] h-[800px] rounded-full pointer-events-none z-0"
                style={{
                    background: 'rgba(96, 62, 37, 0.60)',
                    filter: 'blur(200px)',
                    transform: 'translate(30%, 30%)'
                }}
            />

            <div className="relative z-10">
                {/* Header */}
                <div className="w-full flex justify-start mb-10">
                    <h2
                        style={{
                            fontSize: 'clamp(2rem, 8vw, 4rem)',
                            fontWeight: '700',
                            color: '#FFFFFF',
                            margin: 0,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                        }}
                    >
                        DIGITAL MAGAZINE
                    </h2>
                </div>

                {/* CREATIVE BENTO GRID - Limited to 2 rows with a fade effect */}
                <div className="relative group/mag">
                    <div
                        className="
            grid grid-cols-2 md:grid-cols-4
            gap-3 sm:gap-4
            overflow-hidden
            max-h-[400px] sm:max-h-[550px] md:max-h-[750px]
            relative
          "
                    >
                        {/* 1. Item 1: 2 columns, 1 row -> wide, fills height of row 1 */}
                        <div className="col-span-2 row-span-1">
                            <TiltedCard
                                imageSrc="/video/starscollidemv.mp4"
                                altText="Stars Collide MV"
                                containerHeight="100%"
                                containerWidth="100%"
                                imageHeight="100%"
                                imageWidth="100%"
                                rotateAmplitude={15}
                                showTooltip={false}
                            />
                        </div>

                        {/* 2. Item 2: 1 column, 1 row -> aspect square */}
                        <div className="col-span-1 row-span-1 aspect-square">
                            <TiltedCard
                                imageSrc="/chain.webp"
                                altText="ROV Chain"
                                containerHeight="100%"
                                containerWidth="100%"
                                imageHeight="100%"
                                imageWidth="100%"
                                rotateAmplitude={15}
                                showTooltip={false}
                            />
                        </div>

                        {/* 3. Item 3: 1 column, 2 rows (spans both) -> fills both rows + gap */}
                        <div className="col-span-1 row-span-2">
                            <TiltedCard
                                imageSrc="/woman2.webp"
                                altText="Vices"
                                containerHeight="100%"
                                containerWidth="100%"
                                imageHeight="100%"
                                imageWidth="100%"
                                rotateAmplitude={15}
                                showTooltip={false}
                            />
                        </div>

                        {/* 4. Item 4: 1 column, 1 row -> aspect square */}
                        <div className="col-span-1 row-span-1 aspect-square">
                            <TiltedCard
                                imageSrc="/ddk_1.webp"
                                altText="DDK Album"
                                containerHeight="100%"
                                containerWidth="100%"
                                imageHeight="100%"
                                imageWidth="100%"
                                rotateAmplitude={15}
                                showTooltip={false}
                            />
                        </div>

                        {/* 5. Item 5: 2 columns, 1 row -> wide, fills height of row 2 */}
                        <div className="col-span-2 row-span-1">
                            <TiltedCard
                                imageSrc="/james.mp4"
                                altText="Open Verse"
                                containerHeight="100%"
                                containerWidth="100%"
                                imageHeight="100%"
                                imageWidth="100%"
                                rotateAmplitude={15}
                                showTooltip={false}
                            />
                        </div>

                        {/* Fade Overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#110808] to-transparent z-20 pointer-events-none" />
                    </div>

                    {/* View More Button Removed */}
                </div>
            </div>
        </div>
    );
};

export default DigiMagCtrlA;

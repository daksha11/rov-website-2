"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import TrueFocus from "./TrueFocus";
import TiltedCard from "./TitledCard";

const DigiMag = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4" id="digi-mag">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-2 md:mb-4">
        <TrueFocus
          sentence="DIGI MAG"
          manualMode={false}
          blurAmount={5}
          borderColor="rgba(6, 247, 255, 0.7)"
          glowColor="rgba(255, 255, 255, 0.6)"
          animationDuration={0.3}
          pauseBetweenAnimations={1.5}
        />
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-4 gap-1 sm:gap-4 auto-rows-[120px] sm:auto-rows-[150px] md:auto-rows-[300px]">
        {/* Large Feature Image */}
        <div className="relative col-span-2 row-span-2 group overflow-visible">
          <TiltedCard
            imageSrc="/ctltrackprint.jpg"
            altText="Change My Mind"
            captionText="Explore the Future of Innovation"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            scaleOnHover={1}
            rotateAmplitude={15}
            showMobileWarning={false}
            showTooltip={false}
            displayOverlayContent={true}
          />
        </div>

        {/* Filling Smaller Images */}
        <div className="relative col-span-1 row-span-1 group overflow-visible">
          <TiltedCard
            imageSrc="/ddk_1.png"
            altText="Birthday"
            captionText="Celebrate Life's Moments"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            scaleOnHover={1}
            rotateAmplitude={15}
            showMobileWarning={false}
            showTooltip={false}
            displayOverlayContent={true}
          />
        </div>

        {/* Video 1 */}
        <div className="relative col-span-1 row-span-1 group overflow-visible">
          <TiltedCard
            imageSrc="/ddk_vid_1.mp4"
            altText="Video 1"
            captionText="Dynamic Visuals"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            scaleOnHover={1}
            rotateAmplitude={15}
            showMobileWarning={false}
            showTooltip={false}
            displayOverlayContent={true}
          />
        </div>

        <div className="relative col-span-1 row-span-2 group overflow-visible">
          <TiltedCard
            imageSrc="/woman2.png"
            altText="Wedding"
            captionText="Timeless Elegance"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            scaleOnHover={1}
            rotateAmplitude={15}
            showMobileWarning={false}
            showTooltip={false}
            displayOverlayContent={true}
          />
        </div>

        {/* Filling the middle gap */}
        <div className="relative col-span-1 row-span-1 group overflow-visible">
          <TiltedCard
            imageSrc="/ddk_2.png"
            altText="Travel"
            captionText="Discover New Horizons"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            scaleOnHover={1}
            rotateAmplitude={15}
            showMobileWarning={false}
            showTooltip={false}
            displayOverlayContent={true}
          />
        </div>

        {/* Video 2 */}
        <div className="relative col-span-2 row-span-1 group overflow-visible">
          <TiltedCard
            imageSrc="/james.mp4"
            altText="Video 2"
            captionText="Cinematic Experience"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            scaleOnHover={1}
            rotateAmplitude={15}
            showMobileWarning={false}
            showTooltip={false}
            displayOverlayContent={true}
          />
        </div>

        {/* Bottom Row Fix */}
        <div className="relative col-span-1 row-span-1 group overflow-visible">
          <TiltedCard
            imageSrc="/cover7.png"
            altText="Food"
            captionText="Savor the Flavors"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            scaleOnHover={1}
            rotateAmplitude={15}
            showMobileWarning={false}
            showTooltip={false}
            displayOverlayContent={true}
          />
        </div>

        <div className="relative col-span-1 row-span-1 group overflow-visible">
          <TiltedCard
            imageSrc="/art showcase.png"
            altText="Art"
            captionText="Artistic Expressions"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            scaleOnHover={1}
            rotateAmplitude={15}
            showMobileWarning={false}
            showTooltip={false}
            displayOverlayContent={true}
          />
        </div>

        <div className="relative col-span-2 row-span-1 group overflow-visible">
          <TiltedCard
            imageSrc="/event_3.jpg"
            altText="Photography"
            captionText="Capture the Moment"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            scaleOnHover={1}
            rotateAmplitude={15}
            showMobileWarning={false}
            showTooltip={false}
            displayOverlayContent={true}
          />
        </div>

        {/* Video 3 */}
        <div className="relative col-span-1 row-span-1 group overflow-visible">
          <TiltedCard
            imageSrc="/ddk_vid_2.mp4"
            altText="Video 3"
            captionText="Immersive Content"
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            scaleOnHover={1}
            rotateAmplitude={15}
            showMobileWarning={false}
            showTooltip={false}
            displayOverlayContent={true}
          />
        </div>
      </div>
    </div>
  );
};

export default DigiMag;
"use client";
import React, { useState } from 'react';

const Gallery: React.FC = () => {
  const images = [
    '/cover1.png', // Path to images in the public folder
    '/cover2.png',
    '/cover1.png',
    '/cover2.png',
    '/cover1.png', // Add more images for better rotation
    '/cover2.png',
    '/cover1.png', // Path to images in the public folder
    '/cover2.png',
    '/cover1.png',
    '/cover2.png',
    '/cover1.png', // Add more images for better rotation
    '/cover2.png',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Helper function to get the indices for all visible cards
  const getVisibleIndices = () => {
    const getIndex = (index: number) => (index + images.length) % images.length;

    const farFarLeftIndex = getIndex(currentIndex - 4); // New far far left card
    const farLeftIndex = getIndex(currentIndex - 3);
    const prevPrevIndex = getIndex(currentIndex - 2);
    const prevIndex = getIndex(currentIndex - 1);
    const nextIndex = getIndex(currentIndex + 1);
    const nextNextIndex = getIndex(currentIndex + 2);
    const farRightIndex = getIndex(currentIndex + 3);
    const farFarRightIndex = getIndex(currentIndex + 4); // New far far right card

    return {
      farFarLeftIndex,
      farLeftIndex,
      prevPrevIndex,
      prevIndex,
      currentIndex,
      nextIndex,
      nextNextIndex,
      farRightIndex,
      farFarRightIndex,
    };
  };

  const {
    farFarLeftIndex,
    farLeftIndex,
    prevPrevIndex,
    prevIndex,
    currentIndex: currIndex,
    nextIndex,
    nextNextIndex,
    farRightIndex,
    farFarRightIndex,
  } = getVisibleIndices();

  return (
    <div
      style={{
        position: 'relative',
        width: '100%', // Full width of the screen
        height: '400px', // Fixed height for the slider
        margin: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden', // Ensure the images don't overflow the container
      }}
    >
      {/* Far Far Left Card */}
      <div
        style={{
          position: 'absolute',
          left: '5%', // Adjusted for symmetry
          transform: 'translateX(-50%) scale(0.5)', // Same size as farFarRight
          transition: 'transform 0.3s',
          zIndex: 0, // Adjusted z-index
        }}
      >
        <img
          src={images[farFarLeftIndex]}
          alt={`Far Far Left Slide`}
          style={{
            width: '200px', // Fixed width for the card
            height: '200px', // Fixed height for the card
            objectFit: 'cover', // Ensure the image covers the container without distorting
            borderRadius: '8px', // Slightly rounded corners for the image
          }}
        />
      </div>

      {/* Far Left Card */}
      <div
        style={{
          position: 'absolute',
          left: '15%',
          transform: 'translateX(-50%) scale(0.6)', // Smaller and shifted to the left
          transition: 'transform 0.3s',
          zIndex: 1, // Adjusted z-index
        }}
      >
        <img
          src={images[farLeftIndex]}
          alt={`Far Left Slide`}
          style={{
            width: '250px', // Fixed width for the card
            height: '250px', // Fixed height for the card
            objectFit: 'cover', // Ensure the image covers the container without distorting
            borderRadius: '8px', // Slightly rounded corners for the image
          }}
        />
      </div>

      {/* Previous Previous Card */}
      <div
        style={{
          position: 'absolute',
          left: '25%',
          transform: 'translateX(-50%) scale(0.7)', // Smaller and shifted to the left
          transition: 'transform 0.3s',
          zIndex: 2, // Adjusted z-index
        }}
      >
        <img
          src={images[prevPrevIndex]}
          alt={`Previous Previous Slide`}
          style={{
            width: '300px', // Fixed width for the card
            height: '300px', // Fixed height for the card
            objectFit: 'cover', // Ensure the image covers the container without distorting
            borderRadius: '8px', // Slightly rounded corners for the image
          }}
        />
      </div>

      {/* Previous Card */}
      <div
        style={{
          position: 'absolute',
          left: '35%',
          transform: 'translateX(-50%) scale(0.8)', // Smaller and shifted to the left
          transition: 'transform 0.3s',
          zIndex: 3, // Adjusted z-index
        }}
      >
        <img
          src={images[prevIndex]}
          alt={`Previous Slide`}
          style={{
            width: '400px', // Fixed width for the card
            height: '400px', // Fixed height for the card
            objectFit: 'cover', // Ensure the image covers the container without distorting
            borderRadius: '8px', // Slightly rounded corners for the image
          }}
        />
      </div>

      {/* Current Card */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)', // Center the current card
          zIndex: 4, // Higher z-index to bring it to the front
          transition: 'transform 0.3s',
        }}
      >
        <img
          src={images[currIndex]}
          alt={`Current Slide`}
          style={{
            width: '500px', // Fixed width for the card
            height: '500px', // Fixed height for the card
            objectFit: 'cover', // Ensure the image covers the container without distorting
            borderRadius: '8px', // Slightly rounded corners for the image
          }}
        />
      </div>

      {/* Next Card */}
      <div
        style={{
          position: 'absolute',
          left: '65%',
          transform: 'translateX(-50%) scale(0.8)', // Smaller and shifted to the right
          transition: 'transform 0.3s',
          zIndex: 3, // Adjusted z-index
        }}
      >
        <img
          src={images[nextIndex]}
          alt={`Next Slide`}
          style={{
            width: '400px', // Fixed width for the card
            height: '400px', // Fixed height for the card
            objectFit: 'cover', // Ensure the image covers the container without distorting
            borderRadius: '8px', // Slightly rounded corners for the image
          }}
        />
      </div>

      {/* Next Next Card */}
      <div
        style={{
          position: 'absolute',
          left: '75%',
          transform: 'translateX(-50%) scale(0.7)', // Smaller and shifted to the right
          transition: 'transform 0.3s',
          zIndex: 2, // Adjusted z-index
        }}
      >
        <img
          src={images[nextNextIndex]}
          alt={`Next Next Slide`}
          style={{
            width: '300px', // Fixed width for the card
            height: '300px', // Fixed height for the card
            objectFit: 'cover', // Ensure the image covers the container without distorting
            borderRadius: '8px', // Slightly rounded corners for the image
          }}
        />
      </div>

      {/* Far Right Card */}
      <div
        style={{
          position: 'absolute',
          left: '85%',
          transform: 'translateX(-50%) scale(0.6)', // Smaller and shifted to the right
          transition: 'transform 0.3s',
          zIndex: 1, // Adjusted z-index
        }}
      >
        <img
          src={images[farRightIndex]}
          alt={`Far Right Slide`}
          style={{
            width: '250px', // Fixed width for the card
            height: '250px', // Fixed height for the card
            objectFit: 'cover', // Ensure the image covers the container without distorting
            borderRadius: '8px', // Slightly rounded corners for the image
          }}
        />
      </div>

      {/* Far Far Right Card */}
      <div
        style={{
          position: 'absolute',
          left: '91%', // Adjusted for symmetry
          transform: 'scale(0.5)', // Same size as farFarLeft
          transition: 'translateX(-50%) transform 0.3s',
          zIndex: 0, // Adjusted z-index
        }}
      >
        <img
          src={images[farFarRightIndex]}
          alt={`Far Far Right Slide`}
          style={{
            width: '200px', // Fixed width for the card
            height: '200px', // Fixed height for the card
            objectFit: 'cover', // Ensure the image covers the container without distorting
            borderRadius: '8px', // Slightly rounded corners for the image
          }}
        />
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        style={{
          position: 'absolute',
          top: '50%',
          left: '20px',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          border: 'none',
          padding: '12px',
          cursor: 'pointer',
          borderRadius: '50%', // Make the button circular
          zIndex: 5, // Ensure the button is above all cards
        }}
      >
        &#10094; {/* Left arrow */}
      </button>
      <button
        onClick={nextSlide}
        style={{
          position: 'absolute',
          top: '50%',
          right: '20px',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          border: 'none',
          padding: '12px',
          cursor: 'pointer',
          borderRadius: '50%', // Make the button circular
          zIndex: 5, // Ensure the button is above all cards
        }}
      >
        &#10095; {/* Right arrow */}
      </button>
    </div>
  );
};

export default Gallery;
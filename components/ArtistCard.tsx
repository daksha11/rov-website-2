import React, { useState } from 'react';

interface ArtistCardProps {
    imageUrl: string;
    name: string;
    description: string;
    textPosition?: 'above' | 'below'; // Add textPosition prop
    padding?: string; // Add padding prop
}

const ArtistCard: React.FC<ArtistCardProps> = ({ imageUrl, name, description, textPosition = 'below', padding = '20px' }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const cardStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: textPosition === 'below' ? 'column' : 'column-reverse', // Adjust flexDirection based on textPosition
      alignItems: 'center',
      textAlign: 'center',
      overflow: 'hidden',
      transition: 'transform 0.2s ease',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      maxWidth: '100%', // Ensure the card takes full width within its container
      width: '100%', // Ensure the card takes full width
      padding: padding, // Apply padding to the entire card
    };

    const cardHoverStyle: React.CSSProperties = {
      transform: 'translateY(-5px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    };

    const imageContainerStyle: React.CSSProperties = {
      overflow: 'hidden',
      width: '80%',
      height: 'auto',
      flexShrink: 0, // Prevent the image container from shrinking
    };

    const imageStyle: React.CSSProperties = {
        width: '100%', // Ensure the image takes full width of its container
        height: 'auto', // Maintain aspect ratio
        display: 'block',
        transition: 'filter 0.3s ease',
        filter: isHovered ? 'grayscale(0%)' : 'grayscale(100%)',
    };

    const infoStyle: React.CSSProperties = {
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%', // Ensure the info section takes full width
        padding: padding, // Apply padding to the info section
    };

    const infoHeadingStyle: React.CSSProperties = {
      marginBottom: '12px', // Increased margin for better spacing
      fontSize: '24px', // Increased font size for the name
      fontWeight: 600,
    };

    const infoParagraphStyle: React.CSSProperties = {
      fontSize: '16px', // Increased font size for the description
      color: '#666',
    };
    
    return (
        <div 
            style={isHovered ? { ...cardStyle, ...cardHoverStyle} : cardStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div style={imageContainerStyle}>
                <img 
                  src={imageUrl} 
                  alt={name} 
                  style={imageStyle}
                />
            </div>
            <div style={infoStyle}>
                <h3 style={infoHeadingStyle}>{name}</h3>
                <p style={infoParagraphStyle}>{description}</p>
            </div>
        </div>
    );
};

export default ArtistCard;
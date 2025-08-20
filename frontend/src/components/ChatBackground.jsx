import React from 'react';
// Import all city images so Vite includes them in the build
import GilroyImg from '../assets/Gilroy.png';
import ModestoImg from '../assets/Modesto.png';
import SalinasImg from '../assets/Salinas.png';
import StocktonImg from '../assets/Stockton.png';
import WatsonvilleImg from '../assets/Watsonville.png';
import WelcomeBannerImg from '../assets/welcome-banner2.jpeg';

function ChatBackground({ animationType = 'animated', showDust = true, location = '' }) {
    const getBackgroundClass = () => {
        switch (animationType) {
            case 'static':
                return 'chat-background static-mode';
            case 'paused':
                return 'chat-background paused-mode';
            case 'animated':
            default:
                return 'chat-background';
        }
    };

    const getCityImage = () => {
        // Extract single word location and match to available city images
        const singleWordLocation = location.trim().split(/\s+/)[0];
        
        // Map city names to imported images
        const cityImages = {
            'gilroy': GilroyImg,
            'modesto': ModestoImg,
            'salinas': SalinasImg,
            'stockton': StocktonImg,
            'watsonville': WatsonvilleImg
        };
        
        // Check if the location matches any of our available city images
        const cityImage = cityImages[singleWordLocation.toLowerCase()];
        
        if (cityImage) {
            return cityImage;
        }
        
        // Fallback to welcome banner if no city match found
        return WelcomeBannerImg;
    };

    return (
        <div className={getBackgroundClass()}>
            {/* Static background image for single-word locations */}
            {animationType === 'static' && (
                <div className="static-background">
                    <img 
                        src={getCityImage()} 
                        alt={`${location} view`}
                        className="static-background-image"
                    />
                </div>
            )}
            
            {/* Animated background elements */}
            {animationType !== 'static' && (
                <>
                    <div className="chat-bg-layer" />
                    <div className="chat-ground" />
                    <div className="chat-road-stripe" />

                    {/* Scrolling rocks */}
                    <div className="chat-rock r1" />
                    <div className="chat-rock r2" />
                    <div className="chat-rock r3" />
                    <div className="chat-rock r4" />

                    {/* Scrolling trees */}
                    <div className="chat-tree t1">
                        <div className="trunk" />
                        <div className="canopy" />
                    </div>
                    <div className="chat-tree t2">
                        <div className="trunk" />
                        <div className="canopy" />
                    </div>
                    <div className="chat-tree t3">
                        <div className="trunk" />
                        <div className="canopy" />
                    </div>

                    {/* Clouds and sun */}
                    <div className="chat-cloud c1" />
                    <div className="chat-cloud c2" />
                    <div className="chat-cloud c3" />
                    <div className="chat-sun" />

                    {/* Distant mountains */}
                    <div className="chat-mountains">
                        <div className="m m1" />
                        <div className="m m2" />
                        <div className="m m3" />
                    </div>

                    {/* Dust particles near car - only show if showDust is true */}
                    {showDust && (
                        <div className="chat-dust">
                            <span className="p p1" />
                            <span className="p p2" />
                            <span className="p p3" />
                            <span className="p p4" />
                            <span className="p p5" />
                            <span className="p p6" />
                            <span className="p p7" />
                            <span className="p p8" />
                            <span className="p p9" />
                            <span className="p p10" />
                            <span className="p p11" />
                            <span className="p p12" />
                            <span className="p p13" />
                            <span className="p p14" />
                        </div>
                    )}
                    
                    {/* Car always visible in animated modes */}
                    <img
                        src="/images/red-sports-car.png"
                        alt="Red sports car"
                        className="chat-car"
                    />
                </>
            )}
        </div>
    );
}

export default ChatBackground;



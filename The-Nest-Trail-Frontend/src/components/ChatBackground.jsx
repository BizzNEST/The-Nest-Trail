import React from 'react';

function ChatBackground() {
    return (
        <div className="chat-background">
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

            {/* Dust particles near car */}
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
            <img
                src="/images/red-sports-car.png"
                alt="Red sports car"
                className="chat-car"
            />
        </div>
    );
}

export default ChatBackground;



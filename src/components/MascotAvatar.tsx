'use client'

import React, { useState, useRef, useEffect } from 'react';

const MascotAvatar = () => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Array of mascot frame images in order
  const mascotFrames = [
    '/mascot/broccoli-mascot-0.png',
    '/mascot/broccoli-mascot-1.png',
    '/mascot/broccolli-mascot-2.png',
    '/mascot/broccolli-mascot-3.png'
  ];

  useEffect(() => {
    // Preload all images
    const preloadImages = async () => {
      const imagePromises = mascotFrames.map(src => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = src;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error('Failed to load mascot images:', error);
        // Fallback: still show animation even if some images fail
        setImagesLoaded(true);
      }
    };

    preloadImages();
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;

    let sequenceIndex = 0;
    const sequence = [0, 1, 2, 3, 2, 1]; // Back and forth pattern

    // Create animation cycle that goes through frames
    const animationInterval = setInterval(() => {
      setCurrentFrame(sequence[sequenceIndex]);
      sequenceIndex = (sequenceIndex + 1) % sequence.length;
    }, 200); // Change frame every 200ms for smooth animation

    return () => clearInterval(animationInterval);
  }, [imagesLoaded]);

  return (
    <div className="relative flex flex-col items-center">
      {/* Floating elements around mascot */}
      <div className="absolute -top-2 -left-2 w-8 h-8 bg-yellow-400 rounded-full opacity-70 animate-bounce" style={{ animationDelay: '0s' }}></div>
      <div className="absolute -top-4 -right-4 w-6 h-6 bg-orange-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute -bottom-2 -left-4 w-4 h-4 bg-red-400 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '1s' }}></div>
      <div className="absolute -bottom-4 -right-2 w-5 h-5 bg-pink-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '1.5s' }}></div>

      {/* Main mascot container with enhanced styling */}
      <div className="relative w-36 h-36 mb-4">
        {/* Outer glow ring */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-full animate-pulse opacity-30 scale-110"></div>

        {/* Middle ring with subtle animation */}
        <div className="absolute inset-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full shadow-lg border-2 border-white/50 backdrop-blur-sm"></div>

        {/* Inner container for mascot */}
        <div className="absolute inset-3 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 shadow-inner">
          {imagesLoaded ? (
            <img
              src={mascotFrames[currentFrame]}
              alt="Waving mascot"
              className="w-full h-full object-contain transition-all duration-300 hover:scale-105"
              style={{ imageRendering: 'crisp-edges' }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center animate-pulse">
              <div className="text-white text-3xl animate-bounce">🥦</div>
            </div>
          )}
        </div>

        {/* Sparkle effects */}
        <div className="absolute top-4 right-4 text-yellow-400 animate-ping">✨</div>
        <div className="absolute bottom-6 left-6 text-orange-400 animate-ping" style={{ animationDelay: '0.5s' }}>⭐</div>
        <div className="absolute top-8 left-2 text-pink-400 animate-ping" style={{ animationDelay: '1s' }}>💫</div>
      </div>

      {/* Mascot name/title */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg mb-3 animate-pulse">
        Chef Broccoli
      </div>
    </div>
  );
};

export default MascotAvatar;

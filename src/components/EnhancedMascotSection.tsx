'use client';

import React from 'react';
import MascotAvatar from './MascotAvatar';
interface EnhancedMascotSectionProps {
  mascotMessage: string;
}

const EnhancedMascotSection: React.FC<EnhancedMascotSectionProps> = ({ mascotMessage }) => {
  return (
    <div className="relative bg-gradient-to-br from-white/80 via-green-50/80 to-emerald-50/80 backdrop-blur-sm rounded-3xl p-12 mb-8 shadow-2xl border border-white/30 animate__animated animate__bounceIn overflow-hidden">

      {/* Background decorative blobs */}
      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-green-300/20 to-emerald-300/20 rounded-full -translate-x-10 -translate-y-10" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-orange-300/20 to-yellow-300/20 rounded-full translate-x-16 translate-y-16" />
      <div className="absolute top-1/2 left-8 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      <div className="absolute top-1/4 right-12 w-3 h-3 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-1/3 right-8 w-1 h-1 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-10">
        <MascotAvatar />
        <div className="text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl inline-block max-w-md border border-white/50 relative">

            {/* Speech bubble tail */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white/90 rotate-45 border-l border-t border-white/50" />

            <p className="text-gray-700 font-medium text-lg leading-relaxed relative z-10">
              {mascotMessage}
            </p>

            {/* Subtle decorative emojis */}
            <div className="absolute top-2 right-2 text-green-400 opacity-50">🌿</div>
            <div className="absolute bottom-2 left-2 text-orange-400 opacity-50">🍳</div>
          </div>
        </div>
      </div>

      {/* Floating ingredient icons */}
      <div className="absolute top-16 left-16 text-2xl opacity-30 animate-float">🥕</div>
      <div className="absolute top-24 right-20 text-xl opacity-25 animate-float" style={{ animationDelay: '1s' }}>🍅</div>
      <div className="absolute bottom-20 left-12 text-lg opacity-20 animate-float" style={{ animationDelay: '2s' }}>🧄</div>
      <div className="absolute bottom-16 right-16 text-xl opacity-25 animate-float" style={{ animationDelay: '0.5s' }}>🧅</div>
    </div>
  );
};

export default EnhancedMascotSection;


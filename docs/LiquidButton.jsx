"use client";
import React, { useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export default function LiquidButton() {
  const buttonRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // High-performance spring physics for ultra-smooth 60fps animations
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    
    // Calculate center relative to the button
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Distance from the center (Magnetic pull)
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    x.set(distanceX * 0.6); // 60% pull strength
    y.set(distanceY * 0.6);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  // Subtle parallax for the text inside the button
  const textX = useTransform(x, (latest) => latest * 0.2);
  const textY = useTransform(y, (latest) => latest * 0.2);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f1014]">
      
      {/* --- LAYER 0: Invisible SVG Filter for the Liquid Math --- */}
      <svg className="absolute w-0 h-0">
        <filter id="liquid-goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  
                    0 1 0 0 0  
                    0 0 1 0 0  
                    0 0 0 25 -10"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </svg>

      <div
        ref={buttonRef}
        className="relative flex items-center justify-center p-12 cursor-pointer z-10"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        
        {/* --- LAYER 1: Liquid Filter Container (The Blob) --- */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ filter: "url(#liquid-goo)" }}
        >
          {/* Base Button Shape */}
          <div className="absolute w-44 h-16 bg-[#0047ff] rounded-[32px] transition-all duration-300" />

          {/* Floating Blob tracking the cursor */}
          <motion.div
            className="absolute w-20 h-20 bg-[#0047ff] rounded-full"
            style={{
              x,
              y,
              scale: isHovered ? 1.4 : 0.5,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          />
        </div>

        {/* --- LAYER 2: Luxury Texture & 3D Lighting Overlay --- */}
        {/* Aa layer filter ni bahar che etle lighting sharp rehshe */}
        <div 
          className="absolute w-44 h-16 rounded-[32px] pointer-events-none z-10 mix-blend-overlay"
          style={{
            // 3D Glassmorphism Highlights
            background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)",
            boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.3), inset 0px -4px 10px rgba(0,0,0,0.4), 0px 10px 30px rgba(0,71,255,0.4)",
            // Premium Noise Texture (Like fabric/matte plastic)
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`
          }}
        />

        {/* --- LAYER 3: Crisp Text with Parallax --- */}
        <motion.div
          className="relative z-20 text-white font-bold text-xl tracking-wide pointer-events-none select-none"
          style={{ x: textX, y: textY }}
        >
          Explore
        </motion.div>
        
      </div>
    </div>
  );
}
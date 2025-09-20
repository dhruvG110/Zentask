"use client";
import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import * as THREE from "three";

export default function VantaGlobe() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  useEffect(() => {
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <>
      {/* Load Vanta.js from CDN */}
      <Script
        src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (!vantaEffect && window.VANTA && vantaRef.current) {
            setVantaEffect(
              window.VANTA.GLOBE({
                el: vantaRef.current,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.0,
                minWidth: 200.0,
                scale: 1.0,
                scaleMobile: 1.0,
                color: 0x000000  ,
                size: 1.1,
                backgroundColor: 0xfcfcfc,
                THREE: THREE,
              })
            );
          }
        }}
      />
      {/* Background container */}
      <div
        ref={vantaRef}
        className="vanta-bg"
      />
    </>
  );
}

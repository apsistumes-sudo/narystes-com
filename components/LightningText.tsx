'use client';
import { useEffect, useRef, useState } from 'react';

export default function LightningText({
  active,
  text,
  mobile,
}: {
  active: boolean;
  text: string;
  mobile: boolean;
}) {
  const [flash1,    setFlash1]    = useState(false);
  const [flash2,    setFlash2]    = useState(false);
  const [showText,  setShowText]  = useState(false);
  const [textPulse, setTextPulse] = useState(false);
  const schedulerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      setShowText(true);
      return;
    }

    // Initial reveal
    setFlash1(true);
    setTimeout(() => setFlash1(false), 180);
    setTimeout(() => setFlash2(true),  260);
    setTimeout(() => setFlash2(false), 380);
    setTimeout(() => setShowText(true), 300);

    // Recurring lightning
    const fireLightning = () => {
      if (document.visibilityState === 'hidden') {
        schedulerRef.current = setTimeout(fireLightning, 5000);
        return;
      }
      setFlash1(true);
      setTextPulse(true);
      setTimeout(() => setFlash1(false), 120);
      setTimeout(() => setFlash2(true),  180);
      setTimeout(() => setFlash2(false), 260);
      setTimeout(() => setTextPulse(false), 600);
      schedulerRef.current = setTimeout(fireLightning, 8000 + Math.random() * 6000);
    };

    schedulerRef.current = setTimeout(fireLightning, 9000);

    return () => {
      if (schedulerRef.current) clearTimeout(schedulerRef.current);
    };
  }, [active]);

  const textShadow = textPulse
    ? '0 0 36px rgba(255,255,255,0.7), 0 0 72px rgba(255,255,255,0.4)'
    : '0 0 24px rgba(255,255,255,0.4), 0 0 48px rgba(255,255,255,0.2)';

  return (
    <>
      <div
        className={`pointer-events-none absolute inset-0 bg-white transition-opacity duration-[120ms] ${flash1 ? 'opacity-90' : 'opacity-0'}`}
        style={{ zIndex: 30 }}
      />
      <div
        className={`pointer-events-none absolute inset-0 bg-white transition-opacity duration-[80ms] ${flash2 ? 'opacity-60' : 'opacity-0'}`}
        style={{ zIndex: 30 }}
      />
      {text && (
        <div
          className={`pointer-events-none absolute inset-x-0 flex justify-center px-4 transition-all duration-500 ease-out ${mobile ? 'top-[16%]' : 'top-[14%]'} ${showText ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.92]'}`}
          style={{ zIndex: 25 }}
        >
          <h1
            className={`text-white font-bold tracking-tight text-center transition-[text-shadow] duration-300 ${mobile ? 'text-4xl' : 'text-6xl md:text-7xl'}`}
            style={{ fontFamily: 'var(--font-space)', textShadow }}
          >
            {text}
          </h1>
        </div>
      )}
    </>
  );
}

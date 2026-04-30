'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import RainRenderer from './rain-renderer';
import Raindrops from './raindrops';
import loadImages from './image-loader';
import createCanvas from './create-canvas';
import { weatherData } from './rain-utils';

// Use public assets directly as string paths
const DROP_COLOR = '/rain-assets/drop-color.png';
const DROP_ALPHA = '/rain-assets/drop-alpha.png';

const RainEffect = ({ type = 'rain', backgroundImageUrl }) => {
  const canvasRef = useRef(null);
  const stateRef = useRef({});

  useEffect(() => {
    if (!backgroundImageUrl || typeof window === 'undefined') return;

    const s = stateRef.current;
    let destroyed = false;

    const bgImg = new window.Image();
    bgImg.crossOrigin = 'anonymous';
    bgImg.src = backgroundImageUrl;

    bgImg.onload = () => {
      if (destroyed) return;
      s.textureFgSize = { width: bgImg.naturalWidth, height: bgImg.naturalHeight };
      s.textureBgSize = { width: bgImg.naturalWidth, height: bgImg.naturalHeight };

      loadImages([
        { name: 'dropAlpha', src: DROP_ALPHA },
        { name: 'dropColor', src: DROP_COLOR },
      ]).then((images) => {
        if (destroyed) return;
        s.dropColor = images.dropColor.img;
        s.dropAlpha = images.dropAlpha.img;
        init(bgImg);
      });
    };

    const init = (bgImg) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpi = window.devicePixelRatio || 1;
      canvas.width  = canvas.offsetWidth  * dpi;
      canvas.height = canvas.offsetHeight * dpi;

      s.raindrops = new Raindrops(
        canvas.width, canvas.height, dpi,
        s.dropAlpha, s.dropColor,
        {
          trailRate: 1,
          trailScaleRange: [0.2, 0.45],
          collisionRadius: 0.45,
          dropletsCleaningRadiusMultiplier: 0.28,
        }
      );

      s.textureFg = createCanvas(s.textureFgSize.width, s.textureFgSize.height);
      s.textureBg = createCanvas(s.textureBgSize.width, s.textureBgSize.height);
      const fgCtx = s.textureFg.getContext('2d');
      const bgCtx = s.textureBg.getContext('2d');
      fgCtx.drawImage(bgImg, 0, 0, s.textureFgSize.width, s.textureFgSize.height);
      bgCtx.drawImage(bgImg, 0, 0, s.textureBgSize.width, s.textureBgSize.height);

      s.renderer = new RainRenderer(
        canvas, s.raindrops.canvas, s.textureFg, s.textureBg, null,
        { brightness: 1.04, alphaMultiply: 16, alphaSubtract: 4, minRefraction: 128 }
      );

      const curWeather = { ...weatherData[type], fg: bgImg, bg: bgImg };
      s.raindrops.options = Object.assign(s.raindrops.options, curWeather);
      s.raindrops.clearDrops();
    };

    return () => {
      destroyed = true;
      if (s.renderer) {
        try { s.renderer.destroy?.(); } catch (_) {}
      }
      stateRef.current = {};
    };
  }, [backgroundImageUrl, type]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: 'block' }}
    />
  );
};

export default RainEffect;

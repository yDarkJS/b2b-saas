import { useEffect, useRef } from 'react';
import { useTransition } from './TransitionContext';

interface RainDrop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  width: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  speed: number;
}

interface Splash {
  x: number;
  y: number;
  particles: { x: number; y: number; vx: number; vy: number; opacity: number; size: number }[];
  age: number;
}

export function RainTransitionCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state } = useTransition();
  const animationRef = useRef<number>();
  const rainDropsRef = useRef<RainDrop[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const splashesRef = useRef<Splash[]>([]);
  const timeRef = useRef(0);
  const intensityRef = useRef(0);

  useEffect(() => {
    if (!state.isTransitioning) {
      rainDropsRef.current = [];
      ripplesRef.current = [];
      splashesRef.current = [];
      intensityRef.current = 0;
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize rain drops
    const initRainDrops = (count: number) => {
      for (let i = 0; i < count; i++) {
        rainDropsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          length: Math.random() * 30 + 20,
          speed: Math.random() * 15 + 20,
          opacity: Math.random() * 0.5 + 0.3,
          width: Math.random() * 2 + 1,
        });
      }
    };

    const createRipple = (x: number, y: number) => {
      ripplesRef.current.push({
        x,
        y,
        radius: 0,
        maxRadius: Math.random() * 30 + 20,
        opacity: 0.6,
        speed: Math.random() * 2 + 1,
      });
    };

    const createSplash = (x: number, y: number) => {
      const particleCount = Math.floor(Math.random() * 5) + 3;
      const particles = [];
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.PI + (Math.random() - 0.5) * Math.PI;
        const speed = Math.random() * 3 + 2;
        particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          opacity: 0.8,
          size: Math.random() * 3 + 1,
        });
      }
      splashesRef.current.push({ x, y, particles, age: 0 });
    };

    const animate = (timestamp: number) => {
      const deltaTime = (timestamp - timeRef.current) / 16;
      timeRef.current = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate intensity based on phase
      let targetIntensity = 0;
      if (state.phase === 'suspend') targetIntensity = 0.2;
      else if (state.phase === 'fragment') targetIntensity = 0.6;
      else if (state.phase === 'dust') targetIntensity = 1;
      else if (state.phase === 'converge') targetIntensity = 0.8;
      else if (state.phase === 'materialize') targetIntensity = 0.3;

      intensityRef.current += (targetIntensity - intensityRef.current) * 0.05;

      // Add more rain drops based on intensity
      const targetDrops = Math.floor(200 * intensityRef.current);
      while (rainDropsRef.current.length < targetDrops) {
        rainDropsRef.current.push({
          x: Math.random() * canvas.width,
          y: -50,
          length: Math.random() * 30 + 20,
          speed: Math.random() * 15 + 20,
          opacity: Math.random() * 0.5 + 0.3,
          width: Math.random() * 2 + 1,
        });
      }

      // Semi-transparent overlay with aquatic tint
      const overlayOpacity = state.phase === 'suspend' ? 0.02
        : state.phase === 'fragment' ? 0.08
        : state.phase === 'dust' ? 0.15
        : state.phase === 'converge' ? 0.12
        : 0.05;

      ctx.fillStyle = `rgba(15, 35, 60, ${overlayOpacity})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw rain drops
      rainDropsRef.current.forEach((drop, index) => {
        // Update position
        drop.y += drop.speed * deltaTime * intensityRef.current;
        drop.x += Math.sin(timestamp * 0.001 + index) * 0.3; // Slight wind effect

        // Reset when off screen
        if (drop.y > canvas.height) {
          // Create ripple and splash at impact point
          if (Math.random() < 0.3 * intensityRef.current) {
            createRipple(drop.x, canvas.height - 10);
          }
          if (Math.random() < 0.15 * intensityRef.current) {
            createSplash(drop.x, canvas.height - 5);
          }
          
          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width;
        }

        // Draw rain drop with gradient
        const gradient = ctx.createLinearGradient(drop.x, drop.y, drop.x, drop.y + drop.length);
        gradient.addColorStop(0, `rgba(150, 200, 255, 0)`);
        gradient.addColorStop(0.3, `rgba(150, 200, 255, ${drop.opacity * intensityRef.current})`);
        gradient.addColorStop(1, `rgba(200, 230, 255, ${drop.opacity * 0.8 * intensityRef.current})`);

        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = drop.width;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Add subtle glow
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.strokeStyle = `rgba(180, 220, 255, ${drop.opacity * 0.2 * intensityRef.current})`;
        ctx.lineWidth = drop.width + 2;
        ctx.stroke();
      });

      // Draw and update ripples
      ripplesRef.current = ripplesRef.current.filter(ripple => {
        ripple.radius += ripple.speed * deltaTime;
        ripple.opacity = (1 - ripple.radius / ripple.maxRadius) * 0.6;

        if (ripple.opacity <= 0) return false;

        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(150, 200, 255, ${ripple.opacity * intensityRef.current})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner ripple
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius * 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(180, 220, 255, ${ripple.opacity * 0.5 * intensityRef.current})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        return ripple.radius < ripple.maxRadius;
      });

      // Draw and update splashes
      splashesRef.current = splashesRef.current.filter(splash => {
        splash.age += deltaTime;
        
        splash.particles.forEach(particle => {
          particle.x += particle.vx * deltaTime;
          particle.y += particle.vy * deltaTime;
          particle.vy += 0.15 * deltaTime; // Gravity
          particle.opacity -= 0.02 * deltaTime;

          if (particle.opacity > 0) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(180, 220, 255, ${particle.opacity * intensityRef.current})`;
            ctx.fill();
          }
        });

        return splash.age < 30;
      });

      // Distortion effect overlay
      if (state.phase === 'dust' || state.phase === 'converge') {
        const distortionOpacity = state.phase === 'dust' ? 0.1 : 0.05;
        
        // Create water refraction effect
        for (let i = 0; i < 3; i++) {
          const y = (timestamp * 0.05 + i * canvas.height / 3) % canvas.height;
          const gradient = ctx.createLinearGradient(0, y - 20, 0, y + 20);
          gradient.addColorStop(0, 'rgba(100, 180, 230, 0)');
          gradient.addColorStop(0.5, `rgba(100, 180, 230, ${distortionOpacity * intensityRef.current})`);
          gradient.addColorStop(1, 'rgba(100, 180, 230, 0)');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(0, y - 20, canvas.width, 40);
        }
      }

      // "Washing away" effect during materialize
      if (state.phase === 'materialize') {
        const washProgress = 1 - intensityRef.current / 0.3;
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, `rgba(240, 248, 255, ${washProgress * 0.3})`);
        gradient.addColorStop(0.5, `rgba(200, 230, 255, ${washProgress * 0.2})`);
        gradient.addColorStop(1, `rgba(240, 248, 255, ${washProgress * 0.3})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    initRainDrops(50);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [state.isTransitioning, state.phase]);

  if (!state.isTransitioning) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999] pointer-events-none transition-opacity duration-500"
      style={{
        background: 'transparent',
        opacity: state.phase === 'materialize' ? 0.5 : 1,
      }}
    />
  );
}

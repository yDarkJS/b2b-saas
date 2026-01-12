import { useEffect, useRef, useCallback } from "react";

interface Wave {
  amplitude: number;
  frequency: number;
  speed: number;
  phase: number;
  yOffset: number;
  color: string;
  opacity: number;
}

interface Bubble {
  x: number;
  y: number;
  size: number;
  speed: number;
  wobble: number;
  wobbleSpeed: number;
  opacity: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  speed: number;
}

export function OceanWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);
  
  const wavesRef = useRef<Wave[]>([]);
  const bubblesRef = useRef<Bubble[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);

  const initializeElements = useCallback((width: number, height: number) => {
    // Create layered waves
    wavesRef.current = [
      { amplitude: 20, frequency: 0.008, speed: 0.0008, phase: 0, yOffset: height * 0.85, color: 'hsl(190, 90%, 45%)', opacity: 0.08 },
      { amplitude: 15, frequency: 0.012, speed: 0.0012, phase: Math.PI / 3, yOffset: height * 0.88, color: 'hsl(195, 80%, 50%)', opacity: 0.06 },
      { amplitude: 25, frequency: 0.006, speed: 0.0006, phase: Math.PI / 2, yOffset: height * 0.82, color: 'hsl(185, 85%, 48%)', opacity: 0.05 },
      { amplitude: 10, frequency: 0.015, speed: 0.0015, phase: Math.PI, yOffset: height * 0.9, color: 'hsl(175, 70%, 45%)', opacity: 0.07 },
    ];

    // Create floating bubbles
    bubblesRef.current = Array.from({ length: 25 }, () => ({
      x: Math.random() * width,
      y: height + Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 0.3 + 0.2,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.01,
      opacity: Math.random() * 0.3 + 0.1,
    }));

    ripplesRef.current = [];
  }, []);

  const createRipple = useCallback((x: number, y: number) => {
    ripplesRef.current.push({
      x,
      y,
      radius: 0,
      maxRadius: Math.random() * 80 + 40,
      opacity: 0.3,
      speed: Math.random() * 0.5 + 0.5,
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      createRipple(e.clientX - rect.left, e.clientY - rect.top);
    };

    container.addEventListener('click', handleClick);

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      initializeElements(rect.width, rect.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Auto-create ripples occasionally
    const rippleInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        const rect = canvas.getBoundingClientRect();
        createRipple(Math.random() * rect.width, Math.random() * rect.height * 0.7);
      }
    }, 2000);

    const animate = (timestamp: number) => {
      const deltaTime = timestamp - timeRef.current;
      timeRef.current = timestamp;

      const width = canvas.getBoundingClientRect().width;
      const height = canvas.getBoundingClientRect().height;

      ctx.clearRect(0, 0, width, height);

      // Draw waves
      wavesRef.current.forEach(wave => {
        wave.phase += wave.speed * deltaTime;
        
        ctx.beginPath();
        ctx.moveTo(0, height);
        
        for (let x = 0; x <= width; x += 2) {
          const y = wave.yOffset + 
            Math.sin(x * wave.frequency + wave.phase) * wave.amplitude +
            Math.sin(x * wave.frequency * 0.5 + wave.phase * 1.3) * wave.amplitude * 0.5;
          ctx.lineTo(x, y);
        }
        
        ctx.lineTo(width, height);
        ctx.closePath();
        
        const gradient = ctx.createLinearGradient(0, wave.yOffset - wave.amplitude, 0, height);
        gradient.addColorStop(0, wave.color.replace(')', `, ${wave.opacity})`).replace('hsl', 'hsla'));
        gradient.addColorStop(1, wave.color.replace(')', ', 0)').replace('hsl', 'hsla'));
        
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Draw and update bubbles
      bubblesRef.current.forEach(bubble => {
        bubble.y -= bubble.speed;
        bubble.wobble += bubble.wobbleSpeed;
        bubble.x += Math.sin(bubble.wobble) * 0.5;

        // Reset bubble when it goes off screen
        if (bubble.y < -20) {
          bubble.y = height + 20;
          bubble.x = Math.random() * width;
        }

        // Draw bubble
        const gradient = ctx.createRadialGradient(
          bubble.x - bubble.size * 0.3, 
          bubble.y - bubble.size * 0.3, 
          0,
          bubble.x, 
          bubble.y, 
          bubble.size
        );
        gradient.addColorStop(0, `hsla(195, 100%, 95%, ${bubble.opacity})`);
        gradient.addColorStop(0.5, `hsla(190, 80%, 80%, ${bubble.opacity * 0.6})`);
        gradient.addColorStop(1, `hsla(190, 70%, 70%, 0)`);

        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Bubble highlight
        ctx.beginPath();
        ctx.arc(bubble.x - bubble.size * 0.3, bubble.y - bubble.size * 0.3, bubble.size * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(0, 0%, 100%, ${bubble.opacity * 0.8})`;
        ctx.fill();
      });

      // Draw and update ripples
      ripplesRef.current = ripplesRef.current.filter(ripple => {
        ripple.radius += ripple.speed;
        ripple.opacity = 0.3 * (1 - ripple.radius / ripple.maxRadius);

        if (ripple.radius >= ripple.maxRadius) return false;

        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(190, 80%, 60%, ${ripple.opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner ripple
        if (ripple.radius > 10) {
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, ripple.radius * 0.7, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(190, 80%, 70%, ${ripple.opacity * 0.5})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        return true;
      });

      // Light refraction effect at top
      const refractionGradient = ctx.createLinearGradient(0, 0, 0, height * 0.3);
      refractionGradient.addColorStop(0, 'hsla(195, 100%, 98%, 0.3)');
      refractionGradient.addColorStop(1, 'hsla(195, 100%, 98%, 0)');
      ctx.fillStyle = refractionGradient;
      ctx.fillRect(0, 0, width, height * 0.3);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      container.removeEventListener('click', handleClick);
      window.removeEventListener('resize', resizeCanvas);
      clearInterval(rippleInterval);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initializeElements, createRipple]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 overflow-hidden"
      style={{ 
        pointerEvents: 'auto',
        background: 'linear-gradient(180deg, hsl(195 100% 98%) 0%, hsl(200 80% 95%) 50%, hsl(195 70% 92%) 100%)'
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
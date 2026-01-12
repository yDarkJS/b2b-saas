import { useEffect, useRef, useState, useCallback } from "react";

interface DeepStar {
  id: number;
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  opacity: number;
  fadeDirection: 'in' | 'out' | 'stable';
  fadeSpeed: number;
  lifespan: number;
  age: number;
  driftX: number;
  driftY: number;
}

interface ParallaxStar {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  velocityX: number;
  velocityY: number;
  oscillationAmplitude: number;
  oscillationSpeed: number;
  oscillationOffset: number;
  baseY: number;
}

interface HeroStar {
  id: number;
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  baseSize: number;
  opacity: number;
  baseOpacity: number;
  pulsePhase: number;
  pulseSpeed: number;
  glowIntensity: number;
  driftX: number;
  driftY: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitPhase: number;
}

interface ShootingStar {
  id: number;
  startX: number;
  startY: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  length: number;
  opacity: number;
  curve: number;
  progress: number;
  active: boolean;
}

export function LivingStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);
  const lastShootingStarRef = useRef(0);
  
  const deepStarsRef = useRef<DeepStar[]>([]);
  const parallaxStarsRef = useRef<ParallaxStar[]>([]);
  const heroStarsRef = useRef<HeroStar[]>([]);
  const shootingStarRef = useRef<ShootingStar | null>(null);
  
  // Camera drift
  const cameraDriftRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  
  // Mouse parallax - smooth interpolation
  const mouseRef = useRef({ 
    x: 0, 
    y: 0, 
    targetX: 0, 
    targetY: 0,
    isActive: false 
  });

  const initializeStars = useCallback((width: number, height: number) => {
    // Deep Space Layer - many tiny stars
    deepStarsRef.current = Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.2 + 0.3,
      baseOpacity: Math.random() * 0.1 + 0.05,
      opacity: Math.random() * 0.1 + 0.05,
      fadeDirection: Math.random() > 0.5 ? 'in' : 'out' as const,
      fadeSpeed: Math.random() * 0.0003 + 0.0001, // Very slow fade
      lifespan: Math.random() * 40000 + 20000, // 20-60 seconds
      age: Math.random() * 20000,
      driftX: (Math.random() - 0.5) * 0.02,
      driftY: (Math.random() - 0.5) * 0.015,
    }));

    // Parallax Layer - medium stars with depth
    parallaxStarsRef.current = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.8,
      opacity: Math.random() * 0.4 + 0.2,
      velocityX: (Math.random() - 0.5) * 0.08,
      velocityY: (Math.random() - 0.5) * 0.04,
      oscillationAmplitude: Math.random() * 3 + 1,
      oscillationSpeed: Math.random() * 0.0008 + 0.0003,
      oscillationOffset: Math.random() * Math.PI * 2,
      baseY: Math.random() * height,
    }));

    // Hero Stars - few prominent stars with organic movement
    heroStarsRef.current = Array.from({ length: 12 }, (_, i) => {
      const baseX = Math.random() * width;
      const baseY = Math.random() * height;
      const size = Math.random() * 2.5 + 2;
      return {
        id: i,
        x: baseX,
        y: baseY,
        baseX,
        baseY,
        size,
        baseSize: size,
        opacity: Math.random() * 0.5 + 0.4,
        baseOpacity: Math.random() * 0.5 + 0.4,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.0015 + 0.0008,
        glowIntensity: Math.random() * 0.5 + 0.3,
        driftX: (Math.random() - 0.5) * 0.03,
        driftY: (Math.random() - 0.5) * 0.025,
        orbitRadius: Math.random() * 15 + 8,
        orbitSpeed: Math.random() * 0.0003 + 0.0001,
        orbitPhase: Math.random() * Math.PI * 2,
      };
    });
  }, []);

  const createShootingStar = useCallback((width: number, height: number) => {
    const side = Math.random();
    let startX, startY, angle;
    
    if (side < 0.5) {
      // From top
      startX = Math.random() * width * 0.8 + width * 0.1;
      startY = -20;
      angle = Math.PI / 4 + (Math.random() - 0.5) * 0.4;
    } else {
      // From left
      startX = -20;
      startY = Math.random() * height * 0.5;
      angle = Math.PI / 6 + (Math.random() - 0.5) * 0.3;
    }

    shootingStarRef.current = {
      id: Date.now(),
      startX,
      startY,
      x: startX,
      y: startY,
      angle,
      speed: Math.random() * 4 + 6,
      length: Math.random() * 60 + 80,
      opacity: 1,
      curve: (Math.random() - 0.5) * 0.02,
      progress: 0,
      active: true,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Mouse tracking with smooth interpolation
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      // Normalize to -1 to 1 range, centered
      const normalizedX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const normalizedY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      
      mouseRef.current.targetX = normalizedX * 25; // Max 25px parallax
      mouseRef.current.targetY = normalizedY * 15; // Max 15px parallax
      mouseRef.current.isActive = true;
    };

    const handleMouseLeave = () => {
      // Slowly return to center when mouse leaves
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
      mouseRef.current.isActive = false;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      initializeStars(rect.width, rect.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = (timestamp: number) => {
      const deltaTime = timestamp - timeRef.current;
      timeRef.current = timestamp;

      const width = canvas.getBoundingClientRect().width;
      const height = canvas.getBoundingClientRect().height;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation (easing factor)
      const mouseEasing = mouseRef.current.isActive ? 0.08 : 0.02;
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * mouseEasing;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * mouseEasing;

      // Update camera drift (very slow, organic movement) - this is the "space flow" direction
      if (Math.random() < 0.002) {
        cameraDriftRef.current.targetX = (Math.random() - 0.5) * 30;
        cameraDriftRef.current.targetY = (Math.random() - 0.5) * 20;
      }
      cameraDriftRef.current.x += (cameraDriftRef.current.targetX - cameraDriftRef.current.x) * 0.001;
      cameraDriftRef.current.y += (cameraDriftRef.current.targetY - cameraDriftRef.current.y) * 0.001;

      // Combined camera + mouse parallax
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const cameraX = cameraDriftRef.current.x;
      const cameraY = cameraDriftRef.current.y;
      
      // Continuous flow direction (persistent drift that all stars follow)
      const flowSpeedX = 0.15; // Pixels per frame - rightward flow
      const flowSpeedY = 0.05; // Slight downward

      // ===== DEEP SPACE LAYER (slowest - far away) =====
      deepStarsRef.current.forEach(star => {
        star.age += deltaTime;
        
        // Lifecycle fade
        if (star.age > star.lifespan * 0.8) {
          star.opacity = Math.max(0, star.opacity - star.fadeSpeed * deltaTime);
        } else if (star.age < star.lifespan * 0.2) {
          star.opacity = Math.min(star.baseOpacity, star.opacity + star.fadeSpeed * deltaTime);
        }
        
        // Respawn dead stars
        if (star.age > star.lifespan) {
          star.x = Math.random() * width;
          star.y = Math.random() * height;
          star.age = 0;
          star.opacity = 0;
          star.lifespan = Math.random() * 40000 + 20000;
        }
        
        // Flow movement (all stars drift in same direction) + individual drift + parallax
        const depthMultiplier = 0.3; // Far stars move slowest
        star.x += flowSpeedX * depthMultiplier + star.driftX + mouseX * 0.05;
        star.y += flowSpeedY * depthMultiplier + star.driftY + mouseY * 0.05;
        
        // Wrap around
        if (star.x < -10) star.x = width + 10;
        if (star.x > width + 10) star.x = -10;
        if (star.y < -10) star.y = height + 10;
        if (star.y > height + 10) star.y = -10;
        
        // Draw
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 190, 220, ${star.opacity})`;
        ctx.fill();
      });

      // ===== PARALLAX LAYER (medium depth) =====
      parallaxStarsRef.current.forEach(star => {
        // Oscillation (cosmic float) + flow movement
        const depthMultiplier = 0.6; // Medium stars move at medium speed
        const oscillation = Math.sin(timestamp * star.oscillationSpeed + star.oscillationOffset) * star.oscillationAmplitude;
        
        star.x += flowSpeedX * depthMultiplier + star.velocityX + mouseX * 0.15;
        star.baseY += flowSpeedY * depthMultiplier + star.velocityY;
        star.y = star.baseY + oscillation + mouseY * 0.15;
        
        // Wrap around
        if (star.x < -10) star.x = width + 10;
        if (star.x > width + 10) star.x = -10;
        if (star.baseY < -10) star.baseY = height + 10;
        if (star.baseY > height + 10) star.baseY = -10;
        
        // Subtle twinkle
        const twinkle = Math.sin(timestamp * 0.002 + star.id) * 0.1 + 0.9;
        
        // Draw with subtle glow
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 2);
        gradient.addColorStop(0, `rgba(200, 210, 255, ${star.opacity * twinkle})`);
        gradient.addColorStop(0.5, `rgba(180, 190, 240, ${star.opacity * twinkle * 0.3})`);
        gradient.addColorStop(1, 'rgba(180, 190, 240, 0)');
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Core
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 225, 255, ${star.opacity * twinkle})`;
        ctx.fill();
      });

      // ===== HERO STARS LAYER (closest - fastest movement) =====
      heroStarsRef.current.forEach(star => {
        star.pulsePhase += star.pulseSpeed * deltaTime;
        star.orbitPhase += star.orbitSpeed * deltaTime;
        
        // Organic pulse: fast rise, slow decay
        const pulseRaw = Math.sin(star.pulsePhase);
        const pulse = pulseRaw > 0 
          ? Math.pow(pulseRaw, 0.5) // Fast rise
          : Math.pow(Math.abs(pulseRaw), 2) * -1; // Slow decay
        
        star.size = star.baseSize + pulse * star.baseSize * 0.15;
        star.opacity = star.baseOpacity + pulse * 0.15;
        
        // Flow movement - hero stars move FASTEST (closest to viewer)
        const depthMultiplier = 1.2; // Closest stars move fastest
        star.baseX += flowSpeedX * depthMultiplier;
        star.baseY += flowSpeedY * depthMultiplier;
        
        // Wrap around screen edges
        if (star.baseX < -80) star.baseX = width + 80;
        if (star.baseX > width + 80) star.baseX = -80;
        if (star.baseY < -80) star.baseY = height + 80;
        if (star.baseY > height + 80) star.baseY = -80;
        
        // Orbital/floating movement - smooth sine wave orbit
        const orbitX = Math.cos(star.orbitPhase) * star.orbitRadius;
        const orbitY = Math.sin(star.orbitPhase * 0.7) * star.orbitRadius * 0.6;
        
        // Hero stars have strongest mouse parallax (foreground effect)
        const x = star.baseX + orbitX + mouseX * 0.5;
        const y = star.baseY + orbitY + mouseY * 0.5;
        
        // Multi-layer glow
        const outerGlow = ctx.createRadialGradient(x, y, 0, x, y, star.size * 8);
        outerGlow.addColorStop(0, `rgba(140, 160, 255, ${star.glowIntensity * 0.15})`);
        outerGlow.addColorStop(0.5, `rgba(120, 140, 255, ${star.glowIntensity * 0.05})`);
        outerGlow.addColorStop(1, 'rgba(120, 140, 255, 0)');
        
        ctx.beginPath();
        ctx.arc(x, y, star.size * 8, 0, Math.PI * 2);
        ctx.fillStyle = outerGlow;
        ctx.fill();
        
        // Inner glow
        const innerGlow = ctx.createRadialGradient(x, y, 0, x, y, star.size * 3);
        innerGlow.addColorStop(0, `rgba(200, 210, 255, ${star.opacity})`);
        innerGlow.addColorStop(0.4, `rgba(170, 185, 255, ${star.opacity * 0.5})`);
        innerGlow.addColorStop(1, 'rgba(150, 170, 255, 0)');
        
        ctx.beginPath();
        ctx.arc(x, y, star.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = innerGlow;
        ctx.fill();
        
        // Bright core
        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });

      // ===== SHOOTING STAR =====
      const timeSinceLastShooting = timestamp - lastShootingStarRef.current;
      if (timeSinceLastShooting > 25000 + Math.random() * 20000 && !shootingStarRef.current?.active) {
        createShootingStar(width, height);
        lastShootingStarRef.current = timestamp;
      }

      if (shootingStarRef.current?.active) {
        const star = shootingStarRef.current;
        star.progress += deltaTime * 0.001;
        
        // Curved trajectory
        const t = star.progress;
        star.x = star.startX + Math.cos(star.angle) * star.speed * t * 60;
        star.y = star.startY + Math.sin(star.angle) * star.speed * t * 60 + star.curve * t * t * 1000;
        
        // Fade out
        star.opacity = Math.max(0, 1 - t * 0.8);
        
        if (star.opacity > 0 && star.x < width + 100 && star.y < height + 100) {
          // Trail
          const trailLength = star.length * (1 - t * 0.5);
          const gradient = ctx.createLinearGradient(
            star.x, star.y,
            star.x - Math.cos(star.angle) * trailLength,
            star.y - Math.sin(star.angle) * trailLength
          );
          gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
          gradient.addColorStop(0.1, `rgba(200, 220, 255, ${star.opacity * 0.8})`);
          gradient.addColorStop(0.4, `rgba(150, 180, 255, ${star.opacity * 0.3})`);
          gradient.addColorStop(1, 'rgba(120, 150, 255, 0)');
          
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(
            star.x - Math.cos(star.angle) * trailLength,
            star.y - Math.sin(star.angle) * trailLength
          );
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.stroke();
          
          // Head glow
          const headGlow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 8);
          headGlow.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
          headGlow.addColorStop(0.5, `rgba(180, 200, 255, ${star.opacity * 0.5})`);
          headGlow.addColorStop(1, 'rgba(150, 180, 255, 0)');
          
          ctx.beginPath();
          ctx.arc(star.x, star.y, 8, 0, Math.PI * 2);
          ctx.fillStyle = headGlow;
          ctx.fill();
        } else {
          star.active = false;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initializeStars, createShootingStar]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden" style={{ pointerEvents: 'auto', backgroundColor: '#080C16' }}>
      {/* Nebula gradients (very subtle cosmic energy) */}
      <div className="absolute inset-0">
        <div 
          className="absolute w-[800px] h-[800px] rounded-full opacity-[0.03] animate-nebula-1"
          style={{
            background: 'radial-gradient(ellipse at center, hsl(238, 60%, 30%) 0%, transparent 70%)',
            top: '-20%',
            left: '10%',
            filter: 'blur(80px)',
          }}
        />
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-[0.025] animate-nebula-2"
          style={{
            background: 'radial-gradient(ellipse at center, hsl(280, 50%, 25%) 0%, transparent 70%)',
            bottom: '10%',
            right: '-10%',
            filter: 'blur(100px)',
          }}
        />
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-[0.02] animate-nebula-3"
          style={{
            background: 'radial-gradient(ellipse at center, hsl(200, 60%, 25%) 0%, transparent 70%)',
            top: '40%',
            left: '50%',
            filter: 'blur(90px)',
          }}
        />
      </div>
      
      {/* Canvas for star rendering */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.9 }}
      />
    </div>
  );
}

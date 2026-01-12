import { useEffect, useRef } from 'react';
import { useTransition, Particle } from './TransitionContext';

export function TransitionCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state, particles } = useTransition();
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    particlesRef.current = particles.map(p => ({ ...p, trail: [] }));
  }, [particles]);

  useEffect(() => {
    if (!state.isTransitioning) return;
    
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

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const animate = (timestamp: number) => {
      const deltaTime = timestamp - timeRef.current;
      timeRef.current = timestamp;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Smooth dark overlay with gradual transitions
      const overlayOpacity = state.phase === 'suspend' ? 0.05 
        : state.phase === 'fragment' ? 0.15
        : state.phase === 'dust' ? 0.25
        : state.phase === 'converge' ? 0.2
        : 0.1;
      
      ctx.fillStyle = `rgba(8, 12, 22, ${overlayOpacity})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        if (timestamp < particle.delay) return;
        
        // Update based on phase
        switch (state.phase) {
          case 'fragment':
            // Particles drift outward with curved vectors
            particle.velocity.x += (Math.random() - 0.5) * 0.2;
            particle.velocity.y += (Math.random() - 0.5) * 0.2;
            particle.x += particle.velocity.x;
            particle.y += particle.velocity.y;
            particle.rotation += particle.rotationSpeed;
            particle.opacity = Math.max(0.6, particle.opacity - 0.002);
            break;
            
          case 'dust':
            // Add trail effect
            particle.trail.push({ 
              x: particle.x, 
              y: particle.y, 
              opacity: particle.opacity * 0.3 
            });
            if (particle.trail.length > 5) particle.trail.shift();
            
            // Slow down and add twinkle
            particle.velocity.x *= 0.98;
            particle.velocity.y *= 0.98;
            particle.x += particle.velocity.x;
            particle.y += particle.velocity.y;
            
            // Slight pull toward center
            const dxCenter = centerX - particle.x;
            const dyCenter = centerY - particle.y;
            particle.velocity.x += dxCenter * 0.0001;
            particle.velocity.y += dyCenter * 0.0001;
            
            // Pulse effect
            particle.opacity = 0.4 + Math.sin(timestamp * 0.005 + index) * 0.3;
            break;
            
          case 'converge':
            // Strong attraction to center/vortex
            const dx = centerX - particle.x;
            const dy = centerY - particle.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // Spiral effect
            const angle = Math.atan2(dy, dx) + 0.02;
            const force = Math.min(dist * 0.003, 3);
            
            particle.velocity.x += Math.cos(angle) * force;
            particle.velocity.y += Math.sin(angle) * force;
            particle.velocity.x *= 0.95;
            particle.velocity.y *= 0.95;
            
            particle.x += particle.velocity.x;
            particle.y += particle.velocity.y;
            particle.opacity = Math.min(1, particle.opacity + 0.01);
            
            // Clear trails
            particle.trail = [];
            break;
            
          case 'materialize':
            // Fade out particles
            particle.opacity *= 0.95;
            particle.x += (centerX - particle.x) * 0.05;
            particle.y += (centerY - particle.y) * 0.05;
            break;
        }
        
        // Draw trail
        particle.trail.forEach((trail, i) => {
          ctx.beginPath();
          ctx.arc(trail.x, trail.y, particle.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = particle.color.replace(')', `, ${trail.opacity * (i / particle.trail.length)})`).replace('rgb', 'rgba');
          ctx.fill();
        });
        
        // Draw particle with glow
        const glowSize = particle.size * 3;
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, glowSize
        );
        
        const colorMatch = particle.color.match(/\d+/g);
        if (colorMatch) {
          const [r, g, b] = colorMatch.map(Number);
          gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${particle.opacity})`);
          gradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${particle.opacity * 0.4})`);
          gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        }
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Core
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace(')', `, ${particle.opacity})`).replace('rgb', 'rgba');
        ctx.fill();
      });

      // Vortex effect in dust/converge phase
      if (state.phase === 'dust' || state.phase === 'converge') {
        const vortexGradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, 200
        );
        const vortexOpacity = state.phase === 'converge' ? 0.15 : 0.05;
        vortexGradient.addColorStop(0, `rgba(99, 102, 241, ${vortexOpacity})`);
        vortexGradient.addColorStop(0.5, `rgba(139, 92, 246, ${vortexOpacity * 0.5})`);
        vortexGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 200, 0, Math.PI * 2);
        ctx.fillStyle = vortexGradient;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

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
        opacity: state.phase === 'materialize' ? 0.5 : 1 
      }}
    />
  );
}

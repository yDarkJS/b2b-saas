import { useEffect, useState } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

export function StarField() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = [];
      for (let i = 0; i < 50; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.7 + 0.3,
          duration: Math.random() * 3 + 2,
          delay: Math.random() * 2,
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Static stars */}
      <svg className="absolute inset-0 w-full h-full">
        {stars.map((star) => (
          <circle
            key={star.id}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.size}
            fill="hsl(var(--primary))"
            className="animate-twinkle"
            style={{
              opacity: star.opacity,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </svg>

      {/* Shooting stars */}
      <div className="absolute inset-0">
        <div className="shooting-star" style={{ top: '20%', animationDelay: '0s' }} />
        <div className="shooting-star" style={{ top: '40%', animationDelay: '3s' }} />
        <div className="shooting-star" style={{ top: '60%', animationDelay: '6s' }} />
      </div>

      {/* Glow orbs */}
      <div 
        className="absolute w-64 h-64 rounded-full blur-3xl opacity-20 animate-float"
        style={{ 
          background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)',
          top: '10%',
          left: '20%',
        }}
      />
      <div 
        className="absolute w-48 h-48 rounded-full blur-3xl opacity-15 animate-float-delayed"
        style={{ 
          background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)',
          bottom: '20%',
          right: '10%',
        }}
      />
    </div>
  );
}

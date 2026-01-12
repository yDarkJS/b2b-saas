import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface TransitionState {
  isTransitioning: boolean;
  phase: 'idle' | 'suspend' | 'fragment' | 'dust' | 'converge' | 'materialize';
  progress: number;
}

interface TransitionContextType {
  state: TransitionState;
  startTransition: (elements: HTMLElement[], onComplete: () => void) => void;
  particles: Particle[];
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  originX: number;
  originY: number;
  targetX: number;
  targetY: number;
  size: number;
  color: string;
  opacity: number;
  velocity: { x: number; y: number };
  rotation: number;
  rotationSpeed: number;
  delay: number;
  trail: { x: number; y: number; opacity: number }[];
}

const TransitionContext = createContext<TransitionContextType | null>(null);

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransition must be used within TransitionProvider');
  }
  return context;
}

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TransitionState>({
    isTransitioning: false,
    phase: 'idle',
    progress: 0,
  });
  const [particles, setParticles] = useState<Particle[]>([]);
  const onCompleteRef = useRef<(() => void) | null>(null);

  const extractColors = (element: HTMLElement): string[] => {
    const styles = window.getComputedStyle(element);
    const colors: string[] = [];
    
    const bgColor = styles.backgroundColor;
    const textColor = styles.color;
    const borderColor = styles.borderColor;
    
    if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') colors.push(bgColor);
    if (textColor) colors.push(textColor);
    if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)') colors.push(borderColor);
    
    // Default to brand colors if no colors found
    if (colors.length === 0) {
      colors.push('rgb(99, 102, 241)', 'rgb(139, 92, 246)', 'rgb(255, 255, 255)');
    }
    
    return colors;
  };

  const createParticlesFromElement = (element: HTMLElement, baseId: number): Particle[] => {
    const rect = element.getBoundingClientRect();
    const colors = extractColors(element);
    const particles: Particle[] = [];
    
    // Density based on element size
    const area = rect.width * rect.height;
    const particleCount = Math.min(Math.max(Math.floor(area / 150), 10), 80);
    
    for (let i = 0; i < particleCount; i++) {
      const x = rect.left + Math.random() * rect.width;
      const y = rect.top + Math.random() * rect.height;
      
      particles.push({
        id: baseId + i,
        x,
        y,
        originX: x,
        originY: y,
        targetX: window.innerWidth / 2,
        targetY: window.innerHeight / 2,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1,
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: (Math.random() - 0.5) * 4,
        },
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 5,
        delay: Math.random() * 200,
        trail: [],
      });
    }
    
    return particles;
  };

  const startTransition = useCallback((elements: HTMLElement[], onComplete: () => void) => {
    onCompleteRef.current = onComplete;
    
    // Phase 1: Suspend (0-300ms)
    setState({ isTransitioning: true, phase: 'suspend', progress: 0 });
    
    // Create particles from all elements
    let allParticles: Particle[] = [];
    let idCounter = 0;
    
    elements.forEach(element => {
      const elementParticles = createParticlesFromElement(element, idCounter);
      allParticles = [...allParticles, ...elementParticles];
      idCounter += elementParticles.length;
    });
    
    setParticles(allParticles);
    
    // Phase 2: Fragment (400-1000ms) - slower start
    setTimeout(() => {
      setState(s => ({ ...s, phase: 'fragment', progress: 0.2 }));
    }, 400);
    
    // Phase 3: Dust (1000-1800ms)
    setTimeout(() => {
      setState(s => ({ ...s, phase: 'dust', progress: 0.5 }));
    }, 1000);
    
    // Phase 4: Converge (1800-2600ms)
    setTimeout(() => {
      setState(s => ({ ...s, phase: 'converge', progress: 0.7 }));
    }, 1800);
    
    // Phase 5: Materialize (2600-3200ms)
    setTimeout(() => {
      setState(s => ({ ...s, phase: 'materialize', progress: 0.9 }));
      onCompleteRef.current?.();
    }, 2600);
    
    // Complete (3600ms) - longer fade out
    setTimeout(() => {
      setState({ isTransitioning: false, phase: 'idle', progress: 1 });
      setParticles([]);
    }, 3600);
    
  }, []);

  return (
    <TransitionContext.Provider value={{ state, startTransition, particles }}>
      {children}
    </TransitionContext.Provider>
  );
}

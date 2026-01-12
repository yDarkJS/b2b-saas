import { TransitionProvider } from './TransitionContext';
import { TransitionCanvas } from './TransitionCanvas';
import { RainTransitionCanvas } from './RainTransitionCanvas';
import { useTheme } from 'next-themes';

export function TransitionOverlay({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  
  return (
    <TransitionProvider>
      {children}
      {/* Cosmic transition for dark mode, rain transition for light mode */}
      {theme === 'light' ? <RainTransitionCanvas /> : <TransitionCanvas />}
    </TransitionProvider>
  );
}

export { useTransition } from './TransitionContext';

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Mail, Lock } from "lucide-react";
import { LivingStarfield } from "@/components/LivingStarfield";
import { OceanWaves } from "@/components/OceanWaves";
import { useTransition } from "@/components/transition";
import { useTheme } from "next-themes";

export default function Login() {
  const navigate = useNavigate();
  const { startTransition, state } = useTransition();
  const { resolvedTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  
  const isDark = resolvedTheme === 'dark';
  
  // Refs for elements to fragment
  const logoRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const brandingRef = useRef<HTMLDivElement>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Phase 1: Suspend - freeze cursor, deepen colors
    setIsSuspended(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Collect all fragmentable elements
    const elements: HTMLElement[] = [];
    if (logoRef.current) elements.push(logoRef.current);
    if (formRef.current) elements.push(formRef.current);
    if (titleRef.current) elements.push(titleRef.current);
    if (statsRef.current) elements.push(statsRef.current);
    if (brandingRef.current) elements.push(brandingRef.current);
    
    // Start the stellar disintegration
    startTransition(elements, () => {
      sessionStorage.setItem('fromLogin', 'true');
      navigate("/dashboard");
    });
  };

  // Dynamic classes based on transition state
  const suspendClass = isSuspended ? 'opacity-0 scale-95 blur-sm' : '';
  const transitionClass = state.isTransitioning ? 'pointer-events-none' : '';

  return (
    <div className={`min-h-screen flex bg-background ${transitionClass}`}>
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-background relative overflow-hidden">
        {/* Theme-based animation: Stars for dark, Ocean for light */}
        {isDark ? <LivingStarfield /> : <OceanWaves />}
        
        {/* Gradient overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{ background: 'var(--gradient-glow)' }}
        />
        
        {/* Grid pattern - only in dark mode */}
        {isDark && (
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                                linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}
          />
        )}

        <div 
          ref={brandingRef}
          className={`relative z-10 flex flex-col justify-between p-12 w-full transition-all duration-500 ${suspendClass}`}
        >
          {/* Logo */}
          <div ref={logoRef} className="flex items-center justify-center w-full">
            <span className="text-2xl font-semibold tracking-tight">SpaceHub</span>
          </div>

          {/* Main content */}
          <div ref={titleRef} className="max-w-md">
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Gerencie sua loja com{" "}
              <span className="text-primary">inteligência</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Centralize e-mails, pedidos e refunds em um único painel. 
              Integração perfeita com Shopify.
            </p>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="flex gap-8">
            <div>
              <p className="text-3xl font-bold text-primary">2.4h</p>
              <p className="text-sm text-muted-foreground">Tempo médio de resposta</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">94%</p>
              <p className="text-sm text-muted-foreground">Satisfação do cliente</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">50k+</p>
              <p className="text-sm text-muted-foreground">Pedidos gerenciados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className={`flex-1 flex items-center justify-center p-8 relative overflow-hidden transition-all duration-300 ${isSuspended ? 'bg-background/80' : ''}`}>
        {/* Living Starfield for mobile */}
        <div className="lg:hidden absolute inset-0">
          <LivingStarfield />
        </div>
        
        <div className={`w-full max-w-md space-y-8 relative z-10 transition-all duration-500 ${suspendClass}`}>
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <span className="text-xl font-semibold">SpaceHub</span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold">Bem-vindo de volta</h2>
            <p className="text-muted-foreground mt-2">
              Entre com suas credenciais para acessar o painel
            </p>
          </div>

          <form ref={formRef} onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="pl-10"
                  required
                  disabled={isSuspended}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <button type="button" className="text-sm text-primary hover:underline">
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                  disabled={isSuspended}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className={`w-full gap-2 transition-transform ${isLoading ? 'translate-y-0.5' : ''}`}
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <button className="text-primary hover:underline font-medium">
              Solicite uma demo
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

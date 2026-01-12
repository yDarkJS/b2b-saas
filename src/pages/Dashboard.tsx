import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard, Card, CardHeader, CardContent } from "@/components/ui/custom-card";
import { OrderStatusBadge } from "@/components/ui/custom-badge";
import { dashboardStats, orders } from "@/data/orders";
import { emails } from "@/data/emails";
import { Mail, RefreshCw, ShoppingBag, TrendingUp, Clock, Users } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { SalesChart } from "@/components/charts/SalesChart";
import { ChurnChart } from "@/components/charts/ChurnChart";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const recentOrders = orders.slice(0, 5);
  const recentEmails = emails.filter(e => e.status === 'new').slice(0, 3);
  
  // Check if coming from login (stellar transition)
  const [showMaterialization, setShowMaterialization] = useState(false);
  const [showRemnants, setShowRemnants] = useState(false);

  useEffect(() => {
    // Detect if we're materializing from login
    const fromLogin = sessionStorage.getItem('fromLogin');
    if (fromLogin) {
      setShowMaterialization(true);
      setShowRemnants(true);
      sessionStorage.removeItem('fromLogin');
      
      // Remove remnants after animation
      setTimeout(() => setShowRemnants(false), 3000);
    }
    
    // Mostrar toast de boas-vindas apenas uma vez por sessão
    const hasShownWelcome = sessionStorage.getItem('welcomeShown');
    if (!hasShownWelcome) {
      setTimeout(() => {
        toast({
          title: "Bem-vindo de volta, Chefe! 👋",
          description: "Você tem 8 novos e-mails e 3 pedidos pendentes.",
        });
        sessionStorage.setItem('welcomeShown', 'true');
      }, showMaterialization ? 800 : 0);
    }
  }, [toast, showMaterialization]);

  // Animation classes based on materialization state
  const getAnimClass = (delay: number) => {
    if (!showMaterialization) return 'animate-fade-in';
    return `animate-materialize-delay-${delay}`;
  };

  return (
    <MainLayout className={showMaterialization ? 'animate-materialize' : ''}>
      {/* Particle remnants - late floaters */}
      {showRemnants && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-primary animate-particle-remnant"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
                '--drift-x': `${(Math.random() - 0.5) * 60}px`,
                '--drift-y': `${-20 - Math.random() * 40}px`,
                animationDelay: `${i * 0.3}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}
      
      <div className="space-y-6">
        {/* Page header */}
        <div className={getAnimClass(1)}>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral da sua loja
          </p>
        </div>

        {/* Stats grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 ${getAnimClass(2)}`}>
          <StatCard
            title="E-mails Pendentes"
            value={dashboardStats.pendingEmails}
            icon={<Mail className="w-5 h-5" />}
            trend={{ value: 12, isPositive: false }}
          />
          <StatCard
            title="Refunds do Mês"
            value={dashboardStats.monthlyRefunds}
            icon={<RefreshCw className="w-5 h-5" />}
            trend={{ value: 8, isPositive: false }}
          />
          <StatCard
            title="Pedidos Recentes"
            value={dashboardStats.recentOrders}
            icon={<ShoppingBag className="w-5 h-5" />}
            trend={{ value: 23, isPositive: true }}
          />
          <StatCard
            title="Receita Total"
            value={`R$ ${dashboardStats.totalRevenue.toLocaleString('pt-BR')}`}
            icon={<TrendingUp className="w-5 h-5" />}
            trend={{ value: 15, isPositive: true }}
          />
          <StatCard
            title="Tempo de Resposta"
            value={dashboardStats.averageResponseTime}
            icon={<Clock className="w-5 h-5" />}
          />
          <StatCard
            title="Satisfação"
            value={`${dashboardStats.customerSatisfaction}%`}
            icon={<Users className="w-5 h-5" />}
            trend={{ value: 2, isPositive: true }}
          />
        </div>

        {/* Charts grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${getAnimClass(3)}`}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">Vendas Mensais</h2>
                  <p className="text-sm text-muted-foreground">Comparativo com meta</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">R$ 258k</p>
                  <p className="text-xs text-success">+18% vs ano anterior</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <SalesChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">Churn & Aquisição</h2>
                  <p className="text-sm text-muted-foreground">Novos clientes vs cancelamentos</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-success">0.8%</p>
                  <p className="text-xs text-muted-foreground">Taxa de churn atual</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChurnChart />
            </CardContent>
          </Card>
        </div>

        {/* Content grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${getAnimClass(4)}`}>
          {/* Recent orders - 2 columns */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="font-semibold">Pedidos Recentes</h2>
              <button 
                onClick={() => navigate('/orders')}
                className="text-sm text-primary hover:underline"
              >
                Ver todos
              </button>
            </CardHeader>
            <div className="divide-y divide-border">
              {recentOrders.map((order) => (
                <div 
                  key={order.id}
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="p-4 flex items-center justify-between hover:bg-muted/30 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {order.customerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground font-mono">{order.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium text-sm">
                        R$ {order.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(order.date), "dd MMM", { locale: ptBR })}
                      </p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Pending emails - 1 column */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="font-semibold">E-mails Novos</h2>
              <button 
                onClick={() => navigate('/inbox')}
                className="text-sm text-primary hover:underline"
              >
                Ver todos
              </button>
            </CardHeader>
            <div className="divide-y divide-border">
              {recentEmails.map((email) => (
                <div 
                  key={email.id}
                  onClick={() => navigate('/inbox')}
                  className="p-4 hover:bg-muted/30 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{email.customerName}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {email.subject}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(email.date), "dd MMM, HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {recentEmails.length === 0 && (
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum e-mail novo
                  </p>
                </CardContent>
              )}
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

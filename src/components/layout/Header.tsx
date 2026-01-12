import { Bell, Search, LogOut, Mail, ShoppingBag, RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  type: 'email' | 'order' | 'refund';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'email',
    title: 'Novo e-mail de Maria Silva',
    description: 'Olá, gostaria de saber sobre o status...',
    time: '2 min',
    read: false,
  },
  {
    id: '2',
    type: 'order',
    title: 'Novo pedido #12847',
    description: 'Pedido de R$ 459,90 confirmado',
    time: '15 min',
    read: false,
  },
  {
    id: '3',
    type: 'refund',
    title: 'Solicitação de reembolso',
    description: 'Cliente João pediu reembolso do pedido #12801',
    time: '1h',
    read: false,
  },
  {
    id: '4',
    type: 'email',
    title: 'Novo e-mail de Pedro Santos',
    description: 'Preciso de ajuda com meu pedido...',
    time: '2h',
    read: true,
  },
  {
    id: '5',
    type: 'order',
    title: 'Pedido #12845 enviado',
    description: 'Rastreamento: BR123456789',
    time: '3h',
    read: true,
  },
];

interface HeaderProps {
  storeName?: string;
}

export function Header({ storeName = "Minha Loja" }: HeaderProps) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    navigate("/login");
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4 text-primary" />;
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-success" />;
      case 'refund':
        return <RefreshCw className="w-4 h-4 text-warning" />;
    }
  };

  return (
    <header className="h-16 liquid-glass border-b border-border/30 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar pedidos, clientes..."
            className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs text-muted-foreground bg-background border border-border rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Theme toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-3 py-2">
              <h3 className="font-semibold text-sm">Notificações</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  Marcar todas como lidas
                </button>
              )}
            </div>
            <DropdownMenuSeparator />
            <ScrollArea className="h-[300px]">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  Nenhuma notificação
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`px-3 py-3 hover:bg-muted/50 cursor-pointer transition-colors border-b border-border/50 last:border-0 ${
                      !notification.read ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm truncate ${!notification.read ? 'font-semibold' : 'font-medium'}`}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {notification.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.time} atrás
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
            <DropdownMenuSeparator />
            <div className="p-2">
              <button 
                onClick={() => navigate('/inbox')}
                className="w-full text-center text-sm text-primary hover:underline py-1"
              >
                Ver todas as notificações
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Store info + Avatar with dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 pl-4 border-l border-border hover:opacity-80 transition-opacity cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{storeName}</p>
                <p className="text-xs text-muted-foreground">Plano Pro</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">
                  {storeName.charAt(0).toUpperCase()}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{storeName}</p>
              <p className="text-xs text-muted-foreground">admin@techstore.com</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

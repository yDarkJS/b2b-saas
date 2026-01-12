import { cn } from "@/lib/utils";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Inbox, 
  ShoppingBag, 
  RefreshCw, 
  Settings,
  LayoutDashboard,
  ChevronLeft
} from "lucide-react";
import { createContext, useContext, useState, ReactNode } from "react";
import { useTheme } from "next-themes";
import spaceLogo from "@/assets/logo.png";
import aquaticLogo from "@/assets/aquatic-logo.png";

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Inbox', href: '/inbox', icon: Inbox, badge: 3 },
  { name: 'Pedidos', href: '/orders', icon: ShoppingBag },
  { name: 'Refunds', href: '/refunds', icon: RefreshCw },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

// Context for sidebar state
interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebarState() {
  const context = useContext(SidebarContext);
  if (!context) {
    return { isCollapsed: false, setIsCollapsed: () => {} };
  }
  return context;
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function Sidebar() {
  const { isCollapsed, setIsCollapsed } = useSidebarState();
  const location = useLocation();
  const { theme } = useTheme();
  
  // Dynamic branding based on theme
  const isLightMode = theme === 'light';
  const brandName = isLightMode ? 'AquaticHub' : 'SpaceHub';
  const currentLogo = isLightMode ? aquaticLogo : spaceLogo;

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen liquid-glass border-r border-border/30 transition-all duration-300 z-40",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <img src={currentLogo} alt={`${brandName} Logo`} className="w-8 h-8 rounded-lg" />
            <span className="font-semibold text-foreground transition-all duration-300">{brandName}</span>
          </div>
        )}
        {isCollapsed && (
          <img src={currentLogo} alt={`${brandName} Logo`} className="w-8 h-8 rounded-lg mx-auto" />
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors",
            isCollapsed && "mx-auto"
          )}
        >
          <ChevronLeft className={cn(
            "w-4 h-4 transition-transform",
            isCollapsed && "rotate-180"
          )} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                isActive 
                  ? "bg-primary/10 text-foreground" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
              )}
              
              <item.icon className={cn(
                "w-5 h-5 flex-shrink-0 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )} />
              
              {!isCollapsed && (
                <>
                  <span className="font-medium text-sm">{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.name}
                  {item.badge && (
                    <span className="ml-2 bg-primary text-primary-foreground text-xs font-medium px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom section */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/30">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-muted-foreground">Conectado à Shopify</span>
          </div>
        </div>
      )}
    </aside>
  );
}

import { ReactNode } from "react";
import { Sidebar, SidebarProvider, useSidebarState } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

function MainLayoutContent({ children, className }: MainLayoutProps) {
  const { isCollapsed } = useSidebarState();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  return (
    <div 
      className="flex h-screen w-full overflow-hidden"
      style={{
        background: isDark 
          ? 'hsl(var(--background))' 
          : 'linear-gradient(180deg, hsl(195 100% 98%) 0%, hsl(200 80% 96%) 50%, hsl(195 70% 94%) 100%)'
      }}
    >
      {/* Sidebar - fixed height, no scroll */}
      <Sidebar />
      
      {/* Main content area */}
      <div className={cn(
        "flex flex-col flex-1 min-h-screen transition-all duration-300",
        isCollapsed ? "ml-16" : "ml-64"
      )}>
        {/* Header - sticky at top */}
        <Header storeName="TechStore Brasil" />
        
        {/* Scrollable content area */}
        <main className={cn("flex-1 overflow-y-auto p-6", className)}>
          {children}
        </main>
      </div>
    </div>
  );
}

export function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <MainLayoutContent className={className}>
        {children}
      </MainLayoutContent>
    </SidebarProvider>
  );
}

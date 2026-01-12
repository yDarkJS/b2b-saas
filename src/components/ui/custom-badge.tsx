import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'new' | 'replied' | 'pending' | 'success' | 'warning' | 'destructive';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-secondary text-secondary-foreground',
    new: 'bg-primary/20 text-primary border border-primary/30',
    replied: 'bg-success/20 text-success border border-success/30',
    pending: 'bg-warning/20 text-warning border border-warning/30',
    success: 'bg-success/20 text-success border border-success/30',
    warning: 'bg-warning/20 text-warning border border-warning/30',
    destructive: 'bg-destructive/20 text-destructive border border-destructive/30',
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: 'new' | 'replied' | 'pending' }) {
  const labels = {
    new: 'Novo',
    replied: 'Respondido',
    pending: 'Pendente',
  };

  return (
    <Badge variant={status}>
      {labels[status]}
    </Badge>
  );
}

export function OrderStatusBadge({ status }: { status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'refunded' }) {
  const config = {
    pending: { variant: 'warning' as const, label: 'Pendente' },
    processing: { variant: 'new' as const, label: 'Processando' },
    shipped: { variant: 'pending' as const, label: 'Enviado' },
    delivered: { variant: 'success' as const, label: 'Entregue' },
    refunded: { variant: 'destructive' as const, label: 'Reembolsado' },
  };

  const { variant, label } = config[status];
  
  return (
    <Badge variant={variant}>
      {label}
    </Badge>
  );
}

export function RefundStatusBadge({ status }: { status: 'pending' | 'approved' | 'completed' | 'rejected' }) {
  const config = {
    pending: { variant: 'warning' as const, label: 'Pendente' },
    approved: { variant: 'new' as const, label: 'Aprovado' },
    completed: { variant: 'success' as const, label: 'Concluído' },
    rejected: { variant: 'destructive' as const, label: 'Rejeitado' },
  };

  const { variant, label } = config[status];
  
  return (
    <Badge variant={variant}>
      {label}
    </Badge>
  );
}

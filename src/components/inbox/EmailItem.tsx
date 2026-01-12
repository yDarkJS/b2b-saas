import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/custom-badge";
import { Email } from "@/data/emails";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EmailItemProps {
  email: Email;
  isSelected: boolean;
  onClick: () => void;
}

export function EmailItem({ email, isSelected, onClick }: EmailItemProps) {
  const formattedDate = format(new Date(email.date), "dd MMM, HH:mm", { locale: ptBR });

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 border-b border-border cursor-pointer transition-all duration-200",
        isSelected 
          ? "bg-primary/10 border-l-2 border-l-primary" 
          : "hover:bg-muted/50 border-l-2 border-l-transparent",
        email.status === 'new' && !isSelected && "bg-muted/30"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Header row: name + date */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 min-w-0">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-secondary-foreground">
                  {email.customerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <span className={cn(
                "font-medium text-sm truncate",
                email.status === 'new' && "font-semibold"
              )}>
                {email.customerName}
              </span>
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {formattedDate}
            </span>
          </div>

          {/* Subject + Order ID */}
          <div className="ml-10">
            <p className={cn(
              "text-sm truncate mb-1",
              email.status === 'new' ? "text-foreground" : "text-muted-foreground"
            )}>
              {email.subject}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-mono">
                #{email.orderId}
              </span>
              <StatusBadge status={email.status} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Email, EmailMessage } from "@/data/emails";
import { Badge } from "@/components/ui/custom-badge";
import { Button } from "@/components/ui/button";
import { 
  Reply, 
  Trash2, 
  Languages, 
  Send,
  ExternalLink,
  MoreHorizontal
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface EmailThreadProps {
  email: Email;
  onDelete: () => void;
}

export function EmailThread({ email, onDelete }: EmailThreadProps) {
  const [replyText, setReplyText] = useState("");
  const [showReply, setShowReply] = useState(false);
  const [translatedMessages, setTranslatedMessages] = useState<Set<string>>(new Set());
  const [isTranslatingReply, setIsTranslatingReply] = useState(false);
  const navigate = useNavigate();

  const toggleTranslation = (messageId: string) => {
    const newSet = new Set(translatedMessages);
    if (newSet.has(messageId)) {
      newSet.delete(messageId);
    } else {
      newSet.add(messageId);
    }
    setTranslatedMessages(newSet);
  };

  const handleTranslateReply = () => {
    setIsTranslatingReply(!isTranslatingReply);
  };

  const handleSendReply = () => {
    // Simulated send
    alert(`Resposta enviada${isTranslatingReply ? ' (traduzida para inglês)' : ''}:\n\n${replyText}`);
    setReplyText("");
    setShowReply(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold mb-2">{email.subject}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{email.customerName}</span>
              <span>•</span>
              <span className="font-mono">{email.customerEmail}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(`/orders/${email.orderId}`)}
              className="gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Ver Pedido
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Order tag */}
        <div className="mt-4">
          <Badge variant="default" className="font-mono">
            Pedido: {email.orderId}
          </Badge>
        </div>
      </div>

      {/* Thread messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {email.thread.map((message) => (
          <MessageBubble 
            key={message.id}
            message={message}
            isTranslated={translatedMessages.has(message.id)}
            onToggleTranslation={() => toggleTranslation(message.id)}
          />
        ))}
      </div>

      {/* Action bar */}
      <div className="p-4 border-t border-border bg-card/50">
        {!showReply ? (
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowReply(true)} className="gap-2">
              <Reply className="w-4 h-4" />
              Responder
            </Button>
            <Button variant="outline" onClick={onDelete} className="gap-2 text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4" />
              Excluir
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Nova resposta</span>
              <Button
                variant={isTranslatingReply ? "default" : "outline"}
                size="sm"
                onClick={handleTranslateReply}
                className="gap-2"
              >
                <Languages className="w-4 h-4" />
                {isTranslatingReply ? "PT → EN (ativo)" : "Traduzir para EN"}
              </Button>
            </div>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={isTranslatingReply 
                ? "Escreva em português, será traduzido automaticamente..." 
                : "Digite sua resposta..."
              }
              className="w-full h-32 p-3 bg-background border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            <div className="flex items-center gap-2">
              <Button onClick={handleSendReply} disabled={!replyText.trim()} className="gap-2">
                <Send className="w-4 h-4" />
                Enviar
              </Button>
              <Button variant="ghost" onClick={() => setShowReply(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: EmailMessage;
  isTranslated: boolean;
  onToggleTranslation: () => void;
}

function MessageBubble({ message, isTranslated, onToggleTranslation }: MessageBubbleProps) {
  const isStore = message.from === 'store';
  const formattedDate = format(new Date(message.date), "dd MMM yyyy, HH:mm", { locale: ptBR });
  
  const displayContent = isTranslated && message.contentPt ? message.contentPt : message.content;

  return (
    <div className={cn(
      "flex gap-3 animate-fade-in",
      isStore && "flex-row-reverse"
    )}>
      {/* Avatar */}
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
        isStore ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
      )}>
        <span className="text-sm font-medium">
          {isStore ? "TS" : "CL"}
        </span>
      </div>

      {/* Message */}
      <div className={cn(
        "flex-1 max-w-2xl",
        isStore && "flex flex-col items-end"
      )}>
        <div className={cn(
          "px-4 py-3 rounded-xl",
          isStore 
            ? "bg-primary text-primary-foreground rounded-tr-sm" 
            : "bg-card border border-border rounded-tl-sm"
        )}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {displayContent}
          </p>
        </div>
        
        {/* Meta */}
        <div className={cn(
          "flex items-center gap-3 mt-2 px-1",
          isStore && "flex-row-reverse"
        )}>
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
          
          {/* Translate button for customer messages */}
          {!isStore && message.contentPt && (
            <button
              onClick={onToggleTranslation}
              className={cn(
                "flex items-center gap-1 text-xs transition-colors",
                isTranslated 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Languages className="w-3 h-3" />
              {isTranslated ? "Ver original (EN)" : "Traduzir (PT)"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

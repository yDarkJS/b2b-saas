import { useState } from "react";
import { EmailItem } from "./EmailItem";
import { emails, Email } from "@/data/emails";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmailListProps {
  selectedEmail: Email | null;
  onSelectEmail: (email: Email) => void;
}

export function EmailList({ selectedEmail, onSelectEmail }: EmailListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<'all' | 'new' | 'replied' | 'pending'>('all');

  const filteredEmails = emails.filter(email => {
    const matchesSearch = 
      email.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || email.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full md:w-96 border-r border-border flex flex-col bg-card/50">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Inbox</h2>
          <span className="text-sm text-muted-foreground">
            {filteredEmails.length} emails
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar emails..."
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {(['all', 'new', 'replied', 'pending'] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(f)}
              className="text-xs h-7"
            >
              {f === 'all' ? 'Todos' : f === 'new' ? 'Novos' : f === 'replied' ? 'Respondidos' : 'Pendentes'}
            </Button>
          ))}
        </div>
      </div>

      {/* Email list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredEmails.length > 0 ? (
          filteredEmails.map((email) => (
            <EmailItem
              key={email.id}
              email={email}
              isSelected={selectedEmail?.id === email.id}
              onClick={() => onSelectEmail(email)}
            />
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <p>Nenhum email encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { EmailList } from "@/components/inbox/EmailList";
import { EmailThread } from "@/components/inbox/EmailThread";
import { Email, emails } from "@/data/emails";
import { Mail } from "lucide-react";

export default function Inbox() {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(emails[0] || null);

  const handleDeleteEmail = () => {
    // Simulated delete
    alert(`E-mail excluído: ${selectedEmail?.subject}`);
    setSelectedEmail(null);
  };

  return (
    <MainLayout>
      <div className="animate-fade-in -m-6">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Email list */}
          <EmailList 
            selectedEmail={selectedEmail}
            onSelectEmail={setSelectedEmail}
          />

          {/* Email thread or empty state */}
          {selectedEmail ? (
            <EmailThread 
              email={selectedEmail} 
              onDelete={handleDeleteEmail}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-background">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-1">Selecione um e-mail</h3>
                <p className="text-sm text-muted-foreground">
                  Escolha um e-mail da lista para ver os detalhes
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

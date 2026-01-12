import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardHeader, CardContent } from "@/components/ui/custom-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Save, CheckCircle } from "lucide-react";

export default function Settings() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    // Simulated save
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in max-w-2xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Configure a integração de e-mail da sua loja
          </p>
        </div>

        {/* Email configuration */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold">Configuração de E-mail</h2>
            <p className="text-sm text-muted-foreground">
              Configure o e-mail que será usado para enviar e receber mensagens dos clientes
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="app-email">E-mail do aplicativo</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="app-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="suporte@minhaloja.com"
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Este e-mail será usado para enviar respostas aos clientes
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="app-password">Senha do aplicativo</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="app-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Use uma senha de app do Gmail ou configure SMTP personalizado
              </p>
            </div>

            <div className="pt-4 border-t border-border">
              <Button onClick={handleSave} className="gap-2" disabled={isSaved}>
                {isSaved ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Salvo com sucesso!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Salvar configurações
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional info */}
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Como funciona?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  O SpaceHub usa seu e-mail configurado para centralizar toda a comunicação 
                  com seus clientes. Os e-mails recebidos aparecem automaticamente na Inbox, 
                  e as respostas são enviadas em nome da sua loja.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

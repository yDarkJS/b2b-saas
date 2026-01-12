import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/custom-card";
import { RefundStatusBadge } from "@/components/ui/custom-badge";
import { refunds } from "@/data/refunds";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { RefreshCw } from "lucide-react";

export default function Refunds() {
  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Refunds</h1>
          <p className="text-muted-foreground">
            Acompanhe todos os pedidos de reembolso
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {(['pending', 'approved', 'completed', 'rejected'] as const).map((status) => {
            const count = refunds.filter(r => r.status === status).length;
            const labels = {
              pending: 'Pendentes',
              approved: 'Aprovados',
              completed: 'Concluídos',
              rejected: 'Rejeitados'
            };
            return (
              <Card key={status} className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{labels[status]}</span>
                  <RefundStatusBadge status={status} />
                </div>
                <p className="text-2xl font-bold mt-2">{count}</p>
              </Card>
            );
          })}
        </div>

        {/* Refunds list */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">ID</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Pedido</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Cliente</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Motivo</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Valor</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Data</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {refunds.map((refund) => (
                  <tr 
                    key={refund.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <span className="font-mono text-sm">{refund.id}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-sm text-muted-foreground">{refund.orderId}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-sm">{refund.customerName}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">{refund.reason}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-destructive">
                        -R$ {refund.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(refund.date), "dd MMM yyyy", { locale: ptBR })}
                      </span>
                    </td>
                    <td className="p-4">
                      <RefundStatusBadge status={refund.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {refunds.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Nenhum refund registrado</p>
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
}

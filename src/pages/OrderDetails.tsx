import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardHeader, CardContent } from "@/components/ui/custom-card";
import { OrderStatusBadge, StatusBadge } from "@/components/ui/custom-badge";
import { Button } from "@/components/ui/button";
import { RefundModal } from "@/components/RefundModal";
import { orders } from "@/data/orders";
import { emails } from "@/data/emails";
import { 
  ArrowLeft, 
  Package, 
  User, 
  MapPin, 
  Truck, 
  RefreshCw,
  Mail,
  Calendar,
  DollarSign
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [showRefundModal, setShowRefundModal] = useState(false);

  const order = orders.find(o => o.id === orderId);
  const relatedEmails = emails.filter(e => e.orderId === orderId);

  if (!order) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Pedido não encontrado</h2>
            <p className="text-muted-foreground mb-4">O pedido {orderId} não existe.</p>
            <Button onClick={() => navigate('/orders')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Pedidos
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/orders')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold font-mono">{order.id}</h1>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-muted-foreground">
                {format(new Date(order.date), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
              </p>
            </div>
          </div>
          
          {order.status !== 'refunded' && (
            <Button 
              variant="outline" 
              onClick={() => setShowRefundModal(true)}
              className="gap-2 text-destructive hover:text-destructive"
            >
              <RefreshCw className="w-4 h-4" />
              Solicitar Refund
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order items */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Package className="w-5 h-5 text-muted-foreground" />
                <h2 className="font-semibold">Itens do Pedido</h2>
              </CardHeader>
              <div className="divide-y divide-border">
                {order.items.map((item, index) => (
                  <div key={index} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <Package className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          SKU: {item.sku}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Qtd: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-border bg-muted/30">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-bold">
                    R$ {order.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </Card>

            {/* Email history */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <h2 className="font-semibold">Histórico de E-mails</h2>
              </CardHeader>
              {relatedEmails.length > 0 ? (
                <div className="divide-y divide-border">
                  {relatedEmails.map((email) => (
                    <div 
                      key={email.id}
                      onClick={() => navigate('/inbox')}
                      className="p-4 hover:bg-muted/30 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm">{email.subject}</p>
                            <StatusBadge status={email.status} />
                          </div>
                          <p className="text-sm text-muted-foreground">{email.preview}</p>
                        </div>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {format(new Date(email.date), "dd MMM, HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhum e-mail relacionado a este pedido
                  </p>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Customer info */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <User className="w-5 h-5 text-muted-foreground" />
                <h2 className="font-semibold">Cliente</h2>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                </div>
              </CardContent>
            </Card>

            {/* Shipping info */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <h2 className="font-semibold">Endereço de Entrega</h2>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {order.shippingAddress}
                </p>
              </CardContent>
            </Card>

            {/* Tracking info */}
            {order.trackingNumber && (
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <Truck className="w-5 h-5 text-muted-foreground" />
                  <h2 className="font-semibold">Rastreamento</h2>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-mono bg-muted px-3 py-2 rounded-lg">
                    {order.trackingNumber}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Order summary */}
            <Card>
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Data do pedido:</span>
                  <span className="font-medium ml-auto">
                    {format(new Date(order.date), "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Itens:</span>
                  <span className="font-medium ml-auto">
                    {order.items.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Valor total:</span>
                  <span className="font-medium ml-auto">
                    R$ {order.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Refund Modal */}
      <RefundModal
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        orderId={order.id}
        customerName={order.customerName}
      />
    </MainLayout>
  );
}

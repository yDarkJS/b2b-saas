import { useState } from "react";
import { Modal, ModalFooter } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { refundReasons, refundOptions } from "@/data/refunds";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  customerName: string;
}

export function RefundModal({ isOpen, onClose, orderId, customerName }: RefundModalProps) {
  const [reason, setReason] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleConfirm = () => {
    // Simulated confirmation
    alert(`Refund solicitado!\n\nPedido: ${orderId}\nMotivo: ${reason}\nOpções: ${selectedOptions.join(', ')}\nObservações: ${notes}`);
    handleClose();
  };

  const handleClose = () => {
    setReason("");
    setSelectedOptions([]);
    setNotes("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Solicitar Refund"
      description={`Pedido ${orderId} • ${customerName}`}
      size="md"
    >
      <div className="space-y-6">
        {/* Reason select */}
        <div className="space-y-2">
          <Label htmlFor="reason">Motivo do refund</Label>
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um motivo" />
            </SelectTrigger>
            <SelectContent>
              {refundReasons.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Options checkboxes */}
        <div className="space-y-3">
          <Label>Problemas identificados</Label>
          <div className="space-y-2">
            {refundOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-3">
                <Checkbox
                  id={option.id}
                  checked={selectedOptions.includes(option.id)}
                  onCheckedChange={() => handleOptionToggle(option.id)}
                />
                <Label 
                  htmlFor={option.id} 
                  className="text-sm font-normal text-muted-foreground cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Notes textarea */}
        <div className="space-y-2">
          <Label htmlFor="notes">Observações adicionais</Label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Descreva detalhes adicionais sobre o caso..."
            className="w-full h-24 p-3 bg-background border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>
      </div>

      <ModalFooter>
        <Button variant="outline" onClick={handleClose}>
          Cancelar
        </Button>
        <Button 
          onClick={handleConfirm}
          disabled={!reason}
          className="bg-destructive hover:bg-destructive/90"
        >
          Confirmar Refund
        </Button>
      </ModalFooter>
    </Modal>
  );
}

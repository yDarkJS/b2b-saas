export interface Refund {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  date: string;
  notes?: string;
}

export const refunds: Refund[] = [
  {
    id: 'REF-001',
    orderId: 'ORD-2024-1823',
    customerName: 'Michael Chen',
    amount: 459.00,
    reason: 'Produto danificado',
    status: 'completed',
    date: '2024-01-09T12:00:00',
    notes: 'Produto chegou com rachadura na superfície. Reembolso total aprovado.'
  },
  {
    id: 'REF-002',
    orderId: 'ORD-2024-1795',
    customerName: 'Anna Martinez',
    amount: 89.99,
    reason: 'Desistência',
    status: 'approved',
    date: '2024-01-07T15:30:00',
    notes: 'Cliente desistiu antes do envio.'
  },
  {
    id: 'REF-003',
    orderId: 'ORD-2024-1780',
    customerName: 'Robert Kim',
    amount: 199.00,
    reason: 'Produto incorreto',
    status: 'pending',
    date: '2024-01-10T09:45:00',
    notes: 'Cliente recebeu cor diferente da solicitada.'
  },
  {
    id: 'REF-004',
    orderId: 'ORD-2024-1768',
    customerName: 'Sophie Brown',
    amount: 349.00,
    reason: 'Atraso na entrega',
    status: 'completed',
    date: '2024-01-05T11:20:00',
    notes: 'Entrega atrasou 15 dias. Reembolso parcial oferecido e aceito.'
  }
];

export const refundReasons = [
  { value: 'damaged', label: 'Produto danificado' },
  { value: 'wrong_item', label: 'Produto incorreto' },
  { value: 'delayed', label: 'Atraso na entrega' },
  { value: 'defective', label: 'Produto com defeito' },
  { value: 'not_as_described', label: 'Não confere com a descrição' },
  { value: 'customer_request', label: 'Desistência do cliente' },
  { value: 'other', label: 'Outro motivo' }
];

export const refundOptions = [
  { id: 'delay', label: 'Atraso na entrega' },
  { id: 'defect', label: 'Produto com defeito' },
  { id: 'wrong_product', label: 'Produto errado enviado' },
  { id: 'customer_regret', label: 'Desistência do cliente' }
];

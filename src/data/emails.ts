export interface Email {
  id: string;
  customerName: string;
  customerEmail: string;
  orderId: string;
  subject: string;
  status: 'new' | 'replied' | 'pending';
  date: string;
  preview: string;
  thread: EmailMessage[];
}

export interface EmailMessage {
  id: string;
  from: 'customer' | 'store';
  content: string;
  contentPt?: string;
  date: string;
  isTranslated?: boolean;
}

export const emails: Email[] = [
  {
    id: 'em-001',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.johnson@email.com',
    orderId: 'ORD-2024-1847',
    subject: 'Question about my order delivery',
    status: 'new',
    date: '2024-01-10T14:32:00',
    preview: 'Hi, I placed an order last week and I was wondering when...',
    thread: [
      {
        id: 'msg-001',
        from: 'customer',
        content: "Hi, I placed an order last week and I was wondering when it will be delivered? The tracking hasn't updated in 3 days. Order number is ORD-2024-1847. Thanks!",
        contentPt: "Olá, fiz um pedido na semana passada e gostaria de saber quando será entregue? O rastreamento não atualiza há 3 dias. O número do pedido é ORD-2024-1847. Obrigado!",
        date: '2024-01-10T14:32:00',
      }
    ]
  },
  {
    id: 'em-002',
    customerName: 'Michael Chen',
    customerEmail: 'mchen@company.org',
    orderId: 'ORD-2024-1823',
    subject: 'Request for refund - damaged product',
    status: 'replied',
    date: '2024-01-09T09:15:00',
    preview: 'The product arrived damaged. I would like to request a refund...',
    thread: [
      {
        id: 'msg-002',
        from: 'customer',
        content: "The product arrived damaged. The packaging was torn and the item inside has a crack on the surface. I would like to request a full refund please.",
        contentPt: "O produto chegou danificado. A embalagem estava rasgada e o item tem uma rachadura na superfície. Gostaria de solicitar um reembolso total, por favor.",
        date: '2024-01-09T09:15:00',
      },
      {
        id: 'msg-003',
        from: 'store',
        content: "Dear Michael, we're sorry to hear about the damaged product. We've initiated a full refund for your order. You should see the amount credited within 5-7 business days. Would you like us to send a replacement as well?",
        date: '2024-01-09T11:45:00',
      },
      {
        id: 'msg-004',
        from: 'customer',
        content: "Thank you for the quick response! Yes, I would appreciate a replacement. Please send it to the same address.",
        contentPt: "Obrigado pela resposta rápida! Sim, eu gostaria de um substituto. Por favor, envie para o mesmo endereço.",
        date: '2024-01-09T14:20:00',
      }
    ]
  },
  {
    id: 'em-003',
    customerName: 'Emma Wilson',
    customerEmail: 'emma.w@gmail.com',
    orderId: 'ORD-2024-1856',
    subject: 'Wrong size received',
    status: 'pending',
    date: '2024-01-10T16:45:00',
    preview: 'I ordered a Medium but received a Large instead...',
    thread: [
      {
        id: 'msg-005',
        from: 'customer',
        content: "Hello, I ordered a Medium size but received a Large instead. Can I exchange this for the correct size? I still have the original packaging.",
        contentPt: "Olá, pedi tamanho M mas recebi G. Posso trocar pelo tamanho correto? Ainda tenho a embalagem original.",
        date: '2024-01-10T16:45:00',
      }
    ]
  },
  {
    id: 'em-004',
    customerName: 'James Rodriguez',
    customerEmail: 'jrodriguez@email.com',
    orderId: 'ORD-2024-1801',
    subject: 'Thank you for the great service!',
    status: 'replied',
    date: '2024-01-08T10:30:00',
    preview: 'Just wanted to say thank you for the excellent customer service...',
    thread: [
      {
        id: 'msg-006',
        from: 'customer',
        content: "Just wanted to say thank you for the excellent customer service! The issue with my order was resolved quickly and professionally. I'll definitely be ordering again.",
        contentPt: "Só queria agradecer pelo excelente atendimento ao cliente! O problema com meu pedido foi resolvido de forma rápida e profissional. Com certeza farei novos pedidos.",
        date: '2024-01-08T10:30:00',
      },
      {
        id: 'msg-007',
        from: 'store',
        content: "Thank you so much for your kind words, James! We're delighted to hear you had a great experience. Looking forward to serving you again!",
        date: '2024-01-08T12:00:00',
      }
    ]
  },
  {
    id: 'em-005',
    customerName: 'Lisa Anderson',
    customerEmail: 'lisa.anderson@work.com',
    orderId: 'ORD-2024-1862',
    subject: 'Bulk order inquiry',
    status: 'new',
    date: '2024-01-10T18:20:00',
    preview: 'We are interested in placing a bulk order for our company...',
    thread: [
      {
        id: 'msg-008',
        from: 'customer',
        content: "We are interested in placing a bulk order for our company event. We would need approximately 50 units. Do you offer any corporate discounts for large orders? Also, what would be the estimated delivery time?",
        contentPt: "Estamos interessados em fazer um pedido em grande quantidade para o evento da nossa empresa. Precisaríamos de aproximadamente 50 unidades. Vocês oferecem descontos corporativos para grandes pedidos? Além disso, qual seria o prazo estimado de entrega?",
        date: '2024-01-10T18:20:00',
      }
    ]
  }
];

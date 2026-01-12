export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  value: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'refunded';
  date: string;
  items: OrderItem[];
  shippingAddress: string;
  trackingNumber?: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  sku: string;
}

export const orders: Order[] = [
  {
    id: 'ORD-2024-1847',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.johnson@email.com',
    value: 189.99,
    status: 'shipped',
    date: '2024-01-03T10:45:00',
    items: [
      { name: 'Premium Wireless Headphones', quantity: 1, price: 149.99, sku: 'WH-001' },
      { name: 'USB-C Charging Cable', quantity: 2, price: 19.99, sku: 'CC-015' }
    ],
    shippingAddress: '123 Main Street, Apt 4B, New York, NY 10001',
    trackingNumber: 'TRK-9876543210'
  },
  {
    id: 'ORD-2024-1823',
    customerName: 'Michael Chen',
    customerEmail: 'mchen@company.org',
    value: 459.00,
    status: 'refunded',
    date: '2024-01-01T14:30:00',
    items: [
      { name: 'Smart Watch Pro', quantity: 1, price: 399.00, sku: 'SW-100' },
      { name: 'Watch Band - Leather', quantity: 1, price: 59.99, sku: 'WB-025' }
    ],
    shippingAddress: '456 Oak Avenue, Suite 200, San Francisco, CA 94102',
    trackingNumber: 'TRK-1234567890'
  },
  {
    id: 'ORD-2024-1856',
    customerName: 'Emma Wilson',
    customerEmail: 'emma.w@gmail.com',
    value: 79.99,
    status: 'processing',
    date: '2024-01-08T09:20:00',
    items: [
      { name: 'Cotton T-Shirt - Medium', quantity: 2, price: 29.99, sku: 'TS-M-BLK' },
      { name: 'Cotton T-Shirt - Medium', quantity: 1, price: 29.99, sku: 'TS-M-WHT' }
    ],
    shippingAddress: '789 Pine Road, Austin, TX 73301'
  },
  {
    id: 'ORD-2024-1801',
    customerName: 'James Rodriguez',
    customerEmail: 'jrodriguez@email.com',
    value: 1249.00,
    status: 'delivered',
    date: '2023-12-28T16:15:00',
    items: [
      { name: 'Gaming Laptop - 15"', quantity: 1, price: 1199.00, sku: 'GL-15-2024' },
      { name: 'Laptop Sleeve', quantity: 1, price: 49.99, sku: 'LS-015' }
    ],
    shippingAddress: '321 Elm Street, Chicago, IL 60601',
    trackingNumber: 'TRK-5555555555'
  },
  {
    id: 'ORD-2024-1862',
    customerName: 'Lisa Anderson',
    customerEmail: 'lisa.anderson@work.com',
    value: 2500.00,
    status: 'pending',
    date: '2024-01-10T11:00:00',
    items: [
      { name: 'Corporate Gift Set', quantity: 50, price: 49.99, sku: 'CGS-001' }
    ],
    shippingAddress: '555 Business Park Drive, Seattle, WA 98101'
  }
];

export const dashboardStats = {
  pendingEmails: 3,
  monthlyRefunds: 12,
  recentOrders: 47,
  totalRevenue: 24589.00,
  averageResponseTime: '2.4h',
  customerSatisfaction: 94
};

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { ordersApi } from '../lib/api';

export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'ready' | 'picked_up';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  emoji: string;
}

interface Order {
  id: string;
  queueNo: string;
  studentId: string;
  studentName: string;
  items: OrderItem[];
  pickupTime: string;
  status: OrderStatus;
  total: number;
  paymentMethod: 'qr';
  createdAt: number;
  plateReturned: boolean;
}

interface OrderContextType {
  orders: Order[];
  isLoading: boolean;
  placeOrder: (items: OrderItem[], pickupTime: string, total: number, studentName: string, studentId: string) => Promise<Order | null>;
  advanceOrderStatus: (orderId: string) => Promise<void>;
  returnPlate: (orderId: string) => void;
  getOrder: (queueNo: string) => Order | undefined;
  refreshOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | null>(null);

let queueCounter = 27;

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await ordersApi.getAll();
      const mapped = data.map((o: any) => ({
        id: o.id,
        queueNo: o.queueNo,
        studentId: o.studentId,
        studentName: o.studentName,
        items: o.items || [],
        pickupTime: o.pickupTime,
        status: o.status,
        total: o.total,
        paymentMethod: 'qr' as const,
        createdAt: new Date(o.createdAt).getTime(),
        plateReturned: o.plateReturned || false,
      }));
      setOrders(mapped);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    // Poll every 3 seconds for real-time updates
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const placeOrder = useCallback(async (items: OrderItem[], pickupTime: string, total: number, studentName: string, studentId: string) => {
    try {
      const orderItems = items.map(i => ({
        name: i.name,
        emoji: i.emoji,
        quantity: i.quantity,
        price: i.price,
      }));
      const result = await ordersApi.create({
        studentId,
        studentName,
        items: orderItems,
        pickupTime,
        total,
      });
      queueCounter++;

      const newOrder: Order = {
        id: result.id,
        queueNo: result.queueNo,
        studentId,
        studentName,
        items,
        pickupTime,
        status: 'pending',
        total,
        paymentMethod: 'qr',
        createdAt: Date.now(),
        plateReturned: false,
      };
      setOrders(prev => [newOrder, ...prev]);
      return newOrder;
    } catch (err) {
      console.error('Failed to place order:', err);
      return null;
    }
  }, []);

  const advanceOrderStatus = useCallback(async (orderId: string) => {
    const flow: OrderStatus[] = ['pending', 'accepted', 'preparing', 'ready', 'picked_up'];
    const currentOrder = orders.find(o => o.id === orderId);
    if (!currentOrder) return;

    const idx = flow.indexOf(currentOrder.status);
    if (idx < flow.length - 1) {
      const nextStatus = flow[idx + 1];
      try {
        await ordersApi.updateStatus(orderId, nextStatus);
        setOrders(prev =>
          prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o)
        );
      } catch (err) {
        console.error('Failed to update status:', err);
      }
    }
  }, [orders]);

  const getOrder = useCallback((queueNo: string) => {
    return orders.find(o => o.queueNo === queueNo);
  }, [orders]);

  const returnPlate = useCallback((orderId: string) => {
    setOrders(prev =>
      prev.map(o => o.id === orderId ? { ...o, plateReturned: true } : o)
    );
  }, []);

  return (
    <OrderContext.Provider value={{ orders, isLoading, placeOrder, advanceOrderStatus, returnPlate, getOrder, refreshOrders: fetchOrders }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
}

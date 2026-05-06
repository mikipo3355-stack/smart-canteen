const API_BASE = 'http://localhost:3001/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// Auth
export const authApi = {
  login: (username: string, password: string) =>
    request<{ id: string; name: string; username: string; role: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
};

// Shops
export const shopsApi = {
  getAll: () => request<any[]>('/shops'),
};

// Menu
export type TimeSlot = 'morning' | 'lunch' | 'afternoon';

export interface MenuItemFormData {
  shopId: string;
  name: string;
  emoji: string;
  price: number;
  prepTime: number;
  description: string;
  tags: string[];
  isAvailable?: boolean;
  timeSlots?: TimeSlot[];
}

export const menuApi = {
  getByShop: (shopId: string, includeUnavailable = false) =>
    request<any[]>(`/menu-items?shop_id=${shopId}${includeUnavailable ? '&include_unavailable=1' : ''}`),
  create: (data: MenuItemFormData) =>
    request<{ id: string }>('/menu-items', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<MenuItemFormData>) =>
    request<{ success: boolean }>(`/menu-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<{ success: boolean }>(`/menu-items/${id}`, {
      method: 'DELETE',
    }),
  toggleAvailability: (id: string, isAvailable: boolean) =>
    request<{ success: boolean; isAvailable: boolean }>(`/menu-items/${id}/availability`, {
      method: 'PATCH',
      body: JSON.stringify({ isAvailable }),
    }),
};

// Orders
export const ordersApi = {
  getAll: () => request<any[]>('/orders'),
  create: (data: { studentId: string; studentName: string; items: any[]; pickupTime: string; total: number }) =>
    request<{ id: string; queueNo: string }>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateStatus: (id: string, status: string) =>
    request<{ success: boolean }>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// Analytics
export const analyticsApi = {
  get: () => request<any>('/analytics'),
};

export { request };

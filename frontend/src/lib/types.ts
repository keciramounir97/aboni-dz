export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type UserRole = 'user' | 'admin' | 'super_admin';

export type UserPermissions = {
  products?: boolean;
  orders?: boolean;
  users?: boolean;
  contacts?: boolean;
  newsletter?: boolean;
  analytics?: boolean;
};

export type User = {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  permissions: UserPermissions | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductCategory =
  | 'spotify'
  | 'netflix'
  | 'playstation'
  | 'xbox'
  | 'snapchat'
  | 'disney'
  | 'youtube'
  | 'other';

export type Product = {
  id: number;
  slug: string;
  name_en: string;
  name_fr: string;
  name_ar: string;
  description_en: string | null;
  description_fr: string | null;
  description_ar: string | null;
  logo_url: string | null;
  category: ProductCategory;
  price: number;
  currency: string;
  duration_days: number;
  is_active: boolean;
  stock: number;
  created_at: string;
  updated_at: string;
};

export type OrderStatus =
  | 'pending'
  | 'awaiting_payment'
  | 'payment_submitted'
  | 'approved'
  | 'rejected'
  | 'delivered'
  | 'cancelled';

export type DeliveryAccount = {
  username?: string;
  email?: string;
  password?: string;
  extra?: string;
};

export type Order = {
  id: number;
  order_number: string;
  user_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  status: OrderStatus;
  payment_proof_url: string | null;
  delivery_account: DeliveryAccount | null;
  admin_note: string | null;
  reviewed_by: number | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  product?: Product;
  user?: User;
};

export type Contact = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
};

export type Newsletter = {
  id: number;
  email: string;
  is_active: boolean;
  created_at: string;
};

export type LoginResponse = {
  accessToken: string;
  user: User;
};

export type CreateProductPayload = {
  slug: string;
  name_en: string;
  name_fr: string;
  name_ar: string;
  description_en?: string;
  description_fr?: string;
  description_ar?: string;
  logo_url?: string;
  category: ProductCategory;
  price: number;
  currency?: string;
  duration_days: number;
  is_active?: boolean;
  stock?: number;
};

export type ReviewOrderPayload = {
  status: 'approved' | 'rejected' | 'delivered';
  admin_note?: string;
  delivery_account?: DeliveryAccount;
};

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'spotify',
  'netflix',
  'playstation',
  'xbox',
  'snapchat',
  'disney',
  'youtube',
  'other',
];

export const PERMISSION_KEYS = [
  'products',
  'orders',
  'users',
  'contacts',
  'newsletter',
  'analytics',
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];

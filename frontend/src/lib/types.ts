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

// ---- New types for MVP modules ----

export type Review = {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  product?: Product;
  user?: User;
};

export type Wishlist = {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string;
  updated_at: string;
  product?: Product;
};

export type Coupon = {
  id: number;
  code: string;
  description: string | null;
  discount_percent: number;
  max_uses: number;
  used_count: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Faq = {
  id: number;
  question_en: string;
  question_fr: string;
  question_ar: string;
  answer_en: string;
  answer_fr: string;
  answer_ar: string;
  category: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type BlogPost = {
  id: number;
  slug: string;
  title_en: string;
  title_fr: string;
  title_ar: string;
  excerpt_en: string | null;
  excerpt_fr: string | null;
  excerpt_ar: string | null;
  content_en: string | null;
  content_fr: string | null;
  content_ar: string | null;
  image_url: string | null;
  tag: string | null;
  is_published: boolean;
  author_id: number | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Testimonial = {
  id: number;
  name: string;
  role: string | null;
  content_en: string;
  content_fr: string;
  content_ar: string;
  rating: number;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ActivityLog = {
  id: number;
  user_id: number | null;
  user_name: string | null;
  action: string;
  entity: string | null;
  entity_id: number | null;
  metadata: string | null;
  ip_address: string | null;
  created_at: string;
};

export type Setting = {
  id: number;
  key: string;
  value: string | null;
  category: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export type AnalyticsOverview = {
  products: number;
  orders: number;
  users: number;
  reviews: number;
  coupons: number;
  revenue: number;
  pending: number;
};

export type SalesByStatus = { status: OrderStatus; total: number; count: number };
export type SalesByCategory = { category: string; total: number; count: number };
export type TopProduct = { id: number; name_en: string; name_fr: string; name_ar: string; category: string; sold: number; revenue: number };
export type UserGrowth = { month: string; count: number };
export type DailyRevenue = { date: string; revenue: number; count: number };

export type CreateCouponPayload = {
  code: string;
  description?: string;
  discount_percent: number;
  max_uses?: number;
  is_active?: boolean;
  expires_at?: string;
};

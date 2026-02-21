
export type Product = {
  id: number;
  name: string;
  nameEn: string;
  category: string;
  categoryEn: string;
  price: number;
  image: string;
  images?: string[];
  description: string;
  descriptionEn: string;
  stock: number;
};

export type Category = {
  ar: string;
  en: string;
};

export type CartItem = Product & { quantity: number };

export type User = {
  id?: string;
  name: string;
  email: string;
  password?: string;
  picture?: string;
  isBlocked?: boolean;
  notes?: string;
};

export type Customer = {
  id: string;
  name: string;
  email?: string;
  phone: string;
  orderCount: number;
  totalSpent: number;
  isBlocked: boolean;
  notes: string;
};

export type Order = {
  id: string;
  customerId?: string;
  date: string;
  items: CartItem[];
  total: number;
  customer: CustomerInfo;
  status: 'جديد' | 'قيد التجهيز' | 'تم الشحن' | 'مكتمل' | 'ملغي';
  couponCode?: string;
  trackingNumber?: string;
  shippingCompany?: string;
  shippingCost?: number;
};

export type ShippingCompany = {
  id: string;
  name: string;
  contact: string;
  isActive: boolean;
};

export type ShippingZone = {
  id: string;
  city: string;
  rate: number;
  deliveryTime: string;
  isActive: boolean;
};

export type Review = {
  id: number;
  productId: number;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  date: string;
};

export type StoreSettings = {
  name: string;
  logo: string;
  email: string;
  whatsapp: string;
  currency: string;
  defaultLanguage: 'ar' | 'en';
  taxPercentage: number;
  policy: string;
  aiDevelopmentEnabled: boolean;
};

export type Role = 'super_admin' | 'admin' | 'staff';

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  lastLogin?: string;
  createdAt: string;
};

export type ActivityLog = {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  ip?: string;
};

export type Coupon = {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  expiryDate: string;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
};

export type CustomerInfo = {
  name: string;
  phone: string;
  country: string;
  city: string;
  region: string;
  streetDetails: string;
  notes: string;
  paymentMethod: 'cod' | 'instapay' | 'credit_card';
  transactionId?: string;
  lat: number;
  lng: number;
};

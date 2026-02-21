
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
  name: string;
  email: string;
  password?: string;
  picture?: string;
};

export type Order = {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  customer: {
    name: string;
    phone: string;
    country: string;
    city: string;
    region: string;
    streetDetails: string;
    notes?: string;
    paymentMethod: 'cod' | 'instapay' | 'credit_card';
    email?: string;
    transactionId?: string;
  };
  status: 'جديد' | 'قيد التجهيز' | 'تم الشحن' | 'مكتمل' | 'ملغي';
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

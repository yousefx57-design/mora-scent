
import React from 'react';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  // Added lang prop to fix TypeScript error in App.tsx
  lang: 'ar' | 'en';
  updateQuantity: (id: number, delta: number) => void;
  removeFromCart: (id: number) => void;
  total: number;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, onClose, cart, lang, updateQuantity, 
  removeFromCart, total, onCheckout 
}) => {
  if (!isOpen) return null;

  const currency = lang === 'ar' ? 'ج.م' : 'EGP';

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
        <div className="p-5 border-b flex justify-between items-center bg-[#1a1a1a] text-white">
          <h2 className="text-xl font-serif font-bold">
            {lang === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}
          </h2>
          <button onClick={onClose}><X /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-20 text-neutral-400">
              <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
              <p>{lang === 'ar' ? 'السلة فارغة حالياً' : 'Your cart is empty'}</p>
              <button 
                onClick={onClose}
                className="mt-4 text-[#D4AF37] underline font-medium"
              >
                {lang === 'ar' ? 'ابدأ التسوق الآن' : 'Start shopping now'}
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 bg-neutral-50 p-3 rounded-xl border border-neutral-100 hover:border-[#D4AF37] transition-colors">
                <img src={item.image} className="w-20 h-20 object-cover rounded-lg" alt={item.name} />
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-neutral-800">
                    {lang === 'ar' ? item.name : item.nameEn}
                  </h4>
                  <div className="text-[#D4AF37] font-bold mt-1">{item.price} {currency}</div>
                  <div className="flex items-center gap-3 mt-3">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 bg-white border border-neutral-200 rounded-lg flex items-center justify-center text-lg hover:bg-[#D4AF37] hover:text-white transition-colors">-</button>
                    <span className="text-sm font-bold min-w-[20px] text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 bg-white border border-neutral-200 rounded-lg flex items-center justify-center text-lg hover:bg-[#D4AF37] hover:text-white transition-colors">+</button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-neutral-400 hover:text-red-500 self-start p-2"><Trash2 size={16} /></button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-5 border-t bg-neutral-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between mb-4 text-xl font-bold text-neutral-900">
              <span>{lang === 'ar' ? 'المجموع' : 'Total'}</span>
              <span>{total} {currency}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full bg-[#D4AF37] text-black py-4 font-bold rounded-xl hover:bg-[#b5952f] transition-all transform active:scale-95 shadow-lg"
            >
              {lang === 'ar' ? 'إتمام الطلب' : 'Checkout'}
            </button>
            <p className="text-center text-xs text-neutral-400 mt-4">
              {lang === 'ar' ? 'الأسعار شاملة ضريبة القيمة المضافة' : 'Prices include VAT'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;

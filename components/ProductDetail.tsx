
import React, { useState } from 'react';
import { X, ShoppingBag, ArrowRight, ArrowLeft, Star, ShieldCheck, Truck, Clock } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
  lang: 'ar' | 'en';
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose, onAddToCart, lang }) => {
  const [activeImage, setActiveImage] = useState(product.image);
  const gallery = [product.image, ...(product.images || [])];
  const currency = lang === 'ar' ? 'ج.م' : 'EGP';

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col md:flex-row animate-fade-in-up">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 bg-white/20 backdrop-blur-lg text-white rounded-full hover:bg-white hover:text-black transition-all"
        >
          <X size={24} />
        </button>

        {/* Left Side: Gallery */}
        <div className="w-full md:w-1/2 bg-neutral-100 flex flex-col p-4 md:p-8">
          <div className="flex-1 relative rounded-3xl overflow-hidden bg-white shadow-inner flex items-center justify-center">
            <img 
              src={activeImage} 
              alt={product.name} 
              className="max-h-[500px] w-auto object-contain transition-all duration-500"
            />
          </div>
          
          <div className="flex gap-3 mt-6 overflow-x-auto py-2 scrollbar-hide px-2">
            {gallery.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-[#D4AF37] scale-110 shadow-lg' : 'border-white'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {lang === 'ar' ? product.category : product.categoryEn}
            </span>
            <div className="flex text-yellow-400">
              {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="currentColor" />)}
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 mb-6 leading-tight">
            {lang === 'ar' ? product.name : product.nameEn}
          </h2>

          <div className="text-3xl font-bold text-neutral-900 mb-8 flex items-baseline gap-2">
            {product.price} <span className="text-lg text-[#D4AF37]">{currency}</span>
          </div>

          <div className="space-y-6 mb-10">
            <div>
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">
                {lang === 'ar' ? 'عن العطر' : 'About the Scent'}
              </h4>
              <p className="text-neutral-600 leading-relaxed text-lg italic">
                {lang === 'ar' ? product.description : product.descriptionEn}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-neutral-100 pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-50 rounded-lg text-[#D4AF37]"><Clock size={18} /></div>
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase font-bold">{lang === 'ar' ? 'موعد التوصيل' : 'Delivery'}</div>
                  <div className="text-xs font-bold">{lang === 'ar' ? 'خلال 48 ساعة كحد أقصى' : 'Within 48h Max'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-50 rounded-lg text-[#D4AF37]"><ShieldCheck size={18} /></div>
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase font-bold">{lang === 'ar' ? 'منتج أصلي' : '100% Original'}</div>
                  <div className="text-xs font-bold">{lang === 'ar' ? 'ضمان الجودة' : 'Quality Guaranteed'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => onAddToCart(product)}
              className="flex-1 bg-[#1a1a1a] text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#D4AF37] hover:text-black transition-all shadow-xl transform active:scale-95 group"
            >
              <ShoppingBag size={20} className="group-hover:rotate-12 transition-transform" />
              {lang === 'ar' ? 'أضف لحقيبة التسوق' : 'Add to Shopping Bag'}
            </button>
          </div>

          <p className="mt-8 text-xs text-neutral-400 text-center">
            {lang === 'ar' ? 'تم اختيار هذا العطر بعناية ليمنحك تجربة فريدة' : 'Carefully selected to provide you with a unique olfactory experience'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

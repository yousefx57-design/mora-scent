
import React, { useState } from 'react';
// Consolidate ShoppingBag into the main lucide-react import list
import { Heart, ChevronRight, ChevronLeft, Search, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onViewDetails: (p: Product) => void;
  lang: 'ar' | 'en';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails, lang }) => {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const allImages = [product.image, ...(product.images || [])];
  
  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev + 1) % allImages.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const currency = lang === 'ar' ? 'ج.م' : 'EGP';

  return (
    <div 
      onClick={() => onViewDetails(product)}
      className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-100 flex flex-col h-full"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
        <img 
          src={allImages[currentImgIdx]} 
          alt={product.name} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
        />
        
        {/* Quick View Overlay Icon */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 p-3 rounded-full text-black shadow-lg">
            <Search size={20} />
          </div>
        </div>

        {allImages.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button 
              onClick={prevImg} 
              className="p-1.5 bg-white/70 backdrop-blur rounded-full hover:bg-white text-black"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={nextImg} 
              className="p-1.5 bg-white/70 backdrop-blur rounded-full hover:bg-white text-black"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        <button 
          onClick={(e) => { e.stopPropagation(); }} 
          className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-full text-neutral-400 hover:text-red-500 z-10"
        >
          <Heart size={20} />
        </button>
        
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
          <button 
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className="w-full bg-[#1a1a1a] text-white py-3 font-medium hover:bg-[#D4AF37] hover:text-black transition-colors rounded-lg flex items-center justify-center gap-2"
          >
            <ShoppingBag size={18} />
            {lang === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
          </button>
        </div>
      </div>
      
      <div className="p-6 text-center flex-1 flex flex-col">
        <div className="text-xs text-[#D4AF37] font-medium mb-1 uppercase tracking-wider">
          {lang === 'ar' ? product.category : product.categoryEn}
        </div>
        <h4 className="text-xl font-serif font-bold text-neutral-900 mb-2">
          {lang === 'ar' ? product.name : product.nameEn}
        </h4>
        <p className="text-neutral-500 text-sm mb-4 line-clamp-2">
          {lang === 'ar' ? product.description : product.descriptionEn}
        </p>
        <div className="text-xl font-bold text-neutral-900 border-t border-neutral-50 pt-3 mt-auto">
          {product.price} {currency}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

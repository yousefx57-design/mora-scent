
import React, { useState } from 'react';
import { X, ShoppingBag, ArrowRight, ArrowLeft, Star, ShieldCheck, Truck, Clock, MessageSquare, Send, User as UserIcon } from 'lucide-react';
import { Product, Review, User } from '../types';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
  lang: 'ar' | 'en';
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void;
  user: User | null;
  isReviewSystemActive: boolean;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, onClose, onAddToCart, lang, reviews, onAddReview, user, isReviewSystemActive 
}) => {
  const [activeImage, setActiveImage] = useState(product.image);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const gallery = [product.image, ...(product.images || [])];
  const currency = lang === 'ar' ? 'ج.م' : 'EGP';

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!newComment.trim()) return;

    onAddReview({
      productId: product.id,
      userName: user.name,
      userEmail: user.email,
      rating: newRating,
      comment: newComment
    });
    setNewComment("");
    setNewRating(5);
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

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
            {isReviewSystemActive && avgRating && (
              <div className="flex items-center gap-1 text-[#D4AF37]">
                <Star size={12} fill="currentColor" />
                <span className="text-xs font-bold">{avgRating}</span>
                <span className="text-[10px] text-neutral-400">({reviews.length})</span>
              </div>
            )}
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

          {/* Reviews Section */}
          {isReviewSystemActive && (
            <div className="mt-12 pt-12 border-t border-neutral-100">
              <h3 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3">
                <MessageSquare className="text-[#D4AF37]" />
                {lang === 'ar' ? 'تقييمات العملاء' : 'Customer Reviews'}
              </h3>

              {/* Review Form */}
              {user ? (
                <form onSubmit={handleReviewSubmit} className="bg-neutral-50 p-6 rounded-3xl mb-10 border border-neutral-100">
                  <div className="flex items-center gap-4 mb-4">
                    <img src={user.picture} className="w-10 h-10 rounded-full border-2 border-[#D4AF37]" alt={user.name} />
                    <div>
                      <div className="font-bold text-sm">{user.name}</div>
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewRating(star)}
                            className={`transition-colors ${star <= newRating ? 'text-[#D4AF37]' : 'text-neutral-300'}`}
                          >
                            <Star size={16} fill={star <= newRating ? "currentColor" : "none"} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={lang === 'ar' ? 'اكتب رأيك هنا...' : 'Write your review here...'}
                      className="w-full p-4 bg-white border border-neutral-100 rounded-2xl outline-none focus:border-[#D4AF37] resize-none h-24 text-sm"
                    />
                    <button
                      type="submit"
                      className="absolute bottom-4 left-4 bg-[#1a1a1a] text-white p-2 rounded-xl hover:bg-[#D4AF37] hover:text-black transition-all"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-neutral-50 p-6 rounded-3xl mb-10 border border-dashed border-neutral-200 text-center">
                  <p className="text-sm text-neutral-500">
                    {lang === 'ar' ? 'يرجى تسجيل الدخول لتتمكن من إضافة تقييم' : 'Please login to leave a review'}
                  </p>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <p className="text-center text-neutral-400 text-sm py-10">
                    {lang === 'ar' ? 'لا توجد تقييمات بعد. كن أول من يقيم!' : 'No reviews yet. Be the first to review!'}
                  </p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="flex gap-4 p-4 bg-white rounded-2xl border border-neutral-50 shadow-sm">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400">
                          <UserIcon size={20} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <div className="font-bold text-sm">{review.userName}</div>
                          <div className="text-[10px] text-neutral-400">{review.date}</div>
                        </div>
                        <div className="flex text-[#D4AF37] mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={10} fill={star <= review.rating ? "currentColor" : "none"} />
                          ))}
                        </div>
                        <p className="text-sm text-neutral-600 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;


import React, { useState } from 'react';
import { X, MapPin, CreditCard, Banknote, ShieldCheck, CheckCircle, Info, Smartphone, Clipboard, Phone, Ticket } from 'lucide-react';
import { CartItem, Order, CustomerInfo, User, StoreSettings, Coupon } from '../types';
import { EGYPT_CITIES } from '../constants';

interface CheckoutModalProps {
  lang: 'ar' | 'en';
  user: User | null;
  onClose: () => void;
  total: number;
  cart: CartItem[];
  onOrderSubmit: (order: Order) => void;
  storeSettings: StoreSettings;
  coupons: Coupon[];
  shippingZones: ShippingZone[];
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ lang, user, onClose, total, cart, onOrderSubmit, storeSettings, coupons, shippingZones }) => {
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [info, setInfo] = useState<CustomerInfo>({
    name: user?.name || '', phone: '', country: 'مصر', city: EGYPT_CITIES[0], region: '', streetDetails: '',
    notes: '', paymentMethod: 'cod', transactionId: '', lat: 0, lng: 0
  });
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");

  const currency = storeSettings.currency;

  const currentZone = shippingZones.find(z => z.city === info.city && z.isActive);
  const shippingCost = currentZone ? currentZone.rate : 0;

  const handleApplyCoupon = () => {
    setCouponError("");
    const coupon = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase() && c.isActive);
    
    if (!coupon) {
      setCouponError(lang === 'ar' ? 'كود غير صالح' : 'Invalid code');
      return;
    }

    if (total < coupon.minOrderValue) {
      setCouponError(lang === 'ar' ? `أقل قيمة للطلب ${coupon.minOrderValue}` : `Min order value ${coupon.minOrderValue}`);
      return;
    }

    if (coupon.usageCount >= coupon.usageLimit) {
      setCouponError(lang === 'ar' ? 'انتهت صلاحية الكود' : 'Coupon expired');
      return;
    }

    setAppliedCoupon(coupon);
  };

  const discount = appliedCoupon 
    ? (appliedCoupon.discountType === 'percentage' 
        ? (total * appliedCoupon.discountValue / 100) 
        : appliedCoupon.discountValue)
    : 0;

  const finalTotal = total - discount + shippingCost;

  const handleSubmit = () => {
    if (info.paymentMethod === 'instapay' && !info.transactionId) {
      alert(lang === 'ar' ? "يرجى إدخال رقم العملية" : "Enter transaction ID");
      return;
    }
    const newOrder: Order = {
      id: `MRA-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      date: new Date().toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-EG'),
      items: cart,
      total: finalTotal,
      customer: { ...info, phone: `+20${info.phone}`, email: user?.email },
      status: 'جديد',
      couponCode: appliedCoupon?.code,
      shippingCost: shippingCost
    };
    setLastOrder(newOrder);
    onOrderSubmit(newOrder);
    setIsSuccess(true);
  };

  if (isSuccess && lastOrder) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-neutral-900 mb-2">شكراً لطلبك من {storeSettings.name}!</h2>
          <p className="text-neutral-500 mb-8">تم تسجيل طلبك بنجاح. سيتم التواصل معك قريباً لتأكيد الشحن.</p>
          
          <div className="bg-neutral-50 rounded-2xl p-6 text-right mb-8 border border-neutral-100">
             <div className="flex justify-between items-center mb-4 pb-2 border-b border-neutral-200">
                <span className="font-bold text-[#D4AF37]">رقم الفاتورة:</span>
                <span className="font-mono font-bold text-neutral-900">{lastOrder.id}</span>
             </div>
             <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-neutral-400">العميل:</span><span>{lastOrder.customer.name}</span></div>
                <div className="flex justify-between"><span className="text-neutral-400">طريقة الدفع:</span><span>{lastOrder.customer.paymentMethod === 'cod' ? 'عند الاستلام' : 'إنستا باي'}</span></div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2"><span>الإجمالي:</span><span>{lastOrder.total} {currency}</span></div>
             </div>
          </div>

          <div className="flex flex-col gap-3">
             <div className="flex items-center justify-center gap-2 text-neutral-600 bg-neutral-100 p-4 rounded-2xl">
                <Phone size={18} className="text-[#D4AF37]" />
                <span className="font-bold">{storeSettings.whatsapp}</span>
             </div>
             <button onClick={onClose} className="bg-[#1a1a1a] text-white py-4 rounded-xl font-bold hover:bg-[#D4AF37] hover:text-black transition-all">العودة للتسوق</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-6 bg-[#1a1a1a] text-white flex justify-between items-center">
          <h2 className="text-2xl font-serif font-bold text-[#D4AF37]">إتمام طلب {storeSettings.name}</h2>
          <button onClick={onClose}><X /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-8">
           {step === 1 && (
             <div className="space-y-6">
               <h3 className="text-xl font-bold">بيانات العميل</h3>
               <input type="text" placeholder="الاسم الثلاثي" className="w-full p-4 bg-neutral-50 rounded-xl outline-none border" value={info.name} onChange={e => setInfo({...info, name: e.target.value})} />
               <div className="flex gap-2">
                 <div className="bg-neutral-100 p-4 rounded-xl font-bold">+20</div>
                 <input type="tel" placeholder="رقم التلفون" className="flex-1 p-4 bg-neutral-50 rounded-xl outline-none border" value={info.phone} onChange={e => setInfo({...info, phone: e.target.value})} />
               </div>

               <button onClick={() => {
                 if(!info.name || !info.phone) {
                   alert('يرجى إدخال الاسم ورقم الهاتف');
                   return;
                 }
                 setStep(2);
               }} className="w-full bg-black text-white py-4 rounded-xl font-bold">التالي</button>
             </div>
           )}
            {step === 2 && (
             <div className="space-y-6">
                <h3 className="text-xl font-bold">عنوان التوصيل</h3>
                <select className="w-full p-4 bg-neutral-50 rounded-xl border" value={info.city} onChange={e => setInfo({...info, city: e.target.value})}>
                   {EGYPT_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="text" placeholder="المنطقة" className="w-full p-4 bg-neutral-50 rounded-xl border" value={info.region} onChange={e => setInfo({...info, region: e.target.value})} />
                <textarea placeholder="تفاصيل العنوان (اختياري)" className="w-full p-4 bg-neutral-50 rounded-xl border h-24 resize-none" value={info.streetDetails} onChange={e => setInfo({...info, streetDetails: e.target.value})} />
                <textarea placeholder="ملاحظات إضافية للتوصيل (اختياري)" className="w-full p-4 bg-neutral-50 rounded-xl border h-24 resize-none" value={info.notes} onChange={e => setInfo({...info, notes: e.target.value})} />
                <button onClick={() => {
                  if(!info.region) {
                    alert('يرجى إدخال المنطقة');
                    return;
                  }
                  setStep(3);
                }} className="w-full bg-black text-white py-4 rounded-xl font-bold">التالي</button>
             </div>
           )}
            {step === 3 && (
             <div className="space-y-6">
                <h3 className="text-xl font-bold">طريقة الدفع</h3>
                <label className="flex items-center gap-4 p-4 border rounded-2xl cursor-pointer hover:bg-neutral-50">
                   <input type="radio" checked={info.paymentMethod === 'cod'} onChange={() => setInfo({...info, paymentMethod: 'cod'})} />
                   <Banknote className="text-[#D4AF37]" /> <span>عند الاستلام</span>
                </label>
                <label className="flex flex-col p-4 border rounded-2xl cursor-pointer hover:bg-neutral-50">
                   <div className="flex items-center gap-4">
                    <input type="radio" checked={info.paymentMethod === 'instapay'} onChange={() => setInfo({...info, paymentMethod: 'instapay'})} />
                    <Smartphone className="text-[#D4AF37]" /> <span>إنستا باي</span>
                   </div>
                   {info.paymentMethod === 'instapay' && (
                     <div className="mt-4 p-4 bg-white border border-[#D4AF37]/20 rounded-xl space-y-3">
                        <p className="text-xs font-bold">العنوان: <span className="text-[#D4AF37]">{storeSettings.whatsapp}</span></p>
                        <input type="text" placeholder="رقم العملية" className="w-full p-3 border rounded-lg text-center font-mono" value={info.transactionId} onChange={e => setInfo({...info, transactionId: e.target.value})} />
                     </div>
                   )}
                </label>

                <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Ticket size={18} className="text-[#D4AF37]" />
                    {lang === 'ar' ? 'كوبون الخصم' : 'Discount Coupon'}
                  </h3>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder={lang === 'ar' ? 'أدخل الكود هنا' : 'Enter code here'}
                      className="flex-1 p-3 border rounded-xl outline-none focus:border-[#D4AF37] uppercase font-mono"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                    />
                    <button 
                      onClick={handleApplyCoupon}
                      className="bg-[#1a1a1a] text-[#D4AF37] px-6 rounded-xl font-bold hover:bg-black transition-all"
                    >
                      {lang === 'ar' ? 'تطبيق' : 'Apply'}
                    </button>
                  </div>
                  {couponError && <p className="text-red-500 text-xs mt-2 font-bold">{couponError}</p>}
                  {appliedCoupon && (
                    <div className="mt-3 flex justify-between items-center bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                      <span className="text-emerald-700 text-xs font-bold">
                        {lang === 'ar' ? 'تم تطبيق الخصم:' : 'Discount applied:'} {appliedCoupon.code}
                      </span>
                      <button onClick={() => setAppliedCoupon(null)} className="text-red-500"><X size={14} /></button>
                    </div>
                  )}
                </div>

                <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-100 space-y-3">
                  <div className="flex justify-between text-sm">
                     <span className="text-neutral-500">المجموع الفرعي:</span>
                     <span className="font-bold">{total} {currency}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600">
                       <span>الخصم:</span>
                       <span className="font-bold">-{discount} {currency}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                     <span className="text-neutral-500">تكلفة الشحن ({info.city}):</span>
                     <span className="font-bold">{shippingCost} {currency}</span>
                  </div>
                  <div className="flex justify-between text-lg border-t pt-3">
                     <span className="font-bold">الإجمالي النهائي:</span>
                     <span className="font-bold text-[#D4AF37]">{finalTotal} {currency}</span>
                  </div>
                </div>

                <button onClick={handleSubmit} className="w-full bg-[#D4AF37] text-black py-4 rounded-xl font-bold shadow-lg hover:bg-black hover:text-[#D4AF37] transition-all">تأكيد الطلب</button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;

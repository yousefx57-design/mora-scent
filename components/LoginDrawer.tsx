
import React, { useState } from 'react';
import { X, LogIn, User as UserIcon, Mail, Lock, Bell, Package, CheckCircle2 } from 'lucide-react';
import { User, Order } from '../types';

interface LoginDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
  user: User | null;
  onLogin: (userData: User) => void;
  onLogout: () => void;
  orders: Order[];
}

const LoginDrawer: React.FC<LoginDrawerProps> = ({ 
  isOpen, onClose, lang, user, onLogin, onLogout, orders 
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  if (!isOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || (isRegister && !formData.name)) {
      alert(lang === 'ar' ? 'يرجى ملء جميع البيانات' : 'Please fill all fields');
      return;
    }
    onLogin({
      name: isRegister ? formData.name : (lang === 'ar' ? 'عميل Mora scent' : 'Mora scent Customer'),
      email: formData.email,
      picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`
    });
    setFormData({ name: '', email: '', password: '' });
  };

  const userOrders = orders.filter(o => o.customer.email === user?.email || o.customer.name === user?.name);

  return (
    <div className="fixed inset-0 z-[60] flex justify-start">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-left">
        <div className="p-5 border-b flex justify-between items-center bg-[#1a1a1a] text-white">
          <h2 className="text-xl font-serif font-bold">
            {user 
              ? (lang === 'ar' ? 'حسابي' : 'My Account') 
              : (isRegister ? (lang === 'ar' ? 'إنشاء حساب' : 'Create Account') : (lang === 'ar' ? 'تسجيل الدخول' : 'Login'))}
          </h2>
          <button onClick={onClose}><X /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8">
          {user ? (
            <div className="space-y-8">
              <div className="text-center">
                <div className="relative inline-block">
                  <img src={user.picture} alt={user.name} className="w-24 h-24 rounded-full border-4 border-[#D4AF37] mx-auto shadow-lg" />
                  <div className="absolute bottom-0 right-0 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white"></div>
                </div>
                <h3 className="text-2xl font-serif font-bold mt-4">{user.name}</h3>
                <p className="text-neutral-400 text-sm">{user.email}</p>
                <button 
                  onClick={onLogout}
                  className="mt-4 text-red-500 text-sm font-bold hover:underline"
                >
                  {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                </button>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold flex items-center gap-2 text-neutral-800 border-b pb-2">
                  <Bell size={18} className="text-[#D4AF37]" />
                  {lang === 'ar' ? 'إشعارات الطلبات' : 'Order Notifications'}
                </h4>
                
                {userOrders.length === 0 ? (
                  <div className="text-center py-10 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                    <Package size={32} className="mx-auto text-neutral-300 mb-2" />
                    <p className="text-xs text-neutral-400">
                      {lang === 'ar' ? 'لا توجد طلبات نشطة حالياً' : 'No active orders currently'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userOrders.map(order => (
                      <div key={order.id} className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-1 h-full bg-[#D4AF37]"></div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-mono font-bold text-neutral-400">#{order.id}</span>
                          <span className="text-[10px] bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 rounded-full font-bold">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-neutral-700">
                          {lang === 'ar' ? `طلبك الآن في مرحلة: ${order.status}` : `Your order is now: ${order.status}`}
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-[10px] text-neutral-400">
                          <CheckCircle2 size={12} className="text-emerald-500" />
                          {lang === 'ar' ? 'سيتم تحديثك عند تغيير الحالة' : 'You will be updated on status change'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-3xl flex items-center justify-center text-[#D4AF37] mx-auto mb-4">
                  <LogIn size={40} />
                </div>
                <h3 className="text-2xl font-serif font-bold">
                  {isRegister ? (lang === 'ar' ? 'انضم إلينا' : 'Join Us') : (lang === 'ar' ? 'مرحباً بك' : 'Welcome')}
                </h3>
                <p className="text-sm text-neutral-400 mt-2">
                  {lang === 'ar' ? 'استمتع بتجربة تسوق فاخرة مع Mora scent' : 'Enjoy a luxury shopping experience with Mora scent'}
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-5">
                {isRegister && (
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input 
                      type="text" 
                      placeholder={lang === 'ar' ? 'الاسم بالكامل' : 'Full Name'} 
                      className="w-full pl-12 pr-4 py-4 bg-neutral-50 rounded-2xl outline-none border border-neutral-100 focus:border-[#D4AF37] focus:bg-white transition-all"
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                  <input 
                    type="email" 
                    placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} 
                    className="w-full pl-12 pr-4 py-4 bg-neutral-50 rounded-2xl outline-none border border-neutral-100 focus:border-[#D4AF37] focus:bg-white transition-all"
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                  <input 
                    type="password" 
                    placeholder={lang === 'ar' ? 'كلمة المرور' : 'Password'} 
                    className="w-full pl-12 pr-4 py-4 bg-neutral-50 rounded-2xl outline-none border border-neutral-100 focus:border-[#D4AF37] focus:bg-white transition-all"
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                
                <button className="w-full bg-[#1a1a1a] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#D4AF37] hover:text-black transition-all shadow-xl active:scale-95 transform mt-4">
                  {isRegister ? (lang === 'ar' ? 'إنشاء حساب' : 'Create Account') : (lang === 'ar' ? 'تسجيل الدخول' : 'Sign In')}
                </button>
              </form>

              <div className="mt-auto pt-8 text-center">
                <p className="text-sm text-neutral-500">
                  {isRegister 
                    ? (lang === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?') 
                    : (lang === 'ar' ? 'ليس لديك حساب؟' : 'Don\'t have an account?')}
                  <button 
                    onClick={() => setIsRegister(!isRegister)} 
                    className="text-[#D4AF37] font-bold mx-2 hover:underline"
                  >
                    {isRegister ? (lang === 'ar' ? 'تسجيل الدخول' : 'Login') : (lang === 'ar' ? 'انضم إلينا' : 'Join Us')}
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginDrawer;

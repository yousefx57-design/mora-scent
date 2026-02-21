
import React from 'react';
import { Mail, Instagram, Twitter, Facebook, Smartphone, Phone } from 'lucide-react';
import { StoreSettings } from '../types';

interface FooterProps {
  onAdminClick: () => void;
  lang: 'ar' | 'en';
  storeSettings: StoreSettings;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick, lang, storeSettings }) => {
  return (
    <footer className="bg-white pt-20 pb-10 border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <h4 className="text-3xl font-serif font-bold text-[#D4AF37] mb-6">{storeSettings.name}</h4>
            <p className="text-neutral-500 text-sm leading-relaxed mb-8">
              {storeSettings.policy}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border flex items-center justify-center text-neutral-400 hover:bg-[#D4AF37] hover:text-black transition-all"><Instagram size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full border flex items-center justify-center text-neutral-400 hover:bg-[#D4AF37] hover:text-black transition-all"><Facebook size={18} /></a>
            </div>
          </div>
          
          <div>
            <h5 className="font-bold text-neutral-900 mb-6 border-b border-[#D4AF37] pb-2 inline-block">روابط سريعة</h5>
            <ul className="space-y-4 text-sm text-neutral-600">
              <li><a href="#" className="hover:text-[#D4AF37]">الرئيسية</a></li>
              <li><a href="#collection" className="hover:text-[#D4AF37]">المجموعات</a></li>
              <li><button onClick={onAdminClick} className="hover:text-[#D4AF37]">إدارة المتجر</button></li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-bold text-neutral-900 mb-6 border-b border-[#D4AF37] pb-2 inline-block">تواصل معنا</h5>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-[#D4AF37] mt-1" />
                <div>
                  <div className="text-xs text-neutral-400 mb-1">خدمة العملاء</div>
                  <div className="text-sm font-bold text-neutral-700">{storeSettings.whatsapp}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-[#D4AF37] mt-1" />
                <div className="text-sm font-bold text-neutral-700">{storeSettings.email}</div>
              </div>
            </div>
          </div>
          
          <div>
             <h5 className="font-bold text-neutral-900 mb-6 border-b border-[#D4AF37] pb-2 inline-block">موقعنا</h5>
             <p className="text-xs text-neutral-500 leading-relaxed">
               جمهورية مصر العربية، القاهرة<br />التجمع الخامس - القاهرة الجديدة
             </p>
          </div>
        </div>
        
        <div className="border-t border-neutral-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-400">
          <p>&copy; {new Date().getFullYear()} {storeSettings.name}. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6 items-center">
            <span className="flex items-center gap-1.5 bg-neutral-100 px-3 py-1 rounded-full text-neutral-700 font-bold">
               <Smartphone size={12} className="text-[#D4AF37]" /> InstaPay
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

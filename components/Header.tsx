
import React, { useState } from 'react';
import { Search, ShoppingBag, Languages, LogIn, User as UserIcon, X, LogOut } from 'lucide-react';
import { Product, User } from '../types';

interface HeaderProps {
  lang: 'ar' | 'en';
  setLang: (l: 'ar' | 'en') => void;
  cartCount: number;
  isSearchOpen: boolean;
  setIsSearchOpen: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onOpenCart: () => void;
  onOpenLogin: () => void;
  products: Product[];
  user: User | null;
  onLogin: (userData: User) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  lang, setLang, cartCount, isSearchOpen, setIsSearchOpen, 
  onOpenCart, onOpenLogin, user, onLogout
}) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <div className="flex items-center gap-4">
            <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="p-2 text-neutral-600 hover:text-[#D4AF37] flex items-center gap-1">
              <Languages size={20} />
              <span className="text-xs font-bold">{lang === 'ar' ? 'English' : 'عربي'}</span>
            </button>
            
            <div className="h-6 w-px bg-neutral-200 mx-2"></div>
            
            {user ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={onOpenLogin}
                  className="flex items-center gap-2 bg-neutral-100 px-3 py-1.5 rounded-full border border-neutral-200 hover:border-[#D4AF37] transition-all"
                >
                  <img src={user.picture} alt={user.name} className="w-6 h-6 rounded-full" />
                  <span className="text-xs font-bold hidden md:block">{user.name}</span>
                </button>
                <button onClick={onLogout} className="p-2 text-red-400 hover:text-red-600">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button 
                onClick={onOpenLogin}
                className="flex items-center gap-2 bg-[#D4AF37]/10 text-[#D4AF37] px-4 py-2 rounded-full hover:bg-[#D4AF37] hover:text-white transition-all text-xs font-bold"
              >
                <LogIn size={16} />
                {lang === 'ar' ? 'تسجيل دخول' : 'Login'}
              </button>
            )}
          </div>

          <div className="flex-shrink-0 cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
            <h1 className="text-3xl font-serif font-bold text-[#D4AF37] tracking-tighter">
              Mora scent
            </h1>
          </div>

          <div className="flex items-center space-x-4 space-x-reverse">
            <button className="p-2 text-neutral-600 hover:text-[#D4AF37]" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search size={22} />
            </button>
            <button className="p-2 text-neutral-600 hover:text-[#D4AF37] relative" onClick={onOpenCart}>
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] px-1.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;

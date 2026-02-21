
import React, { useState, useEffect } from "react";
import { Product, CartItem, Order, User, Category, Review, Customer, StoreSettings, AdminUser, ActivityLog, Coupon, ShippingCompany, ShippingZone } from './types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, EGYPT_CITIES } from './constants';
import ChatWidget from './components/ChatWidget';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import LoginDrawer from './components/LoginDrawer';

const App: React.FC = () => {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [view, setView] = useState<'store' | 'admin'>('store');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isReviewSystemActive, setIsReviewSystemActive] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    name: 'Mora scent',
    logo: 'M',
    email: 'info@morascent.com',
    whatsapp: '01550294614',
    currency: 'ج.م',
    defaultLanguage: 'ar',
    taxPercentage: 14,
    policy: 'سياسة المتجر: التوصيل خلال 48 ساعة، المرتجعات خلال 14 يوم من الاستلام.',
    aiDevelopmentEnabled: true
  });
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
    { id: '1', name: 'Super Admin', email: 'admin@morascent.com', role: 'super_admin', createdAt: '2024-01-01' }
  ]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([
    { id: '1', code: 'MORA10', discountType: 'percentage', discountValue: 10, minOrderValue: 500, expiryDate: '2025-12-31', usageLimit: 100, usageCount: 0, isActive: true }
  ]);
  const [shippingCompanies, setShippingCompanies] = useState<ShippingCompany[]>([
    { id: '1', name: 'Aramex', contact: '02-333-1234', isActive: true },
    { id: '2', name: 'Bosta', contact: '02-444-5678', isActive: true }
  ]);
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>(
    EGYPT_CITIES.map((city, idx) => ({
      id: idx.toString(),
      city,
      rate: city === 'القاهرة' || city === 'الجيزة' ? 50 : 70,
      deliveryTime: '2-3 أيام',
      isActive: true
    }))
  );

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsLoginOpen(false);
    alert(lang === 'ar' ? `مرحباً بك في Mora scent، ${userData.name}!` : `Welcome to Mora scent, ${userData.name}!`);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoginOpen(false);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const removeFromCart = (id: number) => setCart(prev => prev.filter(item => item.id !== id));

  const filteredProducts = products.filter(p => {
    const catMatch = activeCategory === "الكل" || p.category === activeCategory || p.categoryEn === activeCategory;
    const nameMatch = (lang === 'ar' ? p.name : p.nameEn).toLowerCase().includes(searchQuery.toLowerCase());
    return catMatch && nameMatch;
  });

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleAddReview = (review: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...review,
      id: Date.now(),
      date: new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')
    };
    setReviews(prev => [...prev, newReview]);
  };

  if (view === 'admin') {
    return <AdminDashboard 
      orders={orders} 
      setOrders={setOrders}
      products={products} 
      setProducts={setProducts} 
      categories={categories}
      setCategories={setCategories}
      customers={customers}
      setCustomers={setCustomers}
      onClose={() => setView('store')}
      lang={lang}
      isReviewSystemActive={isReviewSystemActive}
      setIsReviewSystemActive={setIsReviewSystemActive}
      storeSettings={storeSettings}
      setStoreSettings={setStoreSettings}
      adminUsers={adminUsers}
      setAdminUsers={setAdminUsers}
      activityLogs={activityLogs}
      setActivityLogs={setActivityLogs}
      coupons={coupons}
      setCoupons={setCoupons}
      shippingCompanies={shippingCompanies}
      setShippingCompanies={setShippingCompanies}
      shippingZones={shippingZones}
      setShippingZones={setShippingZones}
    />;
  }

  return (
    <div className={`min-h-screen bg-neutral-50 font-sans text-neutral-900 ${lang === 'en' ? 'font-sans' : ''}`}>
      <Header 
        lang={lang}
        setLang={setLang}
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        products={products}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        storeSettings={storeSettings}
      />

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        lang={lang}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        total={cartTotal}
        onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
      />

      <LoginDrawer 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        lang={lang}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        orders={orders}
      />

      {isCheckoutOpen && (
        <CheckoutModal 
          lang={lang}
          user={user}
          onClose={() => setIsCheckoutOpen(false)}
          total={cartTotal}
          cart={cart}
          onOrderSubmit={(newOrder) => {
            setOrders(prev => [newOrder, ...prev]);
            
            // Update coupon usage if applied
            if (newOrder.couponCode) {
              setCoupons(prev => prev.map(c => c.code === newOrder.couponCode ? { ...c, usageCount: c.usageCount + 1 } : c));
            }

            // Update or create customer
            setCustomers(prev => {
              const existing = prev.find(c => c.phone === newOrder.customer.phone);
              if (existing) {
                return prev.map(c => c.phone === newOrder.customer.phone ? {
                  ...c,
                  orderCount: c.orderCount + 1,
                  totalSpent: c.totalSpent + newOrder.total
                } : c);
              }
              return [...prev, {
                id: `CST-${Date.now()}`,
                name: newOrder.customer.name,
                email: newOrder.customer.email,
                phone: newOrder.customer.phone,
                orderCount: 1,
                totalSpent: newOrder.total,
                isBlocked: false,
                notes: ''
              }];
            });

            setCart([]);
            setIsCheckoutOpen(false);
          }}
          storeSettings={storeSettings}
          coupons={coupons}
          shippingZones={shippingZones}
        />
      )}

      {selectedProduct && (
        <ProductDetail 
          product={selectedProduct}
          lang={lang}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(p) => { addToCart(p); setSelectedProduct(null); }}
          reviews={reviews.filter(r => r.productId === selectedProduct.id)}
          onAddReview={handleAddReview}
          user={user}
          isReviewSystemActive={isReviewSystemActive}
        />
      )}

      <main>
        <Hero lang={lang} />

        <div id="collection" className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-serif font-bold text-neutral-900 mb-4">
              {lang === 'ar' ? 'مجموعات Mora scent المميزة' : 'Mora scent Special Collections'}
            </h3>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-2"></div>
            <p className="text-xs text-neutral-400 mb-8 font-bold">
              {lang === 'ar' ? 'التوصيل خلال 48 ساعة كحد أقصى لجميع المحافظات المصرية' : 'Delivery within 48 hours maximum to all Egyptian governorates'}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.en}
                  onClick={() => setActiveCategory(lang === 'ar' ? cat.ar : cat.en)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    (activeCategory === cat.ar || activeCategory === cat.en)
                      ? "bg-[#1a1a1a] text-white" 
                      : "bg-white text-neutral-600 border border-neutral-200 hover:border-[#D4AF37]"
                  }`}
                >
                  {lang === 'ar' ? cat.ar : cat.en}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                lang={lang}
                onAddToCart={addToCart} 
                onViewDetails={(p) => setSelectedProduct(p)}
                reviews={reviews.filter(r => r.productId === product.id)}
                isReviewSystemActive={isReviewSystemActive}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer lang={lang} onAdminClick={() => setView('admin')} storeSettings={storeSettings} />
      <ChatWidget lang={lang} products={products} storeSettings={storeSettings} />
    </div>
  );
};

export default App;

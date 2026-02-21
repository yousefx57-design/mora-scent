
import React, { useState, useRef } from 'react';
import { TrendingUp, ShoppingBag, Package, Plus, Trash2, ArrowLeft, Image as ImageIcon, Upload, X, ClipboardList, Clock, Truck, Edit3, Minus, Warehouse, Search as SearchIcon, AlertTriangle, Smartphone, CheckCircle2, Banknote, ListTree, Users, Ban, FileText, RotateCcw, CreditCard, Settings, Mail, MessageCircle, Globe, Percent, Shield, Cpu, Lock, ShieldAlert, History, Key, Download, Ticket, MapPin } from 'lucide-react';
import { Order, Product, Category, Customer, StoreSettings, AdminUser, ActivityLog, Role, Coupon, ShippingCompany, ShippingZone } from '../types';

interface AdminDashboardProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  onClose: () => void;
  lang: 'ar' | 'en';
  isReviewSystemActive: boolean;
  setIsReviewSystemActive: React.Dispatch<React.SetStateAction<boolean>>;
  storeSettings: StoreSettings;
  setStoreSettings: React.Dispatch<React.SetStateAction<StoreSettings>>;
  adminUsers: AdminUser[];
  setAdminUsers: React.Dispatch<React.SetStateAction<AdminUser[]>>;
  activityLogs: ActivityLog[];
  setActivityLogs: React.Dispatch<React.SetStateAction<ActivityLog[]>>;
  coupons: Coupon[];
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>;
  shippingCompanies: ShippingCompany[];
  setShippingCompanies: React.Dispatch<React.SetStateAction<ShippingCompany[]>>;
  shippingZones: ShippingZone[];
  setShippingZones: React.Dispatch<React.SetStateAction<ShippingZone[]>>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  orders, setOrders, products, setProducts, categories, setCategories, customers, setCustomers, onClose, lang,
  isReviewSystemActive, setIsReviewSystemActive, storeSettings, setStoreSettings,
  adminUsers, setAdminUsers, activityLogs, setActivityLogs, coupons, setCoupons,
  shippingCompanies, setShippingCompanies, shippingZones, setShippingZones
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'orders' | 'products' | 'stock' | 'categories' | 'settings' | 'customers' | 'security' | 'coupons' | 'shipping'>('stats');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: '', discountType: 'percentage', discountValue: 0, minOrderValue: 0, expiryDate: '', usageLimit: 100, isActive: true
  });
  const [stockSearchQuery, setStockSearchQuery] = useState("");
  const [newCat, setNewCat] = useState({ ar: '', en: '' });
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ 
    category: categories[1]?.ar || '', categoryEn: categories[1]?.en || '',
    image: '', images: [], name: '', nameEn: '', price: 0, description: '', descriptionEn: '', stock: 0
  });
  
  const mainImageRef = useRef<HTMLInputElement>(null);
  const galleryImagesRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const currency = lang === 'ar' ? 'ج.م' : 'EGP';

  const handleAddCategory = () => {
    if (!newCat.ar || !newCat.en) return;
    setCategories(prev => [...prev, newCat]);
    setNewCat({ ar: '', en: '' });
  };

  const removeCategory = (arName: string) => {
    if (arName === 'الكل') return;
    setCategories(prev => prev.filter(c => c.ar !== arName));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (isMain) setNewProduct(prev => ({ ...prev, image: reader.result as string }));
      else setNewProduct(prev => ({ ...prev, images: [...(prev.images || []), reader.result as string] }));
    };
    reader.readAsDataURL(files[0]);
  };

  const handleAddOrUpdateProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      alert(lang === 'ar' ? "أكمل البيانات" : "Complete details");
      return;
    }
    if (editingId !== null) {
      setProducts(prev => prev.map(p => p.id === editingId ? { ...newProduct, id: editingId } as Product : p));
    } else {
      setProducts(prev => [...prev, { ...newProduct, id: Date.now() } as Product]);
    }
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setNewProduct({ category: categories[1]?.ar, categoryEn: categories[1]?.en, image: '', images: [], name: '', nameEn: '', price: 0, description: '', descriptionEn: '', stock: 0 });
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <header className="bg-[#1a1a1a] text-white p-5 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center text-black font-bold uppercase">M</div>
          <h2 className="text-2xl font-serif font-bold text-[#D4AF37]">
            {lang === 'ar' ? 'إدارة Mora scent' : 'Mora scent Admin'}
          </h2>
        </div>
        <button onClick={onClose} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full"><ArrowLeft size={18} /> {lang === 'ar' ? 'المتجر' : 'Store'}</button>
      </header>

      <div className="max-w-7xl mx-auto p-8">
        <div className="flex gap-4 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          <button onClick={() => setActiveTab('stats')} className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'stats' ? 'bg-[#D4AF37] text-black' : 'bg-white text-neutral-500'}`}><TrendingUp size={18} /> {lang === 'ar' ? 'الإحصائيات' : 'Stats'}</button>
          <button onClick={() => setActiveTab('orders')} className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'orders' ? 'bg-[#D4AF37] text-black' : 'bg-white text-neutral-500'}`}><ClipboardList size={18} /> {lang === 'ar' ? 'الطلبات' : 'Orders'}</button>
          <button onClick={() => setActiveTab('products')} className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'products' ? 'bg-[#D4AF37] text-black' : 'bg-white text-neutral-500'}`}><ShoppingBag size={18} /> {lang === 'ar' ? 'المنتجات' : 'Products'}</button>
          <button onClick={() => setActiveTab('stock')} className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'stock' ? 'bg-[#D4AF37] text-black' : 'bg-white text-neutral-500'}`}><Warehouse size={18} /> {lang === 'ar' ? 'المخزن' : 'Stock'}</button>
          <button onClick={() => setActiveTab('categories')} className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'categories' ? 'bg-[#D4AF37] text-black' : 'bg-white text-neutral-500'}`}><ListTree size={18} /> {lang === 'ar' ? 'الفئات' : 'Categories'}</button>
          <button onClick={() => setActiveTab('customers')} className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'customers' ? 'bg-[#D4AF37] text-black' : 'bg-white text-neutral-500'}`}><Users size={18} /> {lang === 'ar' ? 'العملاء' : 'Customers'}</button>
          <button onClick={() => setActiveTab('security')} className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'security' ? 'bg-[#D4AF37] text-black' : 'bg-white text-neutral-500'}`}><Lock size={18} /> {lang === 'ar' ? 'الأمان' : 'Security'}</button>
          <button onClick={() => setActiveTab('shipping')} className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'shipping' ? 'bg-[#D4AF37] text-black' : 'bg-white text-neutral-500'}`}><Truck size={18} /> {lang === 'ar' ? 'الشحن' : 'Shipping'}</button>
          <button onClick={() => setActiveTab('coupons')} className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'coupons' ? 'bg-[#D4AF37] text-black' : 'bg-white text-neutral-500'}`}><Ticket size={18} /> {lang === 'ar' ? 'الكوبونات' : 'Coupons'}</button>
          <button onClick={() => setActiveTab('settings')} className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'settings' ? 'bg-[#D4AF37] text-black' : 'bg-white text-neutral-500'}`}><Settings size={18} /> {lang === 'ar' ? 'الإعدادات' : 'Settings'}</button>
        </div>

        {activeTab === 'shipping' && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Shipping Companies */}
              <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Truck className="text-[#D4AF37]" />
                  {lang === 'ar' ? 'شركات الشحن' : 'Shipping Companies'}
                </h3>
                <div className="space-y-4">
                  {shippingCompanies.map(company => (
                    <div key={company.id} className="flex justify-between items-center p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                      <div>
                        <div className="font-bold">{company.name}</div>
                        <div className="text-xs text-neutral-400">{company.contact}</div>
                      </div>
                      <button 
                        onClick={() => setShippingCompanies(prev => prev.map(c => c.id === company.id ? { ...c, isActive: !c.isActive } : c))}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold ${company.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                      >
                        {company.isActive ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'معطل' : 'Inactive')}
                      </button>
                    </div>
                  ))}
                  <button className="w-full py-3 border-2 border-dashed border-neutral-200 rounded-2xl text-neutral-400 font-bold text-sm hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all flex items-center justify-center gap-2">
                    <Plus size={18} /> {lang === 'ar' ? 'إضافة شركة شحن' : 'Add Company'}
                  </button>
                </div>
              </div>

              {/* Shipping Zones / Cities */}
              <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <MapPin className="text-[#D4AF37]" />
                  {lang === 'ar' ? 'المناطق وأسعار الشحن' : 'Zones & Rates'}
                </h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {shippingZones.map(zone => (
                    <div key={zone.id} className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-sm">{zone.city}</div>
                        <div className="text-[10px] text-neutral-400">{zone.deliveryTime}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <input 
                            type="number" 
                            className="w-20 p-1 text-xs border rounded text-center outline-none focus:border-[#D4AF37]"
                            value={zone.rate}
                            onChange={(e) => setShippingZones(prev => prev.map(z => z.id === zone.id ? { ...z, rate: Number(e.target.value) } : z))}
                          />
                          <div className="text-[10px] font-bold text-neutral-400 mt-1">{currency}</div>
                        </div>
                        <button 
                          onClick={() => setShippingZones(prev => prev.map(z => z.id === zone.id ? { ...z, isActive: !z.isActive } : z))}
                          className={`w-10 h-5 rounded-full relative transition-all ${zone.isActive ? 'bg-[#D4AF37]' : 'bg-neutral-300'}`}
                        >
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${zone.isActive ? (lang === 'ar' ? 'left-0.5' : 'right-0.5') : (lang === 'ar' ? 'right-0.5' : 'left-0.5')}`}></div>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'coupons' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
            <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm h-fit">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Ticket className="text-[#D4AF37]" />
                {lang === 'ar' ? 'إنشاء كوبون جديد' : 'Create New Coupon'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-neutral-400 block mb-1">{lang === 'ar' ? 'كود الكوبون' : 'Coupon Code'}</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-neutral-50 border rounded-xl outline-none focus:border-[#D4AF37] font-mono uppercase"
                    value={newCoupon.code}
                    onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                    placeholder="E.G. SUMMER20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-400 block mb-1">{lang === 'ar' ? 'نوع الخصم' : 'Discount Type'}</label>
                    <select 
                      className="w-full p-3 bg-neutral-50 border rounded-xl outline-none focus:border-[#D4AF37]"
                      value={newCoupon.discountType}
                      onChange={e => setNewCoupon({...newCoupon, discountType: e.target.value as 'percentage' | 'fixed'})}
                    >
                      <option value="percentage">{lang === 'ar' ? 'نسبة مئوية' : 'Percentage'}</option>
                      <option value="fixed">{lang === 'ar' ? 'مبلغ ثابت' : 'Fixed Amount'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-400 block mb-1">{lang === 'ar' ? 'قيمة الخصم' : 'Value'}</label>
                    <input 
                      type="number" 
                      className="w-full p-3 bg-neutral-50 border rounded-xl outline-none focus:border-[#D4AF37]"
                      value={newCoupon.discountValue}
                      onChange={e => setNewCoupon({...newCoupon, discountValue: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-400 block mb-1">{lang === 'ar' ? 'أقل قيمة للطلب' : 'Min Order Value'}</label>
                  <input 
                    type="number" 
                    className="w-full p-3 bg-neutral-50 border rounded-xl outline-none focus:border-[#D4AF37]"
                    value={newCoupon.minOrderValue}
                    onChange={e => setNewCoupon({...newCoupon, minOrderValue: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-400 block mb-1">{lang === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}</label>
                  <input 
                    type="date" 
                    className="w-full p-3 bg-neutral-50 border rounded-xl outline-none focus:border-[#D4AF37]"
                    value={newCoupon.expiryDate}
                    onChange={e => setNewCoupon({...newCoupon, expiryDate: e.target.value})}
                  />
                </div>
                <button 
                  onClick={() => {
                    if (!newCoupon.code || !newCoupon.discountValue) return;
                    setCoupons(prev => [...prev, { ...newCoupon, id: Date.now().toString(), usageCount: 0 } as Coupon]);
                    setNewCoupon({ code: '', discountType: 'percentage', discountValue: 0, minOrderValue: 0, expiryDate: '', usageLimit: 100, isActive: true });
                  }}
                  className="w-full py-4 bg-[#1a1a1a] text-[#D4AF37] rounded-xl font-bold hover:bg-black transition-all"
                >
                  {lang === 'ar' ? 'حفظ الكوبون' : 'Save Coupon'}
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xl font-bold mb-4">{lang === 'ar' ? 'الكوبونات النشطة' : 'Active Coupons'}</h3>
              <div className="grid grid-cols-1 gap-4">
                {coupons.map(coupon => (
                  <div key={coupon.id} className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center text-[#D4AF37]">
                        <Ticket size={24} />
                      </div>
                      <div>
                        <div className="font-mono font-bold text-lg">{coupon.code}</div>
                        <div className="text-xs text-neutral-400">
                          {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `${coupon.discountValue} ${currency}`} {lang === 'ar' ? 'خصم' : 'Discount'}
                          {' • '}
                          {lang === 'ar' ? 'أقل طلب:' : 'Min:'} {coupon.minOrderValue} {currency}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-xs font-bold text-neutral-400 uppercase">{lang === 'ar' ? 'الاستخدام' : 'Usage'}</div>
                        <div className="text-sm font-bold">{coupon.usageCount} / {coupon.usageLimit}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-neutral-400 uppercase">{lang === 'ar' ? 'ينتهي في' : 'Expires'}</div>
                        <div className="text-sm font-bold text-red-500">{coupon.expiryDate}</div>
                      </div>
                      <button 
                        onClick={() => setCoupons(prev => prev.filter(c => c.id !== coupon.id))}
                        className="p-3 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                {coupons.length === 0 && (
                  <div className="bg-white p-12 rounded-3xl border border-dashed border-neutral-200 text-center text-neutral-400">
                    {lang === 'ar' ? 'لا توجد كوبونات حالياً' : 'No coupons available'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Admin Accounts */}
              <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <ShieldAlert className="text-[#D4AF37]" />
                  {lang === 'ar' ? 'إدارة حسابات المسؤولين' : 'Admin Accounts'}
                </h3>
                <div className="space-y-4">
                  {adminUsers.map(admin => (
                    <div key={admin.id} className="flex justify-between items-center p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                      <div>
                        <div className="font-bold text-sm">{admin.name}</div>
                        <div className="text-[10px] text-neutral-400">{admin.email}</div>
                        <div className="mt-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            admin.role === 'super_admin' ? 'bg-purple-100 text-purple-600' :
                            admin.role === 'admin' ? 'bg-blue-100 text-blue-600' : 'bg-neutral-200 text-neutral-600'
                          }`}>
                            {admin.role}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-neutral-400 hover:text-[#D4AF37]"><Key size={16} /></button>
                        {admin.role !== 'super_admin' && (
                          <button 
                            onClick={() => setAdminUsers(prev => prev.filter(a => a.id !== admin.id))}
                            className="p-2 text-neutral-400 hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button 
                    className="w-full py-3 border-2 border-dashed border-neutral-200 rounded-2xl text-neutral-400 font-bold text-sm hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={18} /> {lang === 'ar' ? 'إضافة مسؤول جديد' : 'Add New Admin'}
                  </button>
                </div>
              </div>

              {/* Activity Logs */}
              <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <History className="text-[#D4AF37]" />
                  {lang === 'ar' ? 'سجل النشاط' : 'Activity Logs'}
                </h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {activityLogs.length === 0 ? (
                    <div className="text-center py-10 text-neutral-400 text-sm italic">
                      {lang === 'ar' ? 'لا توجد سجلات حالياً' : 'No logs available'}
                    </div>
                  ) : (
                    activityLogs.map(log => (
                      <div key={log.id} className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-xs">
                        <div className="flex justify-between mb-1">
                          <span className="font-bold text-neutral-700">{log.userName}</span>
                          <span className="text-neutral-400">{log.timestamp}</span>
                        </div>
                        <div className="text-neutral-600">{log.action}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Backup & Security Settings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Download className="text-[#D4AF37]" />
                  {lang === 'ar' ? 'نسخ احتياطي للبيانات' : 'Data Backup'}
                </h3>
                <p className="text-sm text-neutral-500 mb-6">
                  {lang === 'ar' ? 'قم بتصدير جميع بيانات المتجر (المنتجات، الطلبات، العملاء) في ملف واحد للنسخ الاحتياطي.' : 'Export all store data (products, orders, customers) in a single file for backup.'}
                </p>
                <button 
                  onClick={() => {
                    const data = { products, orders, customers, categories, storeSettings, adminUsers };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `morascent_backup_${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                  }}
                  className="bg-[#1a1a1a] text-[#D4AF37] px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-black transition-all shadow-lg"
                >
                  <Download size={20} />
                  {lang === 'ar' ? 'تصدير البيانات الآن' : 'Export Data Now'}
                </button>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Key className="text-[#D4AF37]" />
                  {lang === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
                </h3>
                <div className="space-y-4">
                  <input type="password" placeholder={lang === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'} className="w-full p-4 bg-neutral-50 rounded-2xl border border-neutral-100 outline-none" />
                  <input type="password" placeholder={lang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'} className="w-full p-4 bg-neutral-50 rounded-2xl border border-neutral-100 outline-none" />
                  <button className="w-full py-4 bg-[#D4AF37] text-black rounded-2xl font-bold hover:bg-black hover:text-[#D4AF37] transition-all">
                    {lang === 'ar' ? 'تحديث كلمة المرور' : 'Update Password'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <Settings className="text-[#D4AF37]" />
                {lang === 'ar' ? 'إعدادات المتجر العامة' : 'General Store Settings'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-400 flex items-center gap-2">
                    <ShoppingBag size={16} /> {lang === 'ar' ? 'اسم المتجر' : 'Store Name'}
                  </label>
                  <input 
                    type="text" 
                    className="w-full p-4 bg-neutral-50 rounded-2xl border border-neutral-100 outline-none focus:border-[#D4AF37]"
                    value={storeSettings.name}
                    onChange={e => setStoreSettings({...storeSettings, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-400 flex items-center gap-2">
                    <ImageIcon size={16} /> {lang === 'ar' ? 'الشعار (نص أو رابط)' : 'Logo (Text or URL)'}
                  </label>
                  <input 
                    type="text" 
                    className="w-full p-4 bg-neutral-50 rounded-2xl border border-neutral-100 outline-none focus:border-[#D4AF37]"
                    value={storeSettings.logo}
                    onChange={e => setStoreSettings({...storeSettings, logo: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-400 flex items-center gap-2">
                    <Mail size={16} /> {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  </label>
                  <input 
                    type="email" 
                    className="w-full p-4 bg-neutral-50 rounded-2xl border border-neutral-100 outline-none focus:border-[#D4AF37]"
                    value={storeSettings.email}
                    onChange={e => setStoreSettings({...storeSettings, email: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-400 flex items-center gap-2">
                    <MessageCircle size={16} /> {lang === 'ar' ? 'رقم الواتساب' : 'WhatsApp Number'}
                  </label>
                  <input 
                    type="text" 
                    className="w-full p-4 bg-neutral-50 rounded-2xl border border-neutral-100 outline-none focus:border-[#D4AF37]"
                    value={storeSettings.whatsapp}
                    onChange={e => setStoreSettings({...storeSettings, whatsapp: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-400 flex items-center gap-2">
                    <Banknote size={16} /> {lang === 'ar' ? 'العملة' : 'Currency'}
                  </label>
                  <input 
                    type="text" 
                    className="w-full p-4 bg-neutral-50 rounded-2xl border border-neutral-100 outline-none focus:border-[#D4AF37]"
                    value={storeSettings.currency}
                    onChange={e => setStoreSettings({...storeSettings, currency: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-400 flex items-center gap-2">
                    <Globe size={16} /> {lang === 'ar' ? 'اللغة الافتراضية' : 'Default Language'}
                  </label>
                  <select 
                    className="w-full p-4 bg-neutral-50 rounded-2xl border border-neutral-100 outline-none focus:border-[#D4AF37]"
                    value={storeSettings.defaultLanguage}
                    onChange={e => setStoreSettings({...storeSettings, defaultLanguage: e.target.value as 'ar' | 'en'})}
                  >
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-400 flex items-center gap-2">
                    <Percent size={16} /> {lang === 'ar' ? 'نسبة الضريبة (%)' : 'Tax Percentage (%)'}
                  </label>
                  <input 
                    type="number" 
                    className="w-full p-4 bg-neutral-50 rounded-2xl border border-neutral-100 outline-none focus:border-[#D4AF37]"
                    value={storeSettings.taxPercentage}
                    onChange={e => setStoreSettings({...storeSettings, taxPercentage: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <label className="text-sm font-bold text-neutral-400 flex items-center gap-2">
                  <Shield size={16} /> {lang === 'ar' ? 'سياسة المتجر' : 'Store Policy'}
                </label>
                <textarea 
                  className="w-full p-4 bg-neutral-50 rounded-2xl border border-neutral-100 outline-none focus:border-[#D4AF37] h-32 resize-none"
                  value={storeSettings.policy}
                  onChange={e => setStoreSettings({...storeSettings, policy: e.target.value})}
                />
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Cpu className="text-[#D4AF37]" />
                {lang === 'ar' ? 'تطوير المتجر بالذكاء الاصطناعي' : 'AI Store Development'}
              </h3>
              <div className="flex items-center justify-between p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
                <div>
                  <div className="font-bold text-lg">{lang === 'ar' ? 'تفعيل التطوير الذكي' : 'Enable AI Development'}</div>
                  <div className="text-sm text-neutral-400">{lang === 'ar' ? 'السماح للذكاء الاصطناعي بتحسين الكود وتطوير ميزات جديدة تلقائياً' : 'Allow AI to optimize code and develop new features automatically'}</div>
                </div>
                <button 
                  onClick={() => setStoreSettings({...storeSettings, aiDevelopmentEnabled: !storeSettings.aiDevelopmentEnabled})}
                  className={`w-16 h-8 rounded-full relative transition-all duration-300 ${storeSettings.aiDevelopmentEnabled ? 'bg-[#D4AF37]' : 'bg-neutral-300'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${storeSettings.aiDevelopmentEnabled ? (lang === 'ar' ? 'left-1' : 'right-1') : (lang === 'ar' ? 'right-1' : 'left-1')}`}></div>
                </button>
              </div>
              
              {storeSettings.aiDevelopmentEnabled && (
                <div className="mt-6 p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                    <Cpu size={20} />
                  </div>
                  <div className="text-sm text-emerald-800 font-bold">
                    {lang === 'ar' ? 'الذكاء الاصطناعي متصل وجاهز لتلقي أوامر التطوير' : 'AI is connected and ready to receive development commands'}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
              <h3 className="text-xl font-bold mb-6">{lang === 'ar' ? 'إعدادات إضافية' : 'Additional Settings'}</h3>
              <div className="flex items-center justify-between p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
                <div>
                  <div className="font-bold text-lg">{lang === 'ar' ? 'نظام تقييمات العملاء' : 'Customer Review System'}</div>
                  <div className="text-sm text-neutral-400">{lang === 'ar' ? 'تفعيل أو تعطيل قدرة العملاء على ترك تقييمات للمنتجات' : 'Enable or disable customers ability to leave product reviews'}</div>
                </div>
                <button 
                  onClick={() => setIsReviewSystemActive(!isReviewSystemActive)}
                  className={`w-16 h-8 rounded-full relative transition-all duration-300 ${isReviewSystemActive ? 'bg-[#D4AF37]' : 'bg-neutral-300'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${isReviewSystemActive ? (lang === 'ar' ? 'left-1' : 'right-1') : (lang === 'ar' ? 'right-1' : 'left-1')}`}></div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm flex flex-col items-center text-center group hover:shadow-xl transition-all duration-500">
                <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform">
                  <ClipboardList size={32} />
                </div>
                <div className="text-neutral-400 text-sm font-bold uppercase tracking-wider mb-1">{lang === 'ar' ? 'إجمالي الطلبات' : 'Total Orders'}</div>
                <div className="text-4xl font-serif font-bold text-neutral-900">{orders.length}</div>
              </div>
              
              <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm flex flex-col items-center text-center group hover:shadow-xl transition-all duration-500">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
                  <Banknote size={32} />
                </div>
                <div className="text-neutral-400 text-sm font-bold uppercase tracking-wider mb-1">{lang === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}</div>
                <div className="text-4xl font-serif font-bold text-neutral-900">
                  {orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()} <span className="text-sm font-sans text-neutral-400">{currency}</span>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm flex flex-col items-center text-center group hover:shadow-xl transition-all duration-500">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                  <ShoppingBag size={32} />
                </div>
                <div className="text-neutral-400 text-sm font-bold uppercase tracking-wider mb-1">{lang === 'ar' ? 'عدد المنتجات' : 'Total Products'}</div>
                <div className="text-4xl font-serif font-bold text-neutral-900">{products.length}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm">
                <h4 className="font-bold text-xl mb-6 flex items-center gap-2">
                  <Clock className="text-[#D4AF37]" size={20} />
                  {lang === 'ar' ? 'أحدث الطلبات' : 'Recent Orders'}
                </h4>
                <div className="space-y-4">
                  {orders.slice(0, 5).map(o => (
                    <div key={o.id} className="flex justify-between items-center p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                      <div>
                        <div className="font-bold text-sm">{o.customer.name}</div>
                        <div className="text-[10px] text-neutral-400">{o.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#D4AF37]">{o.total} {currency}</div>
                        <div className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full inline-block font-bold">{o.status}</div>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <div className="text-center py-10 text-neutral-400 text-sm">
                      {lang === 'ar' ? 'لا توجد طلبات بعد' : 'No orders yet'}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm">
                <h4 className="font-bold text-xl mb-6 flex items-center gap-2">
                  <AlertTriangle className="text-red-500" size={20} />
                  {lang === 'ar' ? 'تنبيهات المخزون' : 'Inventory Alerts'}
                </h4>
                <div className="space-y-4">
                  {products.filter(p => p.stock <= 5).slice(0, 5).map(p => (
                    <div key={p.id} className="flex justify-between items-center p-4 bg-red-50 rounded-2xl border border-red-100">
                      <div className="flex items-center gap-3">
                        <img src={p.image} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <div className="font-bold text-sm">{lang === 'ar' ? p.name : p.nameEn}</div>
                          <div className="text-[10px] text-red-400">{lang === 'ar' ? 'المخزون منخفض جداً' : 'Stock is very low'}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-red-600">{p.stock} {lang === 'ar' ? 'قطعة' : 'pcs'}</div>
                      </div>
                    </div>
                  ))}
                  {products.filter(p => p.stock <= 5).length === 0 && (
                    <div className="text-center py-10 text-neutral-400 text-sm">
                      {lang === 'ar' ? 'المخزون سليم' : 'Inventory is healthy'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm animate-fade-in-up">
            <h3 className="text-xl font-bold mb-6">{lang === 'ar' ? 'إدارة فئات المنتجات' : 'Manage Categories'}</h3>
            <div className="flex gap-4 mb-8">
              <input type="text" placeholder="الاسم بالعربي" className="p-3 border rounded-xl flex-1 outline-none" value={newCat.ar} onChange={e => setNewCat({...newCat, ar: e.target.value})} />
              <input type="text" placeholder="Name in English" className="p-3 border rounded-xl flex-1 outline-none" value={newCat.en} onChange={e => setNewCat({...newCat, en: e.target.value})} />
              <button onClick={handleAddCategory} className="bg-[#D4AF37] text-black px-8 rounded-xl font-bold hover:bg-black hover:text-[#D4AF37] transition-all">إضافة فئة</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map(c => (
                <div key={c.en} className="p-4 bg-neutral-50 rounded-2xl flex justify-between items-center border border-neutral-100">
                  <span className="font-bold">{lang === 'ar' ? c.ar : c.en}</span>
                  {c.ar !== 'الكل' && (
                    <button onClick={() => removeCategory(c.ar)} className="text-red-400 hover:text-red-600"><X size={18} /></button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden animate-fade-in-up">
            <div className="p-8 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">{lang === 'ar' ? 'قائمة العملاء' : 'Customer List'}</h3>
              <div className="flex gap-4">
                <div className="bg-neutral-50 px-4 py-2 rounded-xl border border-neutral-100 flex items-center gap-2">
                  <CreditCard size={18} className="text-[#D4AF37]" />
                  <span className="text-xs font-bold">{lang === 'ar' ? 'إجمالي المدفوعات' : 'Total Payments'}</span>
                </div>
                <div className="bg-neutral-50 px-4 py-2 rounded-xl border border-neutral-100 flex items-center gap-2">
                  <RotateCcw size={18} className="text-red-500" />
                  <span className="text-xs font-bold">{lang === 'ar' ? 'المرتجعات' : 'Returns'}</span>
                </div>
              </div>
            </div>
            <table className="w-full text-right">
              <thead className="bg-neutral-50 text-neutral-400 text-xs font-bold uppercase">
                <tr>
                  <th className="px-6 py-4">{lang === 'ar' ? 'العميل' : 'Customer'}</th>
                  <th className="px-6 py-4">{lang === 'ar' ? 'بيانات التواصل' : 'Contact'}</th>
                  <th className="px-6 py-4">{lang === 'ar' ? 'الطلبات' : 'Orders'}</th>
                  <th className="px-6 py-4">{lang === 'ar' ? 'إجمالي الإنفاق' : 'Total Spent'}</th>
                  <th className="px-6 py-4">{lang === 'ar' ? 'ملاحظات' : 'Notes'}</th>
                  <th className="px-6 py-4">{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {customers.map(c => (
                  <tr key={c.id} className={`hover:bg-neutral-50 ${c.isBlocked ? 'opacity-50 grayscale' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400 font-bold">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold">{c.name}</div>
                          <div className="text-[10px] text-neutral-400">ID: {c.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold">{c.phone}</div>
                      <div className="text-[10px] text-neutral-400">{c.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 font-bold">{c.orderCount}</td>
                    <td className="px-6 py-4 font-bold text-[#D4AF37]">{c.totalSpent} {currency}</td>
                    <td className="px-6 py-4">
                      <input 
                        type="text" 
                        placeholder="..." 
                        className="text-xs bg-transparent border-b border-transparent focus:border-[#D4AF37] outline-none w-full"
                        value={c.notes}
                        onChange={(e) => {
                          const newNotes = e.target.value;
                          setCustomers(prev => prev.map(cust => cust.id === c.id ? { ...cust, notes: newNotes } : cust));
                        }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setCustomers(prev => prev.map(cust => cust.id === c.id ? { ...cust, isBlocked: !cust.isBlocked } : cust));
                          }}
                          className={`p-2 rounded-lg transition-all ${c.isBlocked ? 'bg-red-500 text-white' : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white'}`}
                          title={c.isBlocked ? (lang === 'ar' ? 'إلغاء الحظر' : 'Unblock') : (lang === 'ar' ? 'حظر' : 'Block')}
                        >
                          <Ban size={16} />
                        </button>
                        <button className="p-2 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all" title={lang === 'ar' ? 'الفواتير' : 'Invoices'}>
                          <FileText size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-neutral-400">
                      {lang === 'ar' ? 'لا يوجد عملاء بعد' : 'No customers yet'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
             <table className="w-full text-right">
                <thead className="bg-neutral-50 text-neutral-400 text-xs font-bold uppercase">
                  <tr>
                    <th className="px-6 py-4">رقم الطلب</th>
                    <th className="px-6 py-4">العميل</th>
                    <th className="px-6 py-4">المجموع</th>
                    <th className="px-6 py-4">الحالة</th>
                    <th className="px-6 py-4">تغيير الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-neutral-50 cursor-pointer group" onClick={() => setSelectedOrder(o)}>
                      <td className="px-6 py-4 font-mono font-bold text-xs group-hover:text-[#D4AF37]">{o.id}</td>
                      <td className="px-6 py-4 font-bold">{o.customer.name}</td>
                      <td className="px-6 py-4 font-bold text-[#D4AF37]">{o.total} {currency}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          o.status === 'جديد' ? 'bg-blue-100 text-blue-600' :
                          o.status === 'قيد التجهيز' ? 'bg-yellow-100 text-yellow-600' :
                          o.status === 'تم الشحن' ? 'bg-indigo-100 text-indigo-600' :
                          o.status === 'مكتمل' ? 'bg-green-100 text-green-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <select 
                          className="text-xs border rounded-lg p-1 outline-none focus:border-[#D4AF37]"
                          value={o.status}
                          onChange={(e) => {
                            const newStatus = e.target.value as Order['status'];
                            setOrders(prev => prev.map(order => order.id === o.id ? { ...order, status: newStatus } : order));
                          }}
                        >
                          <option value="جديد">جديد</option>
                          <option value="قيد التجهيز">قيد التجهيز</option>
                          <option value="تم الشحن">تم الشحن</option>
                          <option value="مكتمل">مكتمل</option>
                          <option value="ملغي">ملغي</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in-up">
              <div className="p-6 bg-[#1a1a1a] text-white flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#D4AF37]">{lang === 'ar' ? 'تفاصيل الطلب' : 'Order Details'}</h3>
                  <p className="text-[10px] text-neutral-400 font-mono">{selectedOrder.id}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/10 rounded-full transition-all">
                  <X size={24} />
                </button>
              </div>
              <div className="p-8 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-neutral-100">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-400 uppercase mb-2">{lang === 'ar' ? 'بيانات العميل' : 'Customer Info'}</h4>
                    <div className="font-bold text-lg">{selectedOrder.customer.name}</div>
                    <div className="text-sm text-neutral-500">{selectedOrder.customer.phone}</div>
                    <div className="text-sm text-neutral-500">{selectedOrder.customer.city}, {selectedOrder.customer.region}</div>
                    
                    {selectedOrder.status === 'تم الشحن' && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <h5 className="text-[10px] font-bold text-blue-600 uppercase mb-1">{lang === 'ar' ? 'بيانات التتبع' : 'Tracking Info'}</h5>
                        <div className="text-xs font-bold text-blue-800">{selectedOrder.shippingCompany} - {selectedOrder.trackingNumber}</div>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <h4 className="text-xs font-bold text-neutral-400 uppercase mb-2">{lang === 'ar' ? 'ملخص الدفع' : 'Payment Summary'}</h4>
                    <div className="text-sm font-bold">{selectedOrder.customer.paymentMethod === 'cod' ? (lang === 'ar' ? 'عند الاستلام' : 'Cash on Delivery') : 'InstaPay'}</div>
                    <div className="text-2xl font-bold text-[#D4AF37] mt-2">{selectedOrder.total} {currency}</div>
                    {selectedOrder.shippingCost && (
                      <div className="text-xs text-neutral-400 mt-1">
                        {lang === 'ar' ? 'شامل الشحن:' : 'Incl. Shipping:'} {selectedOrder.shippingCost} {currency}
                      </div>
                    )}
                  </div>
                </div>

                {selectedOrder.status === 'قيد التجهيز' && (
                  <div className="mb-8 p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
                    <h4 className="text-xs font-bold text-neutral-400 uppercase mb-4">{lang === 'ar' ? 'تجهيز الشحنة' : 'Prepare Shipment'}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <select 
                        className="p-3 border rounded-xl outline-none focus:border-[#D4AF37] bg-white text-sm"
                        onChange={(e) => {
                          const company = e.target.value;
                          setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, shippingCompany: company } : o));
                        }}
                      >
                        <option value="">{lang === 'ar' ? 'اختر شركة الشحن' : 'Select Company'}</option>
                        {shippingCompanies.filter(c => c.isActive).map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                      <input 
                        type="text" 
                        placeholder={lang === 'ar' ? 'رقم التتبع' : 'Tracking Number'}
                        className="p-3 border rounded-xl outline-none focus:border-[#D4AF37] text-sm"
                        onChange={(e) => {
                          const track = e.target.value;
                          setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, trackingNumber: track } : o));
                        }}
                      />
                    </div>
                  </div>
                )}

                <h4 className="text-xs font-bold text-neutral-400 uppercase mb-4">{lang === 'ar' ? 'المنتجات' : 'Products'}</h4>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                      <div className="flex items-center gap-4">
                        <img src={item.image} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <div className="font-bold text-sm">{lang === 'ar' ? item.name : item.nameEn}</div>
                          <div className="text-[10px] text-neutral-400">{item.price} {currency} × {item.quantity}</div>
                        </div>
                      </div>
                      <div className="font-bold text-neutral-900">
                        {item.price * item.quantity} {currency}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedOrder.customer.notes && (
                  <div className="mt-8 p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                    <h4 className="text-[10px] font-bold text-yellow-600 uppercase mb-1">{lang === 'ar' ? 'ملاحظات العميل' : 'Customer Notes'}</h4>
                    <p className="text-sm text-yellow-800 italic">{selectedOrder.customer.notes}</p>
                  </div>
                )}
              </div>
              <div className="p-6 bg-neutral-50 border-t border-neutral-100 flex justify-end gap-3">
                <button 
                  onClick={() => window.print()}
                  className="px-6 py-3 bg-white border border-neutral-200 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-neutral-100 transition-all"
                >
                  <FileText size={18} /> {lang === 'ar' ? 'طباعة الفاتورة' : 'Print Invoice'}
                </button>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-3 bg-[#1a1a1a] text-white rounded-xl font-bold text-sm hover:bg-black transition-all"
                >
                  {lang === 'ar' ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm h-fit sticky top-24">
              <h4 className="font-bold text-xl mb-6 flex items-center gap-2">
                {editingId ? <Edit3 className="text-[#D4AF37]" /> : <Plus className="text-[#D4AF37]" />}
                {editingId ? (lang === 'ar' ? 'تعديل منتج' : 'Edit Product') : (lang === 'ar' ? 'إضافة منتج جديد' : 'Add New Product')}
              </h4>
              
              <div className="space-y-5">
                <div 
                  className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 rounded-2xl p-4 hover:border-[#D4AF37] transition-all cursor-pointer bg-neutral-50 group"
                  onClick={() => mainImageRef.current?.click()}
                >
                  {newProduct.image ? (
                    <div className="relative w-full">
                      <img src={newProduct.image} className="w-full h-40 object-cover rounded-xl" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                        <Upload className="text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <ImageIcon className="mx-auto text-neutral-300 mb-2" size={40} />
                      <div className="text-sm font-bold text-neutral-400">{lang === 'ar' ? 'اضغط لرفع الصورة الأساسية' : 'Click to upload main image'}</div>
                    </div>
                  )}
                  <input type="file" ref={mainImageRef} className="hidden" onChange={(e) => handleFileUpload(e, true)} accept="image/*" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-400 px-1">{lang === 'ar' ? 'الفئة' : 'Category'}</label>
                    <select className="w-full p-3 border rounded-xl bg-white outline-none focus:border-[#D4AF37]" value={newProduct.category} onChange={e => {
                      const c = categories.find(cat => cat.ar === e.target.value);
                      setNewProduct({...newProduct, category: c?.ar, categoryEn: c?.en});
                    }}>
                      {categories.map(c => <option key={c.en} value={c.ar}>{lang === 'ar' ? c.ar : c.en}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-400 px-1">{lang === 'ar' ? 'المخزون' : 'Stock'}</label>
                    <input type="number" placeholder="0" className="w-full p-3 border rounded-xl outline-none focus:border-[#D4AF37]" value={newProduct.stock || ''} onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 px-1">{lang === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'}</label>
                  <input type="text" placeholder="مثلاً: عطر مورا الملكي" className="w-full p-3 border rounded-xl outline-none focus:border-[#D4AF37]" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 px-1">{lang === 'ar' ? 'الاسم (إنجليزي)' : 'Name (English)'}</label>
                  <input type="text" placeholder="e.g. Mora Royal Scent" className="w-full p-3 border rounded-xl outline-none focus:border-[#D4AF37]" value={newProduct.nameEn} onChange={e => setNewProduct({...newProduct, nameEn: e.target.value})} />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 px-1">{lang === 'ar' ? 'السعر' : 'Price'}</label>
                  <div className="relative">
                    <input type="number" placeholder="0.00" className="w-full p-3 border rounded-xl outline-none focus:border-[#D4AF37]" value={newProduct.price || ''} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} />
                    <span className="absolute left-3 top-3 text-neutral-400 font-bold text-sm">{currency}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-400 px-1">{lang === 'ar' ? 'الوصف' : 'Description'}</label>
                  <textarea placeholder="..." className="w-full p-3 border rounded-xl h-24 outline-none focus:border-[#D4AF37] resize-none" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                </div>

                <div className="flex gap-3 pt-2">
                  {editingId && (
                    <button onClick={resetForm} className="flex-1 bg-neutral-100 text-neutral-600 py-4 rounded-xl font-bold hover:bg-neutral-200 transition-all">
                      {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                  )}
                  <button onClick={handleAddOrUpdateProduct} className="flex-[2] bg-[#1a1a1a] text-[#D4AF37] py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-black/10">
                    {editingId ? (lang === 'ar' ? 'تحديث المنتج' : 'Update Product') : (lang === 'ar' ? 'إضافة المنتج' : 'Add Product')}
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-xl">{lang === 'ar' ? 'قائمة المنتجات' : 'Product List'} ({products.length})</h4>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {products.map(p => (
                  <div key={p.id} className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border border-neutral-50 hover:border-[#D4AF37]/30 transition-all group">
                    <div className="flex gap-4 items-center">
                      <div className="relative">
                        <img src={p.image} className="w-20 h-20 rounded-xl object-cover border border-neutral-100" />
                        {p.stock <= 5 && (
                          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                            <AlertTriangle size={10} /> {lang === 'ar' ? 'منخفض' : 'Low'}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-lg group-hover:text-[#D4AF37] transition-colors">{lang === 'ar' ? p.name : p.nameEn}</div>
                        <div className="text-xs text-neutral-400 mb-2">{lang === 'ar' ? p.category : p.categoryEn}</div>
                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className="font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-lg border border-[#D4AF37]/20">
                            {p.price} {currency}
                          </span>
                          <span className="flex items-center gap-1 text-neutral-500 bg-neutral-50 px-3 py-1 rounded-lg border border-neutral-100">
                            <Warehouse size={14} />
                            {p.stock} {lang === 'ar' ? 'قطعة' : 'pcs'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { 
                          setEditingId(p.id); 
                          setNewProduct(p);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }} 
                        className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        title={lang === 'ar' ? 'تعديل' : 'Edit'}
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => {
                          if(confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) {
                            setProducts(products.filter(x => x.id !== p.id));
                          }
                        }} 
                        className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        title={lang === 'ar' ? 'حذف' : 'Delete'}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

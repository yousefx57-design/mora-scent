
import React, { useState, useRef } from 'react';
import { TrendingUp, ShoppingBag, Package, Plus, Trash2, ArrowLeft, Image as ImageIcon, Upload, X, ClipboardList, Clock, Truck, Edit3, Minus, Warehouse, Search as SearchIcon, AlertTriangle, Smartphone, CheckCircle2, Banknote, ListTree } from 'lucide-react';
import { Order, Product, Category } from '../types';

interface AdminDashboardProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  onClose: () => void;
  lang: 'ar' | 'en';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, setOrders, products, setProducts, categories, setCategories, onClose, lang }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'orders' | 'products' | 'stock' | 'categories'>('stats');
  const [editingId, setEditingId] = useState<number | null>(null);
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
        </div>

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
                    <tr key={o.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 font-mono font-bold text-xs">{o.id}</td>
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
                      <td className="px-6 py-4">
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

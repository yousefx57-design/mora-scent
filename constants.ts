
import { Product, Category } from './types';

export const COUNTRIES = ["مصر"];

export const EGYPT_CITIES = [
  "القاهرة", "الجيزة", "الإسكندرية", "القليوبية", "الدقهلية", 
  "الغربية", "المنوفية", "الشرقية", "البحيرة", "كفر الشيخ", 
  "دمياط", "بورسعيد", "الإسماعيلية", "السويس", "الفيوم", 
  "بني سويف", "المنيا", "أسيوط", "سوهاج", "قنا", 
  "الأقصر", "أسوان", "البحر الأحمر", "الوادي الجديد", "مطروح", 
  "شمال سيناء", "جنوب سيناء"
];

export const INITIAL_CATEGORIES: Category[] = [
  { ar: "الكل", en: "All" },
  { ar: "عطور شرقية", en: "Oriental" },
  { ar: "عطور فرنسية", en: "French" },
  { ar: "عطور نيش", en: "Niche" },
  { ar: "زيوت عطرية", en: "Essential Oils" }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 8,
    name: "برفان نيشاني هاشيفات",
    nameEn: "Nishane Hacivat",
    category: "عطور نيش",
    categoryEn: "Niche",
    price: 1150,
    image: "https://images.unsplash.com/photo-1621006279463-02a6316c5719?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea477942698?q=80&w=800",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800"
    ],
    description: "إصدار نيش الشهير، مزيج ساحر من الأناناس المنعش وخشب البلوط.",
    descriptionEn: "The famous niche release, a magical blend of fresh pineapple and oakmoss.",
    stock: 15
  }
];

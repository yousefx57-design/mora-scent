
import React from 'react';

interface HeroProps {
  lang: 'ar' | 'en';
}

const Hero: React.FC<HeroProps> = ({ lang }) => {
  return (
    <div className="relative h-[85vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1557170334-a9632e77c6e4?q=80&w=2000&auto=format&fit=crop" 
          alt="Luxury Perfume Hero" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <span className="block text-[#D4AF37] text-lg font-medium mb-4 tracking-[0.2em] uppercase animate-fade-in-up">
          {lang === 'ar' ? 'عالم Mora scent للفخامة العطرية' : 'Mora scent World of Aromatic Luxury'}
        </span>
        <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight animate-fade-in-up">
          {lang === 'ar' ? (
            <>حيث تبدأ الذكريات <br /> برائحة لا تُنسى</>
          ) : (
            <>Where Memories Begin <br /> with an Unforgettable Scent</>
          )}
        </h2>
        <p className="text-lg md:text-xl text-neutral-200 mb-10 max-w-2xl mx-auto font-light animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          {lang === 'ar' 
            ? 'نقدم لك أرقى تشكيلة من عطور النيش والزيوت العطرية، مختارة بعناية في مصر لتناسب ذوقك الرفيع وتمنحك حضوراً ملكياً.'
            : 'We offer you the finest collection of niche perfumes and essential oils, carefully selected in Egypt to suit your refined taste.'}
        </p>
        <a 
          href="#collection" 
          className="inline-block bg-[#D4AF37] text-black px-10 py-4 font-semibold text-lg hover:bg-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg animate-fade-in-up"
          style={{animationDelay: '0.4s'}}
        >
          {lang === 'ar' ? 'اكتشف المجموعة' : 'Discover Collection'}
        </a>
      </div>
    </div>
  );
};

export default Hero;

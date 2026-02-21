
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Product, StoreSettings } from '../types';

interface ChatWidgetProps {
  products: Product[];
  lang: 'ar' | 'en';
  storeSettings: StoreSettings;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ products, lang, storeSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { 
      role: 'model', 
      text: lang === 'ar' 
        ? `أهلاً بك في ${storeSettings.name}! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم في اختيار عطر أحلامك؟` 
        : `Welcome to ${storeSettings.name}! I am your smart assistant. How can I help you choose your dream scent today?`
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const productsContext = products.map(p => `- ${p.name} / ${p.nameEn} (${p.category}): ${p.price} ${storeSettings.currency}. Description: ${p.descriptionEn}`).join('\n');
      
      const systemInstruction = lang === 'ar' ? `
        أنت مساعد ذكي لمتجر "${storeSettings.name}" الفاخر للعطور. 
        أسلوبك: راقٍ، مؤدب، خبير في العطور، ومساعد جداً.
        استخدم اللغة العربية الفصحى البسيطة أو البيضاء المناسبة لمصر.
        لديك قائمة المنتجات التالية المتوفرة في المتجر:
        ${productsContext}
        
        مهامك:
        1. الإجابة على استفسارات العملاء حول العطور.
        2. ترشيح عطور بناءً على ذوق العميل.
        3. تشجيع العميل على إتمام الشراء بلطف وفخامة.
      ` : `
        You are a smart assistant for the luxury "${storeSettings.name}" perfume store.
        Your style: sophisticated, polite, perfume expert, and very helpful.
        Available products:
        ${productsContext}
        
        Tasks:
        1. Answer customer inquiries about perfumes.
        2. Recommend perfumes based on customer taste.
        3. Gently encourage the customer to complete the purchase.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...messages.map(m => ({ role: m.role === 'model' ? 'model' : 'user', parts: [{ text: m.text }] })),
          { role: 'user', parts: [{ text: userMsg }] }
        ],
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const responseText = response.text || (lang === 'ar' ? "عذراً، حدث خطأ في معالجة طلبك." : "Sorry, an error occurred while processing your request.");
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: lang === 'ar' 
          ? "عذراً، أواجه صعوبة في الاتصال حالياً. يرجى المحاولة مرة أخرى." 
          : "Sorry, I am having trouble connecting right now. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-[#D4AF37] text-black p-4 rounded-full shadow-2xl hover:bg-[#b5952f] transition-all transform hover:scale-110 active:scale-95"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-neutral-100 h-[500px] animate-fade-in-up">
          <div className="bg-[#1a1a1a] text-white p-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center font-serif text-black font-bold uppercase overflow-hidden">
                {storeSettings.logo.startsWith('http') ? (
                  <img src={storeSettings.logo} alt={storeSettings.name} className="w-full h-full object-cover" />
                ) : storeSettings.logo}
              </div>
              <div>
                <div className="font-serif font-bold text-lg leading-none">
                  {lang === 'ar' ? `مساعد ${storeSettings.name}` : `${storeSettings.name} Assistant`}
                </div>
                <div className="text-[10px] text-[#D4AF37] flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> 
                  {lang === 'ar' ? 'متصل الآن' : 'Online'}
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-[#D4AF37] transition-colors"><X size={20} /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? (lang === 'ar' ? 'justify-start' : 'justify-end') : (lang === 'ar' ? 'justify-end' : 'justify-start')}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#1a1a1a] text-white rounded-br-none' 
                    : 'bg-white border border-neutral-100 text-neutral-800 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={`flex ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
                <div className="bg-white p-3 rounded-2xl rounded-bl-none text-xs text-neutral-400 italic">
                  {lang === 'ar' ? 'جاري التفكير...' : 'Thinking...'}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-neutral-100 flex gap-2" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={lang === 'ar' ? "اكتب استفسارك هنا..." : "Type your query here..."}
              className="flex-1 bg-neutral-100 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border-none"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-2.5 bg-[#D4AF37] text-black rounded-full hover:bg-[#b5952f] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <Send size={20} className={lang === 'en' ? 'rotate-180' : ''} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;

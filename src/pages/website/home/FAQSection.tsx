import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { question: "How do I track my order?", answer: "You can track your order in real-time through the 'Track Order' page in your account dashboard using your order ID." },
  { question: "What are the payment methods available?", answer: "We accept all major credit cards, debit cards, and secure payments through the Square payment gateway." },
  { question: "Do you offer delivery in my area?", answer: "We deliver across a wide range of regions. You can check our delivery coverage map on our website." },
  { question: "Can I cancel or change my order?", answer: "Orders can be modified or cancelled within 30 minutes of placement. Please contact our support team immediately." }
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Heading & Description (Kept exactly as approved) */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-sm font-bold text-orange-600 uppercase tracking-[0.2em]">Support</h2>
          <h1 className="text-4xl md:text-5xl font-black text-gray-950 tracking-tight leading-tight">
            Frequently Asked <br/><span className="text-orange-600">Questions</span>
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Need help? We've compiled a list of commonly asked questions to help you get the answers you need quickly.
          </p>
        </div>

        {/* Right Side: Upgraded Modern Accordion */}
        <div className="lg:col-span-7 space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div 
                key={idx} 
                // Dynamically apply styles based on whether the accordion item is active
                className={`group rounded-2xl transition-all duration-300 border ${
                  isOpen 
                    ? 'bg-white border-orange-500/30 shadow-xl shadow-orange-500/5 ring-1 ring-orange-500/20' 
                    : 'bg-gray-50/70 border-gray-200/80 hover:bg-white hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <button 
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  // Full width interactive button with padding adjustments
                  className="w-full flex items-center justify-between p-6 md:p-7 text-left transition-colors"
                >
                  <span className={`text-lg font-bold transition-colors duration-300 ${
                    isOpen ? 'text-orange-600' : 'text-gray-800 group-hover:text-gray-950'
                  }`}>
                    {faq.question}
                  </span>

                  {/* Circular icon badge with smooth rotation and background color shift */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ml-4 transition-all duration-300 ${
                    isOpen 
                      ? 'bg-orange-600 text-white rotate-180 shadow-md shadow-orange-600/20' 
                      : 'bg-white text-gray-400 border border-gray-200 group-hover:border-orange-200 group-hover:text-orange-500'
                  }`}>
                    <ChevronDown size={18} />
                  </div>
                </button>
                
                {/* Expandable answer container with smooth height transition */}
                <div 
                  className={`px-6 md:px-7 overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-48 pb-7 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  {/* Subtle divider line above answer text for visual structure */}
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed text-base">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
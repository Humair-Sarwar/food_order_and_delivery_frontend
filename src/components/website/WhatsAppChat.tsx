import React from 'react';
import { FaWhatsapp } from 'react-icons/fa6';

interface WhatsAppButtonProps {
  data: {
    whatsapp_no: string | number;
  }
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ data }) => {

  const cleanNumber = data?.whatsapp_no?.toString().replace(/\D/g, '');
  
  const defaultMsg = encodeURIComponent("Hello QuizMaster! I need some help regarding the platform.");

  return (
    <div className='whatsAppFixedFloatButton fixed md:bottom-7! md:right-7! bottom-4! right-4! z-[55]!'>
      <a 
        href={`https://wa.me/${cleanNumber}?text=${defaultMsg}`} 
        target='_blank' 
        rel="noopener noreferrer"
        className="flex items-center no-underline group"
      >
        <div className="bg-white py-1 px-2 text-[12px] font-medium rounded-lg mr-3 text-slate-700 shadow-md border border-slate-100 hidden sm:block">
          Need Help? Contact Us
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-[#2db742] animate-ping opacity-25"></div>
          <div className="relative rounded-full bg-[#2db742] p-3 flex items-center justify-center text-white shadow-[0_10px_25px_rgba(45,183,66,0.4)] transition-transform group-hover:scale-110">
            <FaWhatsapp className="text-[30px]" />
          </div>
        </div>
      </a>
    </div>
  );
}

export default WhatsAppButton;
'use client';

import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function WhatsAppFloatButton() {
  const handleWhatsAppClick = () => {
    const phoneNumber = '+51913828147';
    const message = encodeURIComponent('¡Hola! Me interesa conocer más sobre los tratos de poker disponibles.');
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <button
        onClick={handleWhatsAppClick}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 p-0 shadow-2xl hover:shadow-green-500/25 transition-all duration-300 group flex items-center justify-center"
        title="Contactar por WhatsApp"
      >
        <MessageCircle className="h-7 w-7 group-hover:scale-110 transition-transform duration-300" />
        
        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
          Contactar por WhatsApp
          <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
        </div>
      </button>
      
      {/* Pulse animation ring */}
      <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></div>
    </motion.div>
  );
}
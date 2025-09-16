'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';
import { motion, AnimatePresence } from 'framer-motion';

export function AdminFloatButton() {
  const { user } = useAuthStore();
  
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/51913828147', '_blank');
  };

  // Convertir el botón admin en botón de WhatsApp temporalmente
  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          size="lg"
          onClick={handleWhatsAppClick}
          className="rounded-full w-16 h-16 shadow-lg bg-green-500 hover:bg-green-600"
          title="Contactar por WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}
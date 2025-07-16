'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';
import { motion, AnimatePresence } from 'framer-motion';

export function AdminFloatButton() {
  const { user } = useAuthStore();
  
  if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
    return null;
  }

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
          className="rounded-full w-16 h-16 shadow-lg bg-poker-green hover:bg-poker-darkGreen"
          asChild
        >
          <Link href="/admin" title="Panel Administrativo">
            <Shield className="h-6 w-6" />
          </Link>
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}
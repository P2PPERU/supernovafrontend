'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SpinHistory } from '@/components/roulette/spin-history';
import { ChevronLeft, History } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RouletteHistoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/roulette">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <History className="h-8 w-8 text-poker-green" />
              Historial de Giros
            </h1>
            <p className="text-muted-foreground mt-1">
              Revisa todos tus giros y premios obtenidos
            </p>
          </div>
        </div>
      </motion.div>

      {/* Contenido */}
      <SpinHistory />
    </div>
  );
}
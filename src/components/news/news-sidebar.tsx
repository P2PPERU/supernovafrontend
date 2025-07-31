'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface NewsSidebarProps {
  children: ReactNode;
  className?: string;
}

export function NewsSidebar({ children, className = '' }: NewsSidebarProps) {
  return (
    <aside className={`space-y-6 ${className}`}>
      {children}
    </aside>
  );
}

interface SidebarSectionProps {
  children: ReactNode;
  delay?: number;
}

export function SidebarSection({ children, delay = 0 }: SidebarSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay }}
      className="sticky top-24"
    >
      {children}
    </motion.div>
  );
}
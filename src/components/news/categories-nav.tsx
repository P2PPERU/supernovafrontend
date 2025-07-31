'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { 
  Newspaper, 
  Trophy, 
  Gift, 
  Zap, 
  Megaphone,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Category {
  value: string;
  label: string;
  icon: any;
  color: string;
  count?: number;
}

const defaultCategories: Category[] = [
  { value: 'all', label: 'Todas', icon: Newspaper, color: 'text-gray-400' },
  { value: 'general', label: 'General', icon: Megaphone, color: 'text-blue-500' },
  { value: 'tournament', label: 'Torneos', icon: Trophy, color: 'text-poker-gold' },
  { value: 'promotion', label: 'Promociones', icon: Gift, color: 'text-poker-green' },
  { value: 'update', label: 'Actualizaciones', icon: Zap, color: 'text-purple-500' },
];

interface CategoriesNavProps {
  categories?: Category[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  showCounts?: boolean;
}

export function CategoriesNav({ 
  categories = defaultCategories, 
  activeCategory, 
  onCategoryChange,
  showCounts = false 
}: CategoriesNavProps) {
  const [showArrows, setShowArrows] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      {/* Left Arrow */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: showArrows ? 1 : 0 }}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full glass bg-background/80 backdrop-blur-sm"
      >
        <ChevronLeft className="h-4 w-4" />
      </motion.button>

      {/* Categories */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 pb-2">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.value;
            
            return (
              <motion.button
                key={category.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCategoryChange(category.value)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 whitespace-nowrap
                  ${isActive 
                    ? 'bg-poker-green text-black font-semibold shadow-lg shadow-poker-green/30' 
                    : 'glass hover:bg-white/10 text-gray-300'
                  }
                `}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-black' : category.color}`} />
                <span>{category.label}</span>
                {showCounts && category.count && (
                  <Badge 
                    variant="outline" 
                    className={`ml-2 text-xs ${isActive ? 'border-black/20 text-black' : 'border-white/20'}`}
                  >
                    {category.count}
                  </Badge>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Right Arrow */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: showArrows ? 1 : 0 }}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full glass bg-background/80 backdrop-blur-sm"
      >
        <ChevronRight className="h-4 w-4" />
      </motion.button>
    </div>
  );
}
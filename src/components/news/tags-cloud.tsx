'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tag, TrendingUp } from 'lucide-react';

interface TagItem {
  name: string;
  count: number;
  trending?: boolean;
}

interface TagsCloudProps {
  tags: TagItem[];
  onTagClick?: (tag: string) => void;
  title?: string;
}

export function TagsCloud({ tags, onTagClick, title = "Etiquetas Populares" }: TagsCloudProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Calcular tamaño basado en la frecuencia
  const getTagSize = (count: number): string => {
    const maxCount = Math.max(...tags.map(t => t.count));
    const percentage = count / maxCount;
    
    if (percentage > 0.8) return 'text-lg font-bold';
    if (percentage > 0.6) return 'text-base font-semibold';
    if (percentage > 0.4) return 'text-sm font-medium';
    return 'text-xs';
  };

  // Calcular opacidad basada en la frecuencia
  const getTagOpacity = (count: number): string => {
    const maxCount = Math.max(...tags.map(t => t.count));
    const percentage = count / maxCount;
    
    if (percentage > 0.8) return 'opacity-100';
    if (percentage > 0.6) return 'opacity-80';
    if (percentage > 0.4) return 'opacity-60';
    return 'opacity-40';
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag === selectedTag ? null : tag);
    onTagClick?.(tag);
  };

  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Tag className="h-5 w-5 text-poker-purple" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 justify-center">
          {tags.map((tag, index) => (
            <motion.button
              key={tag.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTagClick(tag.name)}
              className={`
                relative px-3 py-1 rounded-full transition-all duration-300
                ${selectedTag === tag.name 
                  ? 'bg-poker-green text-black' 
                  : 'glass border border-white/20 hover:bg-white/10 text-gray-300'
                }
                ${getTagSize(tag.count)}
                ${getTagOpacity(tag.count)}
              `}
            >
              {tag.trending && (
                <TrendingUp className="absolute -top-1 -right-1 h-3 w-3 text-poker-gold" />
              )}
              <span>{tag.name}</span>
              <Badge 
                variant="outline" 
                className="ml-2 text-xs px-1 py-0 h-4 border-white/20"
              >
                {tag.count}
              </Badge>
            </motion.button>
          ))}
        </div>

        {selectedTag && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 rounded-lg bg-white/5 text-sm text-center"
          >
            Mostrando noticias con la etiqueta: <span className="font-semibold text-poker-green">{selectedTag}</span>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
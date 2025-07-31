'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Flame, Eye } from 'lucide-react';
import { News } from '@/types';
import { formatRelativeTime } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TrendingWidgetProps {
  news: News[];
  title?: string;
  showViews?: boolean;
}

export function TrendingWidget({ news, title = "Lo Más Leído", showViews = true }: TrendingWidgetProps) {
  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-poker-green" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {news.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={`/news/${item.id}`}
                className="block group hover:bg-white/5 rounded-lg p-3 -m-3 transition-all"
              >
                <div className="flex gap-3">
                  <div className={`
                    flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                    ${index === 0 ? 'bg-gradient-to-br from-poker-gold to-yellow-600 text-black' : ''}
                    ${index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600 text-black' : ''}
                    ${index === 2 ? 'bg-gradient-to-br from-orange-600 to-orange-800 text-white' : ''}
                    ${index > 2 ? 'bg-gray-700 text-gray-300' : ''}
                  `}>
                    {index < 3 ? (
                      <Flame className="h-5 w-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium line-clamp-2 group-hover:text-poker-green transition-colors text-sm mb-1">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{formatRelativeTime(item.publishedAt || item.createdAt)}</span>
                      {showViews && item.views && (
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {item.views.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
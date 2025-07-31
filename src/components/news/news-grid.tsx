'use client';

import { motion } from 'framer-motion';
import { News } from '@/types';
import { NewsCardLarge, NewsCardMedium, NewsCardSmall } from './news-card-variants';

interface NewsGridProps {
  news: News[];
  layout?: 'default' | 'magazine' | 'blog' | 'masonry';
}

export function NewsGrid({ news, layout = 'magazine' }: NewsGridProps) {
  if (news.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  switch (layout) {
    case 'magazine':
      return <MagazineLayout news={news} containerVariants={containerVariants} />;
    case 'blog':
      return <BlogLayout news={news} containerVariants={containerVariants} />;
    case 'masonry':
      return <MasonryLayout news={news} containerVariants={containerVariants} />;
    default:
      return <DefaultLayout news={news} containerVariants={containerVariants} />;
  }
}

// Magazine Layout - Featured + Grid
function MagazineLayout({ news, containerVariants }: any) {
  const featured = news[0];
  const secondary = news.slice(1, 3);
  const rest = news.slice(3);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Featured Article */}
      {featured && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <NewsCardLarge news={featured} />
        </motion.div>
      )}

      {/* Secondary Articles */}
      {secondary.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {secondary.map((item: News, index: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
            >
              <NewsCardMedium news={item} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Rest of Articles */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((item: News, index: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 * index }}
            >
              <NewsCardSmall news={item} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// Blog Layout - Single Column
function BlogLayout({ news, containerVariants }: any) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-4xl mx-auto"
    >
      {news.map((item: News, index: number) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 * index }}
        >
          <NewsCardLarge news={item} horizontal />
        </motion.div>
      ))}
    </motion.div>
  );
}

// Masonry Layout
function MasonryLayout({ news, containerVariants }: any) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto"
    >
      {news.map((item: News, index: number) => {
        // Vary card sizes for masonry effect
        const isLarge = index % 5 === 0;
        const CardComponent = isLarge ? NewsCardLarge : index % 3 === 0 ? NewsCardMedium : NewsCardSmall;
        
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.05 * index }}
            className={isLarge ? 'md:col-span-2 lg:col-span-2' : ''}
          >
            <CardComponent news={item} />
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// Default Grid Layout
function DefaultLayout({ news, containerVariants }: any) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {news.map((item: News, index: number) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 * index }}
        >
          <NewsCardMedium news={item} />
        </motion.div>
      ))}
    </motion.div>
  );
}
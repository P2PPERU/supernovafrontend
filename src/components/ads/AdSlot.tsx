'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ad, AdSlotProps } from '@/types/ads.types';
import { adsService, AdWithPlaceholder } from '@/services/ads.service';
import { AdPlaceholder } from './AdPlaceholder';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { X, ExternalLink } from 'lucide-react';

export function AdSlot({
  type,
  position,
  className,
  maxAds = 3,
  rotationInterval = 30,
}: AdSlotProps) {
  const [ads, setAds] = useState<AdWithPlaceholder[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    loadAds();
  }, [type]);

  useEffect(() => {
    if (ads.length <= 1 || !isVisible) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, rotationInterval * 1000);

    return () => clearInterval(interval);
  }, [ads.length, rotationInterval, isVisible]);

  const loadAds = async () => {
    try {
      setIsLoading(true);
      const adsData = await adsService.getAdsByType(type);
      setAds(adsData.slice(0, maxAds));
    } catch (error) {
      console.error('Error loading ads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdClick = async (ad: AdWithPlaceholder) => {
    await adsService.recordClick(ad.id);
    window.open(ad.linkUrl, '_blank', 'noopener,noreferrer');
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible || isLoading || ads.length === 0) {
    return null;
  }

  const currentAd = ads[currentAdIndex];

  switch (type) {
    case 'banner':
      return <BannerAd ad={currentAd} onClose={handleClose} onClick={handleAdClick} className={className} />;
    case 'sidebar':
      return <SidebarAd ads={ads} currentIndex={currentAdIndex} onClick={handleAdClick} className={className} />;
    case 'native':
      return <NativeAd ad={currentAd} onClick={handleAdClick} className={className} />;
    default:
      return null;
  }
}

// Componente para Banner Ads
function BannerAd({
  ad,
  onClose,
  onClick,
  className,
}: {
  ad: AdWithPlaceholder;
  onClose: () => void;
  onClick: (ad: AdWithPlaceholder) => void;
  className?: string;
}) {
  useEffect(() => {
    adsService.recordImpression(ad.id);
  }, [ad.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        'relative overflow-hidden rounded-lg bg-gray-900/50 backdrop-blur-sm border border-white/10',
        className
      )}
    >
      <div className="relative group cursor-pointer" onClick={() => onClick(ad)}>
        <div className="relative h-20 md:h-24 lg:h-[90px] w-full">
          {ad.placeholderData ? (
            <AdPlaceholder
              width={ad.size?.width || 728}
              height={ad.size?.height || 90}
              text={ad.placeholderData.text}
              bgColor={ad.placeholderData.bgColor}
              textColor={ad.placeholderData.textColor}
            />
          ) : ad.imageUrl ? (
            <Image
              src={ad.imageUrl}
              alt={ad.title}
              fill
              className="object-contain"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-poker-green/20 to-poker-purple/20 flex items-center justify-center">
              <span className="text-white font-bold">{ad.title}</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
          
          <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-xs text-gray-400">
            Publicidad
          </div>
          
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <ExternalLink className="h-4 w-4 text-white" />
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-2 right-2 p-1 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        >
          <X className="h-3 w-3 text-white" />
        </button>
      </div>
    </motion.div>
  );
}

// Componente para Sidebar Ads
function SidebarAd({
  ads,
  currentIndex,
  onClick,
  className,
}: {
  ads: AdWithPlaceholder[];
  currentIndex: number;
  onClick: (ad: AdWithPlaceholder) => void;
  className?: string;
}) {
  const currentAd = ads[currentIndex];

  useEffect(() => {
    adsService.recordImpression(currentAd.id);
  }, [currentAd.id]);

  return (
    <div className={cn('space-y-4', className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentAd.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-xl bg-gray-900/30 backdrop-blur-sm border border-white/10 group cursor-pointer"
          onClick={() => onClick(currentAd)}
        >
          <div className={cn(
            'relative w-full',
            currentAd.size?.height === 600 ? 'h-[600px]' : 'h-[250px]'
          )}>
            {currentAd.placeholderData ? (
              <AdPlaceholder
                width={currentAd.size?.width || 300}
                height={currentAd.size?.height || 250}
                text={currentAd.placeholderData.text}
                bgColor={currentAd.placeholderData.bgColor}
                textColor={currentAd.placeholderData.textColor}
              />
            ) : currentAd.imageUrl ? (
              <Image
                src={currentAd.imageUrl}
                alt={currentAd.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-poker-green/20 to-poker-purple/20 flex items-center justify-center p-4">
                <span className="text-white font-bold text-center">{currentAd.title}</span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="absolute top-3 left-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-xs text-gray-300">
              Publicidad
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="px-4 py-2 bg-poker-green text-black rounded-lg font-medium flex items-center gap-2">
                Ver más
                <ExternalLink className="h-4 w-4" />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {ads.length > 1 && (
        <div className="flex justify-center gap-1">
          {ads.map((_, index) => (
            <div
              key={index}
              className={cn(
                'h-1 rounded-full transition-all duration-300',
                index === currentIndex
                  ? 'w-6 bg-poker-green'
                  : 'w-1 bg-gray-600'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Componente para Native Ads
function NativeAd({
  ad,
  onClick,
  className,
}: {
  ad: AdWithPlaceholder;
  onClick: (ad: AdWithPlaceholder) => void;
  className?: string;
}) {
  useEffect(() => {
    adsService.recordImpression(ad.id);
  }, [ad.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-sm border border-white/10 p-4 group cursor-pointer hover:border-poker-green/30 transition-all duration-300',
        className
      )}
      onClick={() => onClick(ad)}
    >
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
          {ad.placeholderData ? (
            <AdPlaceholder
              width={ad.size?.width || 320}
              height={ad.size?.height || 100}
              text={ad.placeholderData.text}
              bgColor={ad.placeholderData.bgColor}
              textColor={ad.placeholderData.textColor}
            />
          ) : ad.imageUrl ? (
            <Image
              src={ad.imageUrl}
              alt={ad.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-poker-green/20 to-poker-purple/20 flex items-center justify-center">
              <span className="text-white font-bold text-xs text-center">{ad.title}</span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded">
              Contenido patrocinado
            </span>
          </div>
          <h3 className="font-semibold text-sm group-hover:text-poker-green transition-colors line-clamp-2">
            {ad.title}
          </h3>
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink className="h-5 w-5 text-poker-green" />
        </div>
      </div>
    </motion.div>
  );
}
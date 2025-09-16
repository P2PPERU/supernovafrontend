// src/components/home/clubs-carousel.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFeaturedClubs } from '@/hooks/useClubs';
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Users, 
  Globe, 
  Star,
  ExternalLink,
  Gamepad2,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Club } from '@/types/club.types';
import Image from 'next/image';

interface ClubsCarouselProps {
  title?: string;
  subtitle?: string;
  showAll?: boolean;
  limit?: number;
}

// Skeleton component for loading state
const ClubCardSkeleton = () => (
  <Card className="h-80 lg:h-96 animate-pulse">
    <div className="h-24 lg:h-32 bg-gray-200 dark:bg-gray-700" />
    <CardContent className="p-4 lg:p-6">
      <div className="space-y-4">
        <div className="flex items-start gap-3 lg:gap-4">
          <div className="h-12 w-12 lg:h-16 lg:w-16 bg-gray-200 dark:bg-gray-700 rounded-full -mt-6 lg:-mt-8" />
          <div className="flex-1">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          </div>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export function ClubsCarousel({ 
  title = "Clubs Destacados", 
  subtitle = "Los mejores clubs de poker online",
  showAll = true,
  limit = 6 
}: ClubsCarouselProps) {
  const { data, isLoading, error } = useFeaturedClubs(limit);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [isClient, setIsClient] = useState(false);

  const clubs = useMemo(() => data?.clubs || [], [data?.clubs]);

  // Client-side rendering check
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Responsive items per page with useCallback to prevent unnecessary re-renders
  const handleResize = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const width = window.innerWidth;
    let newItemsPerPage;
    
    if (width < 640) newItemsPerPage = 1;
    else if (width < 1024) newItemsPerPage = 2;
    else if (width < 1280) newItemsPerPage = 3;
    else newItemsPerPage = 4;
    
    setItemsPerPage(prev => prev !== newItemsPerPage ? newItemsPerPage : prev);
    setCurrentIndex(prev => Math.min(prev, Math.max(0, Math.ceil(clubs.length / newItemsPerPage) - 1)));
  }, [clubs.length]);

  useEffect(() => {
    if (!isClient) return;
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize, isClient]);

  const totalPages = useMemo(() => Math.ceil(clubs.length / itemsPerPage), [clubs.length, itemsPerPage]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  // Auto-scroll with proper cleanup
  useEffect(() => {
    if (!isClient || clubs.length <= itemsPerPage || totalPages <= 1) return;

    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [clubs.length, itemsPerPage, totalPages, nextSlide, isClient]);

  const visibleClubs = useMemo(() => {
    return clubs.slice(
      currentIndex * itemsPerPage,
      (currentIndex + 1) * itemsPerPage
    );
  }, [clubs, currentIndex, itemsPerPage]);

  // Loading state with better skeleton
  if (isLoading || !isClient) {
    return (
      <section className="py-12 lg:py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 lg:mb-12">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 max-w-full mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: Math.min(4, limit) }).map((_, i) => (
              <ClubCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-12 lg:py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Error al cargar los clubs. Intenta recargar la página.
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
          >
            Recargar
          </Button>
        </div>
      </section>
    );
  }

  // Empty state
  if (clubs.length === 0) {
    return (
      <section className="py-12 lg:py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            No hay clubs disponibles en este momento.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 lg:mb-4 text-gray-900 dark:text-white"
          >
            {title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 dark:text-gray-300 text-base lg:text-lg max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-7xl mx-auto">
          {/* Navigation Buttons - Only show if multiple pages */}
          {totalPages > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 lg:-translate-x-4 z-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-xl border-gray-200 dark:bg-gray-800/90 dark:hover:bg-gray-800 dark:border-gray-700 hidden sm:flex"
                onClick={prevSlide}
                aria-label="Club anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 lg:translate-x-4 z-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-xl border-gray-200 dark:bg-gray-800/90 dark:hover:bg-gray-800 dark:border-gray-700 hidden sm:flex"
                onClick={nextSlide}
                aria-label="Club siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Cards Grid - Simplified animation */}
          <div className="overflow-hidden px-2 sm:px-0">
            <motion.div
              key={`clubs-${currentIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
            >
              {visibleClubs.map((club) => (
                <ClubCard key={`club-${club.id}-${currentIndex}`} club={club} />
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator - Only show if multiple pages */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 lg:mt-8 gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={`dot-${index}`}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-blue-600 dark:bg-blue-400 w-6 lg:w-8' 
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Ir a la página ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Mobile Navigation - Only show if multiple pages */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-4 sm:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                className="bg-white/90 dark:bg-gray-800/90"
                disabled={totalPages <= 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                className="bg-white/90 dark:bg-gray-800/90"
                disabled={totalPages <= 1}
              >
                Siguiente
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>

        {/* View All Button */}
        {showAll && clubs.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-8 lg:mt-12"
          >
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
              <Link href="/clubs">
                Ver Todos los Clubs
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// Optimized Club Card Component
const ClubCard = ({ club }: { club: Club }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden group hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 relative">
        {/* Banner Image with Next.js Image optimization */}
        <div className="h-24 lg:h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
          {club.banner && !imageError ? (
            <>
              <Image 
                src={club.banner} 
                alt={`${club.name} banner`}
                fill
                className={`object-cover group-hover:scale-110 transition-all duration-500 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onError={handleImageError}
                onLoad={handleImageLoad}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                priority={false}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          {club.isFeatured && (
            <Badge className="absolute top-2 right-2 bg-yellow-500 text-black font-semibold text-xs px-2 py-1">
              <Star className="h-3 w-3 mr-1" />
              Destacado
            </Badge>
          )}
        </div>

        <CardContent className="p-4 lg:p-6 space-y-3 lg:space-y-4 flex flex-col h-full">
          {/* Header with Logo and Title */}
          <div className="flex items-start gap-3 lg:gap-4">
            <Avatar className="h-12 w-12 lg:h-16 lg:w-16 border-4 border-white dark:border-gray-700 shadow-lg -mt-6 lg:-mt-8 bg-white dark:bg-gray-700">
              <AvatarImage src={club.logo || ''} alt={club.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm lg:text-lg">
                {club.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 pt-1">
              <h3 className="text-lg lg:text-xl font-bold mb-1 truncate text-gray-900 dark:text-white">
                {club.name}
              </h3>
              {club.location && (
                <div className="flex items-center gap-1 text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{club.location.city}, {club.location.country}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 flex-grow">
            {club.shortDescription || club.description || "Club de poker online con excelentes promociones y torneos."}
          </p>

          {/* Features */}
          {club.features && club.features.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {club.features.slice(0, 2).map((feature, index) => (
                <Badge key={`${feature}-${index}`} variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {feature}
                </Badge>
              ))}
              {club.features.length > 2 && (
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  +{club.features.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 lg:gap-4 py-2 lg:py-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm">
              <Users className="h-3 w-3 lg:h-4 lg:w-4 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-gray-900 dark:text-white">
                {club.stats?.totalMembers?.toLocaleString() || '1K+'}
              </span>
              <span className="text-gray-600 dark:text-gray-400 hidden sm:inline">miembros</span>
            </div>
            <div className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm">
              <Gamepad2 className="h-3 w-3 lg:h-4 lg:w-4 text-purple-600 dark:text-purple-400" />
              <span className="font-semibold text-gray-900 dark:text-white">
                {club.gameTypes?.length || '5+'}
              </span>
              <span className="text-gray-600 dark:text-gray-400 hidden sm:inline">juegos</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 mt-auto">
            <Button asChild className="flex-1 bg-green-600 hover:bg-green-700 text-white" size="sm">
              <Link href={`/clubs/${club.id}`}>
                Ver Detalles
              </Link>
            </Button>
            {club.website && (
              <Button variant="outline" size="sm" asChild className="border-gray-300 dark:border-gray-600">
                <a 
                  href={club.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                  aria-label={`Visitar sitio web de ${club.name}`}
                >
                  <Globe className="h-3 w-3" />
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
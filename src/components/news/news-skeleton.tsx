'use client';

import { Card } from '@/components/ui/card';

export function NewsSkeletonLarge() {
  return (
    <Card className="glass border-white/10 overflow-hidden">
      <div className="animate-pulse">
        <div className="h-96 bg-gray-700 rounded-t-xl" />
        <div className="p-8">
          <div className="flex gap-2 mb-4">
            <div className="h-6 w-20 bg-gray-700 rounded-full" />
            <div className="h-6 w-24 bg-gray-700 rounded-full" />
          </div>
          <div className="h-8 bg-gray-700 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-700 rounded w-full mb-2" />
          <div className="h-4 bg-gray-700 rounded w-5/6 mb-6" />
          <div className="flex gap-4">
            <div className="h-4 w-24 bg-gray-700 rounded" />
            <div className="h-4 w-20 bg-gray-700 rounded" />
            <div className="h-4 w-16 bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function NewsSkeletonMedium() {
  return (
    <Card className="glass border-white/10 overflow-hidden">
      <div className="animate-pulse">
        <div className="h-48 bg-gray-700" />
        <div className="p-5">
          <div className="h-5 w-20 bg-gray-700 rounded-full mb-3" />
          <div className="h-6 bg-gray-700 rounded w-full mb-2" />
          <div className="h-6 bg-gray-700 rounded w-3/4 mb-4" />
          <div className="flex gap-3">
            <div className="h-4 w-20 bg-gray-700 rounded" />
            <div className="h-4 w-16 bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function NewsSkeletonSmall() {
  return (
    <Card className="glass border-white/10 overflow-hidden">
      <div className="animate-pulse p-5">
        <div className="flex gap-2 mb-3">
          <div className="h-5 w-16 bg-gray-700 rounded-full" />
          <div className="h-5 w-12 bg-gray-700 rounded-full" />
        </div>
        <div className="h-5 bg-gray-700 rounded w-full mb-2" />
        <div className="h-5 bg-gray-700 rounded w-3/4 mb-3" />
        <div className="h-4 w-24 bg-gray-700 rounded" />
      </div>
    </Card>
  );
}

export function NewsSkeletonList() {
  return (
    <Card className="glass border-white/10 overflow-hidden">
      <div className="animate-pulse p-4 flex gap-4">
        <div className="h-24 w-24 bg-gray-700 rounded-lg flex-shrink-0" />
        <div className="flex-1">
          <div className="h-4 w-20 bg-gray-700 rounded-full mb-2" />
          <div className="h-5 bg-gray-700 rounded w-full mb-2" />
          <div className="h-5 bg-gray-700 rounded w-3/4 mb-3" />
          <div className="h-4 w-16 bg-gray-700 rounded" />
        </div>
      </div>
    </Card>
  );
}

// Grid of Skeletons
export function NewsSkeletonGrid({ count = 6, variant = 'medium' }: { count?: number; variant?: 'large' | 'medium' | 'small' }) {
  const SkeletonComponent = {
    large: NewsSkeletonLarge,
    medium: NewsSkeletonMedium,
    small: NewsSkeletonSmall,
  }[variant];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  );
}
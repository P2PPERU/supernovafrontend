import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

interface RoomSkeletonProps {
  variant?: 'card' | 'detail' | 'list';
}

export function RoomSkeleton({ variant = 'card' }: RoomSkeletonProps) {
  if (variant === 'card') {
    return (
      <Card className="overflow-hidden">
        <div className="p-6 space-y-4">
          {/* Badge */}
          <div className="flex justify-between items-start">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
          
          {/* Logo */}
          <Skeleton className="h-16 w-16 rounded-full mx-auto" />
          
          {/* Title */}
          <Skeleton className="h-8 w-32 mx-auto" />
          
          {/* Rating */}
          <div className="flex justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-4" />
            ))}
            <Skeleton className="h-4 w-12 ml-1" />
          </div>
          
          {/* Bonuses */}
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          
          {/* Features */}
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
          
          {/* Button */}
          <Skeleton className="h-10 w-full" />
        </div>
      </Card>
    );
  }

  if (variant === 'list') {
    return (
      <Card className="p-4">
        <div className="flex gap-4 items-center">
          <Skeleton className="h-20 w-20 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full max-w-md" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </Card>
    );
  }

  // Detail skeleton
  return (
    <div className="space-y-8">
      {/* Hero skeleton */}
      <Skeleton className="h-96 w-full" />
      
      {/* Content skeleton */}
      <div className="container mx-auto px-4 space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-4 w-full max-w-2xl" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-32 w-full" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// Grid skeleton helper
export function RoomGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <RoomSkeleton key={i} variant="card" />
      ))}
    </div>
  );
}
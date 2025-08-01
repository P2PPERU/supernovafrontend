import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoomRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  totalReviews?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export function RoomRating({ 
  rating, 
  maxRating = 5,
  size = 'md',
  showValue = true,
  totalReviews,
  interactive = false,
  onRatingChange
}: RoomRatingProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <button
            key={`full-${i}`}
            onClick={() => handleClick(i + 1)}
            disabled={!interactive}
            className={cn(
              'text-yellow-500',
              interactive && 'hover:scale-110 transition-transform cursor-pointer'
            )}
          >
            <Star className={cn(sizeClasses[size], 'fill-current')} />
          </button>
        ))}
        
        {/* Half star */}
        {hasHalfStar && (
          <button
            onClick={() => handleClick(fullStars + 0.5)}
            disabled={!interactive}
            className={cn(
              'text-yellow-500 relative',
              interactive && 'hover:scale-110 transition-transform cursor-pointer'
            )}
          >
            <Star className={cn(sizeClasses[size])} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={cn(sizeClasses[size], 'fill-current')} />
            </div>
          </button>
        )}
        
        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <button
            key={`empty-${i}`}
            onClick={() => handleClick(fullStars + (hasHalfStar ? 1 : 0) + i + 1)}
            disabled={!interactive}
            className={cn(
              'text-gray-600',
              interactive && 'hover:scale-110 hover:text-yellow-500 transition-all cursor-pointer'
            )}
          >
            <Star className={sizeClasses[size]} />
          </button>
        ))}
      </div>
      
      {showValue && (
        <span className={cn('font-medium', textSizeClasses[size])}>
          {rating.toFixed(1)}
        </span>
      )}
      
      {totalReviews !== undefined && (
        <span className={cn('text-gray-500', textSizeClasses[size])}>
          ({totalReviews.toLocaleString()})
        </span>
      )}
    </div>
  );
}
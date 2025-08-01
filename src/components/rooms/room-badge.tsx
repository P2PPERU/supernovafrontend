import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface RoomBadgeProps {
  text: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
  icon?: React.ReactNode;
  pulse?: boolean;
}

export function RoomBadge({ 
  text, 
  variant = 'default', 
  className,
  icon,
  pulse = false 
}: RoomBadgeProps) {
  return (
    <Badge 
      variant={variant}
      className={cn(
        'gap-1 px-3 py-1',
        pulse && 'animate-pulse',
        className
      )}
    >
      {icon && <span className="w-3 h-3">{icon}</span>}
      {text}
    </Badge>
  );
}

// Variantes predefinidas para badges comunes
export function FeaturedBadge() {
  return (
    <RoomBadge 
      text="Destacado" 
      className="bg-poker-gold text-black"
      icon={<span>⭐</span>}
    />
  );
}

export function PopularBadge() {
  return (
    <RoomBadge 
      text="Más Popular" 
      className="bg-red-500 text-white"
      icon={<span>🔥</span>}
      pulse
    />
  );
}

export function NewBadge() {
  return (
    <RoomBadge 
      text="Nuevo" 
      className="bg-poker-green text-white"
      icon={<span>✨</span>}
    />
  );
}
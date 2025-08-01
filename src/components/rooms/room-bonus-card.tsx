import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Gift, DollarSign, Percent, Calendar, Zap } from 'lucide-react';

interface RoomBonusCardProps {
  title: string;
  amount?: number;
  percentage?: number;
  currency?: string;
  description?: string;
  type?: 'welcome' | 'deposit' | 'reload' | 'rakeback' | 'special';
  frequency?: string;
  featured?: boolean;
  className?: string;
}

export function RoomBonusCard({
  title,
  amount,
  percentage,
  currency = 'USD',
  description,
  type = 'welcome',
  frequency,
  featured = false,
  className
}: RoomBonusCardProps) {
  const icons = {
    welcome: Gift,
    deposit: DollarSign,
    reload: Calendar,
    rakeback: Percent,
    special: Zap
  };

  const colors = {
    welcome: 'from-poker-green to-green-600',
    deposit: 'from-poker-gold to-yellow-600',
    reload: 'from-poker-blue to-blue-600',
    rakeback: 'from-poker-purple to-purple-600',
    special: 'from-poker-red to-red-600'
  };

  const Icon = icons[type];

  return (
    <Card className={cn(
      'relative overflow-hidden transition-all hover:shadow-lg',
      featured && 'ring-2 ring-poker-gold',
      className
    )}>
      {featured && (
        <Badge className="absolute top-2 right-2 bg-poker-gold text-black">
          ⭐ Destacado
        </Badge>
      )}
      
      <div className={cn(
        'absolute inset-0 opacity-10 bg-gradient-to-br',
        colors[type]
      )} />
      
      <div className="relative p-6">
        <div className="flex items-start gap-4">
          <div className={cn(
            'p-3 rounded-lg bg-gradient-to-br text-white',
            colors[type]
          )}>
            <Icon className="h-6 w-6" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{title}</h3>
            
            <div className="text-2xl font-bold mb-2">
              {percentage && <span>{percentage}%</span>}
              {percentage && amount && <span className="mx-1">+</span>}
              {amount && (
                <span>
                  {currency === 'USD' ? '$' : currency}
                  {amount.toLocaleString()}
                </span>
              )}
            </div>
            
            {description && (
              <p className="text-sm text-gray-500 mb-2">{description}</p>
            )}
            
            {frequency && (
              <Badge variant="outline" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                {frequency}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

// Componente para mostrar múltiples bonos
export function RoomBonusList({ bonuses }: { bonuses: RoomBonusCardProps[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {bonuses.map((bonus, index) => (
        <RoomBonusCard key={index} {...bonus} />
      ))}
    </div>
  );
}
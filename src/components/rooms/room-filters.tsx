import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RoomCategory, RoomGameType, RoomFilters as RoomFiltersType } from '@/types/rooms.types';
import { RotateCcw, Filter, X, CheckCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface RoomFiltersProps {
  filters: RoomFiltersType;
  onFiltersChange: (filters: RoomFiltersType) => void;
  mobile?: boolean;
}

export function RoomFilters({ filters, onFiltersChange, mobile = false }: RoomFiltersProps) {
  const [localFilters, setLocalFilters] = useState<RoomFiltersType>(filters);

  const categories = [
    { value: RoomCategory.POPULAR, label: 'Más Populares', icon: '🔥' },
    { value: RoomCategory.HIGH_RAKEBACK, label: 'Mayor Rakeback', icon: '💰' },
    { value: RoomCategory.PREMIUM, label: 'Premium', icon: '👑' },
    { value: RoomCategory.BEGINNERS, label: 'Principiantes', icon: '🎯' },
    { value: RoomCategory.HIGH_STAKES, label: 'High Stakes', icon: '💎' },
  ];

  const gameTypes = [
    { value: RoomGameType.TEXAS_HOLDEM, label: 'Texas Hold\'em' },
    { value: RoomGameType.OMAHA, label: 'Omaha' },
    { value: RoomGameType.TOURNAMENTS, label: 'Torneos' },
    { value: RoomGameType.CASH_GAMES, label: 'Cash Games' },
    { value: RoomGameType.MIXED, label: 'Juegos Mixtos' },
  ];

  const handleFilterChange = (key: keyof RoomFiltersType, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleGameTypeToggle = (gameType: RoomGameType) => {
    const currentTypes = localFilters.gameTypes || [];
    const newTypes = currentTypes.includes(gameType)
      ? currentTypes.filter(t => t !== gameType)
      : [...currentTypes, gameType];
    handleFilterChange('gameTypes', newTypes);
  };

  const resetFilters = () => {
    const emptyFilters: RoomFiltersType = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const activeFiltersCount = Object.keys(localFilters).filter(key => {
    const value = localFilters[key as keyof RoomFiltersType];
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== '';
  }).length;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Categoría</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category.value}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors',
                'hover:bg-white/5',
                localFilters.category === category.value && 'bg-white/10'
              )}
            >
              <input
                type="radio"
                name="category"
                value={category.value}
                checked={localFilters.category === category.value}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="sr-only"
              />
              <span className="text-lg">{category.icon}</span>
              <span className="flex-1">{category.label}</span>
              {localFilters.category === category.value && (
                <CheckCircle className="h-4 w-4 text-poker-green" />
              )}
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Rakeback Range */}
      <div>
        <h3 className="font-semibold mb-3">Rakeback Mínimo</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>0%</span>
            <span className="font-bold text-poker-green">
              {localFilters.minRakeback || 0}%
            </span>
            <span>60%</span>
          </div>
          <Slider
            value={[localFilters.minRakeback || 0]}
            onValueChange={([value]) => handleFilterChange('minRakeback', value)}
            max={60}
            step={5}
            className="w-full"
          />
        </div>
      </div>

      <Separator />

      {/* Bonus Range */}
      <div>
        <h3 className="font-semibold mb-3">Bono Mínimo</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>$0</span>
            <span className="font-bold text-poker-gold">
              ${localFilters.minBonus || 0}
            </span>
            <span>$2000</span>
          </div>
          <Slider
            value={[localFilters.minBonus || 0]}
            onValueChange={([value]) => handleFilterChange('minBonus', value)}
            max={2000}
            step={100}
            className="w-full"
          />
        </div>
      </div>

      <Separator />

      {/* Game Types */}
      <div>
        <h3 className="font-semibold mb-3">Tipos de Juego</h3>
        <div className="space-y-2">
          {gameTypes.map((gameType) => (
            <label
              key={gameType.value}
              className="flex items-center gap-3 p-2 cursor-pointer hover:bg-white/5 rounded-lg"
            >
              <Checkbox
                checked={localFilters.gameTypes?.includes(gameType.value) || false}
                onCheckedChange={() => handleGameTypeToggle(gameType.value)}
              />
              <span className="text-sm">{gameType.label}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Reset Button */}
      <Button
        variant="outline"
        className="w-full"
        onClick={resetFilters}
        disabled={activeFiltersCount === 0}
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        Limpiar Filtros
        {activeFiltersCount > 0 && (
          <Badge className="ml-2" variant="secondary">
            {activeFiltersCount}
          </Badge>
        )}
      </Button>
    </div>
  );

  if (mobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Filtros</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount} activos</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FilterContent />
      </CardContent>
    </Card>
  );
}
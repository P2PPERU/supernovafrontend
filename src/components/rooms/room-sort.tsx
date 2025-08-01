import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';

interface RoomSortProps {
  value: string;
  onChange: (value: string) => void;
}

export function RoomSort({ value, onChange }: RoomSortProps) {
  const options = [
    { value: 'featured', label: 'Destacados primero' },
    { value: 'rating-desc', label: 'Mejor valorados' },
    { value: 'rating-asc', label: 'Menor valoración' },
    { value: 'players-desc', label: 'Más jugadores' },
    { value: 'players-asc', label: 'Menos jugadores' },
    { value: 'bonus-desc', label: 'Mayor bono' },
    { value: 'bonus-asc', label: 'Menor bono' },
    { value: 'rakeback-desc', label: 'Mayor rakeback' },
    { value: 'rakeback-asc', label: 'Menor rakeback' },
    { value: 'name-asc', label: 'Nombre A-Z' },
    { value: 'name-desc', label: 'Nombre Z-A' },
  ];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[200px]">
        <ArrowUpDown className="h-4 w-4 mr-2" />
        <SelectValue placeholder="Ordenar por..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Ordenar por</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
// app/roulette/page.tsx
import { Metadata } from 'next';
import { RouletteGame } from '@/components/roulette/rouletteGame';
import { RouletteHeader } from '@/components/roulette/roulette-header';
import { RouletteHistory } from '@/components/roulette/roulette-history';

export const metadata: Metadata = {
  title: 'Ruleta de Premios | Supernova Poker',
  description: 'Gira la ruleta y gana increíbles premios y bonificaciones',
};

export default function RoulettePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <RouletteHeader />
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <RouletteGame />
          </div>
          <div className="lg:col-span-1">
            <RouletteHistory />
          </div>
        </div>
      </div>
    </div>
  );
}
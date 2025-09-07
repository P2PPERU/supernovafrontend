// app/admin/roulette/page.tsx
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PrizesManager } from '@/components/admin/roulette/prizes-manager';
import { ValidationManager } from '@/components/admin/roulette/validation-manager';
import { CodesManager } from '@/components/admin/roulette/codes-manager';
import { RouletteStats } from '@/components/admin/roulette/roulette-stats';
import { Shield, Gift, Ticket, BarChart3 } from 'lucide-react';

export default function AdminRoulettePage() {
  const [activeTab, setActiveTab] = useState('prizes');

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            🎰 Administración de Ruleta
          </h1>
          <p className="text-gray-400">
            Gestiona premios, validaciones y códigos promocionales
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full bg-gray-900/50 backdrop-blur-lg p-1 rounded-xl">
            <TabsTrigger 
              value="prizes" 
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Gift className="w-4 h-4" />
              Premios
            </TabsTrigger>
            <TabsTrigger 
              value="validations"
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Shield className="w-4 h-4" />
              Validaciones
            </TabsTrigger>
            <TabsTrigger 
              value="codes"
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Ticket className="w-4 h-4" />
              Códigos
            </TabsTrigger>
            <TabsTrigger 
              value="stats"
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <BarChart3 className="w-4 h-4" />
              Estadísticas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prizes">
            <PrizesManager />
          </TabsContent>

          <TabsContent value="validations">
            <ValidationManager />
          </TabsContent>

          <TabsContent value="codes">
            <CodesManager />
          </TabsContent>

          <TabsContent value="stats">
            <RouletteStats />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
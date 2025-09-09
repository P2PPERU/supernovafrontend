// components/admin/roulette/prizes-manager.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, X, AlertCircle, Palette } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Prize {
  id: string;
  name: string;
  description: string;
  prize_type: string;
  prize_behavior: 'instant_cash' | 'bonus' | 'manual' | 'custom';
  prize_value: number;
  probability: number;
  color: string;
  position: number;
  is_active: boolean;
  custom_config?: any;
}

export function PrizesManager() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [totalProbability, setTotalProbability] = useState(0);

  // Obtener la URL base correcta
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchPrizes();
  }, []);

  useEffect(() => {
    const total = prizes.reduce((sum, prize) => sum + parseFloat(prize.probability.toString()), 0);
    setTotalProbability(total);
  }, [prizes]);

  const fetchPrizes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      // URL corregida: usar API_URL directamente sin duplicar /api
      const response = await fetch(`${API_URL}/roulette/prizes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setPrizes(data.prizes || []);
      } else {
        toast.error('Error al cargar premios');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrize = async (prize: Partial<Prize>) => {
    try {
      const token = localStorage.getItem('token');
      // URL corregida
      const url = prize.id 
        ? `${API_URL}/roulette/prizes/${prize.id}`
        : `${API_URL}/roulette/prizes`;
      
      const response = await fetch(url, {
        method: prize.id ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(prize)
      });

      if (response.ok) {
        toast.success(prize.id ? 'Premio actualizado' : 'Premio creado');
        fetchPrizes();
        setEditingPrize(null);
        setShowAddModal(false);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Error al guardar premio');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    }
  };

  const handleDeletePrize = async (prizeId: string) => {
    if (!confirm('¿Estás seguro de eliminar este premio?')) return;

    try {
      const token = localStorage.getItem('token');
      // URL corregida
      const response = await fetch(`${API_URL}/roulette/prizes/${prizeId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success('Premio eliminado');
        fetchPrizes();
      } else {
        toast.error('Error al eliminar premio');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    }
  };

  const handleAdjustProbabilities = async () => {
    try {
      const token = localStorage.getItem('token');
      const probabilities = prizes.map(p => ({
        prize_id: p.id,
        probability: p.probability
      }));

      // URL corregida
      const response = await fetch(`${API_URL}/roulette/prizes/adjust-probabilities`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ probabilities })
      });

      if (response.ok) {
        toast.success('Probabilidades actualizadas');
        fetchPrizes();
      } else {
        toast.error('Error al actualizar probabilidades');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    }
  };

  // Resto del componente igual...
  const PrizeForm = ({ prize, onSave, onCancel }: any) => {
    const [formData, setFormData] = useState<Partial<Prize>>(
      prize || {
        name: '',
        description: '',
        prize_type: 'bonus',
        prize_behavior: 'bonus',
        prize_value: 0,
        probability: 0,
        color: '#FF0000',
        position: 1,
        is_active: true
      }
    );

    return (
      <div className="bg-gray-800 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400">Nombre</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              placeholder="Nombre del premio"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Posición (1-20)</label>
            <input
              type="number"
              min="1"
              max="20"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Tipo</label>
            <select
              value={formData.prize_type}
              onChange={(e) => setFormData({ ...formData, prize_type: e.target.value })}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
            >
              <option value="none">Sin premio</option>
              <option value="bonus">Bonus</option>
              <option value="cash">Efectivo</option>
              <option value="spin">Giro extra</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400">Comportamiento</label>
            <select
              value={formData.prize_behavior}
              onChange={(e) => setFormData({ ...formData, prize_behavior: e.target.value as any })}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
            >
              <option value="manual">Manual</option>
              <option value="bonus">Crear Bonus</option>
              <option value="instant_cash">Efectivo Instantáneo</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400">Valor ($)</label>
            <input
              type="number"
              min="0"
              value={formData.prize_value}
              onChange={(e) => setFormData({ ...formData, prize_value: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Probabilidad (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={formData.probability}
              onChange={(e) => setFormData({ ...formData, probability: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-12 h-10 bg-gray-900 border border-gray-700 rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                placeholder="#FF0000"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4"
            />
            <label className="text-gray-400">Activo</label>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-400">Descripción</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
            rows={2}
            placeholder="Descripción del premio"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    );
  };

  // Resto del componente con el render...
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Gestión de Premios</h2>
            <p className="text-gray-400 mt-1">Configura los premios de la ruleta</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Agregar Premio
          </button>
        </div>

        {/* Probability Warning */}
        {Math.abs(totalProbability - 100) > 0.01 && (
          <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-300">
              Las probabilidades suman {totalProbability.toFixed(2)}%. Deben sumar exactamente 100%.
            </span>
            <button
              onClick={handleAdjustProbabilities}
              className="ml-auto px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors text-sm"
            >
              Ajustar Automáticamente
            </button>
          </div>
        )}
      </div>

      {/* Prizes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatePresence>
          {prizes.map((prize) => (
            <motion.div
              key={prize.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6"
            >
              {editingPrize?.id === prize.id ? (
                <PrizeForm
                  prize={prize}
                  onSave={handleSavePrize}
                  onCancel={() => setEditingPrize(null)}
                />
              ) : (
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg"
                        style={{ backgroundColor: prize.color }}
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-white">{prize.name}</h3>
                        <p className="text-sm text-gray-400">Posición: {prize.position}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingPrize(prize)}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleDeletePrize(prize.id)}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tipo:</span>
                      <span className="text-white">{prize.prize_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Valor:</span>
                      <span className="text-green-400 font-semibold">${prize.prize_value}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Probabilidad:</span>
                      <span className="text-yellow-400 font-semibold">{prize.probability}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Estado:</span>
                      <span className={prize.is_active ? 'text-green-400' : 'text-red-400'}>
                        {prize.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>

                  {prize.description && (
                    <p className="mt-3 text-sm text-gray-500">{prize.description}</p>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Prize Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gray-900 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Agregar Nuevo Premio</h3>
                <PrizeForm
                  prize={null}
                  onSave={handleSavePrize}
                  onCancel={() => setShowAddModal(false)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
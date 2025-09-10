// components/admin/roulette/validation-manager.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, CheckCircle, Users, Clock, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PendingUser {
  id: string;
  username: string;
  email: string;
  created_at: string;
  first_spin_demo_used: boolean;
  validated_for_spin: boolean;
  rouletteSpins?: Array<{
    prize: {
      name: string;
      prize_type: string;
      prize_value: number;
    };
  }>;
  parentAgent?: {
    username: string;
  };
}

export function ValidationManager() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    fetchPendingValidations();
  }, []);

  const fetchPendingValidations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/roulette/pending-validations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setPendingUsers(data.users);
      } else {
        toast.error('Error al cargar validaciones pendientes');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const validateUser = async (userId: string, notes?: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/roulette/validate/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notes: notes || 'Validado por administrador' })
      });

      if (response.ok) {
        toast.success('Usuario validado exitosamente');
        setPendingUsers(prev => prev.filter(u => u.id !== userId));
        setSelectedUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      } else {
        toast.error('Error al validar usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    }
  };

  const validateBatch = async () => {
    if (selectedUsers.size === 0) {
      toast.error('Selecciona al menos un usuario');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const userIds = Array.from(selectedUsers);
      
      const response = await fetch(`${API_URL}/roulette/validate-batch`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userIds })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        fetchPendingValidations();
        setSelectedUsers(new Set());
      } else {
        toast.error('Error al validar usuarios');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    }
  };

  const toggleSelectUser = (userId: string) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map(u => u.id)));
    }
  };

  const filteredUsers = pendingUsers.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h2 className="text-2xl font-bold text-white">Validaciones Pendientes</h2>
            <p className="text-gray-400 mt-1">
              {pendingUsers.length} usuario(s) esperando validación para giro real
            </p>
          </div>
          
          {selectedUsers.size > 0 && (
            <button
              onClick={validateBatch}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <CheckCircle className="w-5 h-5" />
              Validar Seleccionados ({selectedUsers.size})
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por username o email..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-12 text-center">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No hay validaciones pendientes
          </h3>
          <p className="text-gray-400">
            Todos los usuarios han sido validados o no hay nuevos registros
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Select All */}
          <div className="bg-gray-900/50 backdrop-blur-lg rounded-lg p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                onChange={selectAll}
                className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-white font-medium">Seleccionar todos</span>
            </label>
          </div>

          {/* User Cards */}
          {filteredUsers.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6"
            >
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={selectedUsers.has(user.id)}
                  onChange={() => toggleSelectUser(user.id)}
                  className="mt-1 w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                />
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{user.username}</h3>
                      <p className="text-gray-400">{user.email}</p>
                      
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="flex items-center gap-1 text-gray-500">
                          <Clock className="w-4 h-4" />
                          {new Date(user.created_at).toLocaleDateString()}
                        </span>
                        {user.parentAgent && (
                          <span className="text-gray-500">
                            Agente: <span className="text-purple-400">{user.parentAgent.username}</span>
                          </span>
                        )}
                      </div>

                      {user.rouletteSpins && user.rouletteSpins[0] && (
                        <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                          <p className="text-sm text-gray-400 mb-1">Premio Demo:</p>
                          <p className="text-white font-medium">
                            {user.rouletteSpins[0].prize.name}
                            {user.rouletteSpins[0].prize.prize_value > 0 && (
                              <span className="text-green-400 ml-2">
                                (${user.rouletteSpins[0].prize.prize_value})
                              </span>
                            )}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => validateUser(user.id)}
                        className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        title="Validar"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('¿Rechazar validación?')) {
                            setPendingUsers(prev => prev.filter(u => u.id !== user.id));
                            toast.success('Validación rechazada');
                          }
                        }}
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        title="Rechazar"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
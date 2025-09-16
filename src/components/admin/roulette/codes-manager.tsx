// components/admin/roulette/codes-manager.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Copy, Trash2, Download, Filter, Ticket, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface RouletteCode {
  id: string;
  code: string;
  description: string;
  is_active: boolean;
  expires_at: string | null;
  used_at: string | null;
  created_at: string;
  creator?: {
    username: string;
  };
  usedBy?: {
    username: string;
  };
}

export function CodesManager() {
  const [codes, setCodes] = useState<RouletteCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'used' | 'expired'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hideUsedCodes, setHideUsedCodes] = useState(true); // Nueva state para ocultar códigos usados

  // IMPORTANTE: Obtener la URL base correcta
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchCodes();
  }, [filter, page]);

  const fetchCodes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      // Cambiar limit a 10 códigos por página
      const response = await fetch(
        `${API_URL}/roulette/codes?status=${filter}&page=${page}&limit=10`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCodes(data.codes || []);
        setTotalPages(data.totalPages || 1);
      } else {
        toast.error('Error al cargar códigos');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const createCodes = async (data: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/roulette/codes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`${result.codes?.length || 1} código(s) creado(s)`);
        fetchCodes();
        setShowCreateModal(false);
        
        // Copiar códigos al portapapeles
        if (result.codes && result.codes.length > 0) {
          const codesText = result.codes.map((c: any) => c.code).join('\n');
          navigator.clipboard.writeText(codesText);
          toast.success('Códigos copiados al portapapeles');
        }
      } else {
        toast.error('Error al crear códigos');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    }
  };

  const deleteCode = async (codeId: string) => {
    if (!confirm('¿Eliminar este código?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/roulette/codes/${codeId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success('Código eliminado');
        fetchCodes();
      } else {
        toast.error('Error al eliminar código');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    }
  };

  // Filtrar códigos para ocultar los usados si está activado
  const filteredCodes = hideUsedCodes 
    ? codes.filter(code => !code.used_at) 
    : codes;

  const exportCodes = () => {
    const activeCodesText = codes
      .filter(c => c.is_active && !c.used_at)
      .map(c => `${c.code} - ${c.description || 'Sin descripción'}`)
      .join('\n');
    
    const blob = new Blob([activeCodesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codigos-ruleta-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Códigos exportados');
  };

  const CreateCodeModal = () => {
    const [formData, setFormData] = useState({
      description: '',
      quantity: 1,
      expiresIn: 30
    });

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
        onClick={() => setShowCreateModal(false)}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="w-full max-w-md bg-gray-900 rounded-2xl p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-bold text-white mb-4">Crear Códigos de Ruleta</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Descripción</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                placeholder="Ej: Promoción Navidad 2024"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Cantidad de códigos</label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Días de validez</label>
              <input
                type="number"
                min="1"
                max="365"
                value={formData.expiresIn}
                onChange={(e) => setFormData({ ...formData, expiresIn: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => createCodes(formData)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Crear Códigos
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const getStatusBadge = (code: RouletteCode) => {
    if (code.used_at) {
      return <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded-full">Usado</span>;
    }
    if (code.expires_at && new Date(code.expires_at) < new Date()) {
      return <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full">Expirado</span>;
    }
    if (code.is_active) {
      return <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">Activo</span>;
    }
    return <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded-full">Inactivo</span>;
  };

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
            <h2 className="text-2xl font-bold text-white">Gestión de Códigos</h2>
            <p className="text-gray-400 mt-1">Administra los códigos promocionales de la ruleta</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={exportCodes}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              Exportar
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Crear Códigos
            </button>
          </div>
        </div>

        {/* Filters y toggle para ocultar códigos usados */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {(['all', 'active', 'used', 'expired'] as const).map((status) => (
              <button
                key={status}
                onClick={() => {
                  setFilter(status);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === status
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {status === 'all' && 'Todos'}
                {status === 'active' && 'Activos'}
                {status === 'used' && 'Usados'}
                {status === 'expired' && 'Expirados'}
              </button>
            ))}
          </div>

          {/* Toggle para ocultar/mostrar códigos usados */}
          <button
            onClick={() => setHideUsedCodes(!hideUsedCodes)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              hideUsedCodes 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
            title={hideUsedCodes ? 'Mostrar códigos usados' : 'Ocultar códigos usados'}
          >
            {hideUsedCodes ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="text-sm">
              {hideUsedCodes ? 'Mostrar usados' : 'Ocultar usados'}
            </span>
          </button>
        </div>
      </div>

      {/* Codes Table */}
      <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Creado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Usado Por
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredCodes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    {hideUsedCodes && codes.some(code => code.used_at) 
                      ? 'No hay códigos disponibles (códigos usados ocultos)'
                      : 'No hay códigos disponibles'
                    }
                  </td>
                </tr>
              ) : (
                filteredCodes.map((code) => (
                  <tr key={code.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-purple-400" />
                        <span className="text-white font-mono font-medium">{code.code}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(code.code);
                            toast.success('Código copiado');
                          }}
                          className="p-1 hover:bg-gray-700 rounded transition-colors"
                        >
                          <Copy className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                      {code.description || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(code)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                      {new Date(code.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                      {code.usedBy ? (
                        <span className="text-purple-400">{code.usedBy.username}</span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {!code.used_at && (
                        <button
                          onClick={() => deleteCode(code.id)}
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination mejorada */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-800/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded transition-colors"
              >
                ««
              </button>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded transition-colors"
              >
                ‹ Anterior
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-gray-400">
                Página {page} de {totalPages}
              </span>
              <span className="text-gray-500 text-sm">
                (10 códigos por página)
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded transition-colors"
              >
                Siguiente ›
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded transition-colors"
              >
                »»
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && <CreateCodeModal />}
    </div>
  );
}
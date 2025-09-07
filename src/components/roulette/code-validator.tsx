// components/roulette/code-validator.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Ticket, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface CodeValidatorProps {
  onSuccess: () => void;
}

export function CodeValidator({ onSuccess }: CodeValidatorProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      toast.error('Por favor ingresa un código');
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/roulette/validate-code`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: code.toUpperCase() })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message, {
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          duration: 4000
        });
        setCode('');
        onSuccess();
      } else {
        toast.error(data.message || 'Código inválido', {
          icon: <XCircle className="w-5 h-5 text-red-500" />
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al validar el código');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 rounded-xl p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <Ticket className="w-6 h-6 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">
          ¿Tienes un código promocional?
        </h3>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="INGRESA TU CÓDIGO"
          className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors"
          maxLength={20}
          disabled={loading}
        />
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            loading
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-500 hover:to-orange-600'
          }`}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-900"></div>
          ) : (
            'VALIDAR'
          )}
        </motion.button>
      </form>
      
      <p className="text-gray-400 text-sm mt-3">
        Los códigos te dan giros adicionales para ganar más premios
      </p>
    </motion.div>
  );
}
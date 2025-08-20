// hooks/useDemoSpins.ts
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const DEMO_SPINS_KEY = 'supernova_demo_spins';
const MAX_DEMO_SPINS_PER_DAY = 10; // Máximo de giros demo permitidos por día

interface DemoSpinsData {
  count: number;
  lastReset: number;
  date: string; // Para verificar si es el mismo día
}

export function useDemoSpins() {
  const [demoSpinsUsed, setDemoSpinsUsed] = useState(0);
  const [demoSpinsRemaining, setDemoSpinsRemaining] = useState(MAX_DEMO_SPINS_PER_DAY);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  // Obtener fecha actual en formato YYYY-MM-DD
  const getCurrentDate = (): string => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  // Cargar datos del localStorage
  const loadDemoSpins = (): DemoSpinsData => {
    // Verificar si estamos en el cliente (navegador)
    if (typeof window === 'undefined') {
      return { 
        count: 0, 
        lastReset: Date.now(),
        date: getCurrentDate()
      };
    }
    
    try {
      const stored = localStorage.getItem(DEMO_SPINS_KEY);
      if (stored) {
        const data: DemoSpinsData = JSON.parse(stored);
        const currentDate = getCurrentDate();
        
        // Si es un nuevo día, resetear los contadores
        if (data.date !== currentDate) {
          const newData = { 
            count: 0, 
            lastReset: Date.now(),
            date: currentDate 
          };
          localStorage.setItem(DEMO_SPINS_KEY, JSON.stringify(newData));
          return newData;
        }
        
        return data;
      }
    } catch (error) {
      console.error('Error loading demo spins:', error);
    }
    
    // Datos por defecto
    const defaultData = { 
      count: 0, 
      lastReset: Date.now(),
      date: getCurrentDate()
    };
    
    // Solo intentar guardar si estamos en el cliente
    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_SPINS_KEY, JSON.stringify(defaultData));
    }
    
    return defaultData;
  };

  // Guardar datos en localStorage
  const saveDemoSpins = (data: DemoSpinsData) => {
    // Solo guardar si estamos en el cliente
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(DEMO_SPINS_KEY, JSON.stringify(data));
      setLastUpdateTime(Date.now());
    } catch (error) {
      console.error('Error saving demo spins:', error);
    }
  };

  // Usar un giro demo
  const useDemoSpin = (): boolean => {
    const data = loadDemoSpins();
    
    if (data.count >= MAX_DEMO_SPINS_PER_DAY) {
      toast.error(
        `Has alcanzado el límite de ${MAX_DEMO_SPINS_PER_DAY} giros demo por día`,
        {
          description: 'Los giros se reiniciarán mañana a las 00:00'
        }
      );
      return false;
    }
    
    const newData = {
      count: data.count + 1,
      lastReset: data.lastReset,
      date: data.date
    };
    
    saveDemoSpins(newData);
    setDemoSpinsUsed(newData.count);
    setDemoSpinsRemaining(MAX_DEMO_SPINS_PER_DAY - newData.count);
    
    // Mostrar mensaje informativo
    if (newData.count === MAX_DEMO_SPINS_PER_DAY) {
      toast.info('¡Has usado tu último giro demo del día!', {
        description: 'Valídate para obtener giros reales o espera hasta mañana'
      });
    } else if (newData.count === MAX_DEMO_SPINS_PER_DAY - 1) {
      toast.warning(`Te queda 1 giro demo para hoy`);
    } else {
      toast.success(`Giro demo usado. Te quedan ${MAX_DEMO_SPINS_PER_DAY - newData.count} giros demo hoy`);
    }
    
    return true;
  };

  // Verificar si hay giros demo disponibles
  const hasDemoSpinsAvailable = (): boolean => {
    // Si estamos en el servidor, retornar true por defecto
    if (typeof window === 'undefined') return true;
    
    const data = loadDemoSpins();
    return data.count < MAX_DEMO_SPINS_PER_DAY;
  };

  // Obtener tiempo restante para reset (hasta medianoche)
  const getTimeUntilReset = (): number => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    return tomorrow.getTime() - now.getTime();
  };

  // Formatear tiempo restante
  const formatTimeRemaining = (): string => {
    const ms = getTimeUntilReset();
    if (ms <= 0) return 'Reiniciando...';
    
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  // Resetear giros demo manualmente (para testing)
  const resetDemoSpins = () => {
    const newData = { 
      count: 0, 
      lastReset: Date.now(),
      date: getCurrentDate()
    };
    saveDemoSpins(newData);
    setDemoSpinsUsed(0);
    setDemoSpinsRemaining(MAX_DEMO_SPINS_PER_DAY);
    toast.success('Giros demo reiniciados');
  };

  // Cargar datos iniciales
  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return;
    
    const data = loadDemoSpins();
    setDemoSpinsUsed(data.count);
    setDemoSpinsRemaining(MAX_DEMO_SPINS_PER_DAY - data.count);
  }, [lastUpdateTime]);

  // Actualizar cada minuto para refrescar el tiempo restante
  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return;
    
    const interval = setInterval(() => {
      const data = loadDemoSpins();
      const currentDate = getCurrentDate();
      
      // Si cambió el día, resetear automáticamente
      if (data.date !== currentDate) {
        resetDemoSpins();
      }
    }, 60000); // Verificar cada minuto

    return () => clearInterval(interval);
  }, []);

  return {
    demoSpinsUsed,
    demoSpinsRemaining,
    maxDemoSpins: MAX_DEMO_SPINS_PER_DAY,
    useDemoSpin,
    hasDemoSpinsAvailable,
    getTimeUntilReset,
    formatTimeRemaining,
    resetDemoSpins, // Solo para desarrollo/testing
  };
}
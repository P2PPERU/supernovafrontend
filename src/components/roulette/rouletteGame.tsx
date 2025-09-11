'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  Gamepad2, Gift, Star, Zap, Trophy, Crown, 
  Sparkles, TrendingUp, Lock, Unlock, Volume2, VolumeX,
  Ticket, CheckCircle, AlertCircle, RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Prize {
  id: string;
  name: string;
  description: string;
  prize_type: string;
  prize_value: number;
  probability: number;
  color: string;
  position: number;
  is_active: boolean;
}

interface UserStatus {
  has_demo_available: boolean;
  has_real_available: boolean;
  demo_spin_done: boolean;
  real_spin_done: boolean;
  is_validated: boolean;
  total_spins: number;
  available_bonus_spins: number;
  demo_prize?: any;
}

export function RouletteGame() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWinModal, setShowWinModal] = useState(false);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [continuousSpinning, setContinuousSpinning] = useState(false);
  
  // Estados para código promocional
  const [promoCode, setPromoCode] = useState('');
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [codeMessage, setCodeMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    fetchPrizes();
    fetchUserStatus();
  }, []);

  const fetchPrizes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/roulette/prizes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        const activePrizes = (data.prizes || [])
          .filter((p: Prize) => p.is_active)
          .sort((a: Prize, b: Prize) => a.position - b.position);
        
        if (activePrizes.length === 0) {
          toast.error('No hay premios configurados. Contacta al administrador.');
          console.error('No hay premios activos');
        } else {
          console.log('✅ Premios cargados:', activePrizes.length, 'premios activos');
        }
        
        setPrizes(activePrizes);
      } else {
        toast.error('Error al cargar los premios');
      }
    } catch (error) {
      console.error('Error fetching prizes:', error);
      toast.error('Error al cargar los premios');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/roulette/my-status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Estado del usuario actualizado:', data);
        
        if (data.status) {
          setUserStatus(data.status);
          return data.status;
        } else {
          setUserStatus(data);
          return data;
        }
      }
    } catch (error) {
      console.error('Error fetching user status:', error);
    }
    return null;
  };

  const playSound = (type: 'spin' | 'win' | 'surprise') => {
    if (!soundEnabled) return;
    // Aquí puedes agregar la lógica de sonido si lo deseas
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#9333ea', '#ec4899', '#f59e0b', '#10b981']
      });
      
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#9333ea', '#ec4899', '#f59e0b', '#10b981']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  // Función para cerrar el modal y detener el giro continuo
  const handleCloseWinModal = () => {
    setShowWinModal(false);
    setContinuousSpinning(false);
    
    // Detener la ruleta en una posición aleatoria después de cerrar
    setTimeout(() => {
      const randomStop = Math.random() * 360;
      setRotation(randomStop);
      setWonPrize(null);
      setIsSpinning(false);
    }, 100);
  };

  const handleSpin = async () => {
    if (isSpinning) return;

    const hasSpins = userStatus?.has_demo_available ||
      userStatus?.has_real_available ||
      (userStatus?.available_bonus_spins && userStatus.available_bonus_spins > 0);

    if (!hasSpins) {
      toast.error('No tienes giros disponibles. Usa un código promocional para obtener más giros.');
      return;
    }

    setIsSpinning(true);
    setContinuousSpinning(true);
    playSound('spin');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/roulette/spin`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();

        console.log('🎰 Resultado del backend:', {
          prizeId: result.spin?.prize?.id,
          prizeName: result.spin?.prize?.name,
          prizePosition: result.spin?.prize?.position
        });

        // Búsqueda del premio por ID
        let winningPrizeIndex = -1;
        let prizeFound: Prize | null = null;

        // Buscar por ID primero
        if (result.spin?.prize?.id) {
          winningPrizeIndex = prizes.findIndex(p =>
            p.id === result.spin.prize.id ||
            p.id.toString() === result.spin.prize.id.toString()
          );

          if (winningPrizeIndex !== -1) {
            prizeFound = prizes[winningPrizeIndex];
            console.log('✅ Premio encontrado por ID en índice:', winningPrizeIndex);
          }
        }

        // Fallback: buscar por nombre
        if (winningPrizeIndex === -1 && result.spin?.prize?.name) {
          winningPrizeIndex = prizes.findIndex(p =>
            p.name.toLowerCase().trim() === result.spin.prize.name.toLowerCase().trim()
          );

          if (winningPrizeIndex !== -1) {
            prizeFound = prizes[winningPrizeIndex];
            console.log('✅ Premio encontrado por nombre en índice:', winningPrizeIndex);
          }
        }

        // Usar el premio del backend directamente si no se encuentra
        const finalPrize = prizeFound || result.spin.prize;

        // Tiempo más corto para mostrar el premio (2.5 segundos de giro rápido)
        setTimeout(async () => {
          playSound('surprise');
          setWonPrize(finalPrize);
          setShowWinModal(true);
          
          if (finalPrize.prize_value > 0) {
            triggerConfetti();
          }
          
          playSound('win');
          await fetchUserStatus();
        }, 2500); // Reducido de 4500 a 2500ms

      } else {
        const error = await response.json();
        toast.error(error.message || 'Error al girar la ruleta');
        setIsSpinning(false);
        setContinuousSpinning(false);
      }
    } catch (error) {
      console.error('Error spinning:', error);
      toast.error('Error de conexión');
      setIsSpinning(false);
      setContinuousSpinning(false);
    }
  };

  const handleValidateCode = async () => {
    if (!promoCode) {
      toast.error('Por favor ingresa un código');
      return;
    }
    
    setIsValidatingCode(true);
    setCodeMessage(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/roulette/validate-code`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: promoCode.toUpperCase() })
      });

      const data = await response.json();
      console.log('Respuesta de validación de código:', data);
      
      if (response.ok) {
        setCodeMessage({ 
          type: 'success', 
          text: data.message || '¡Código válido! Has recibido un giro adicional' 
        });
        setPromoCode('');
        
        const newStatus = await fetchUserStatus();
        console.log('Estado actualizado después del código:', newStatus);
        
        if (newStatus && newStatus.available_bonus_spins > 0) {
          toast.success(`¡Tienes ${newStatus.available_bonus_spins} giro(s) bonus disponible(s)!`);
        }
        
        setTimeout(() => setCodeMessage(null), 5000);
        
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 }
        });
      } else {
        setCodeMessage({ 
          type: 'error', 
          text: data.message || 'Código inválido o ya utilizado' 
        });
        
        setTimeout(() => setCodeMessage(null), 5000);
      }
    } catch (error) {
      console.error('Error validating code:', error);
      setCodeMessage({ 
        type: 'error', 
        text: 'Error al validar el código. Intenta nuevamente.' 
      });
      setTimeout(() => setCodeMessage(null), 5000);
    } finally {
      setIsValidatingCode(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 md:w-20 md:h-20"
        >
          <Sparkles className="w-full h-full text-purple-500" />
        </motion.div>
      </div>
    );
  }

  const prizeAngle = prizes.length > 0 ? 360 / prizes.length : 0;
  
  const hasSpinsAvailable = !!(
    userStatus?.has_demo_available || 
    userStatus?.has_real_available || 
    (userStatus?.available_bonus_spins && userStatus.available_bonus_spins > 0)
  );

  const totalAvailableSpins = 
    (userStatus?.has_demo_available ? 1 : 0) +
    (userStatus?.has_real_available ? 1 : 0) +
    (userStatus?.available_bonus_spins || 0);

  // Componente de patrón de cartas sutil
  const CardPattern = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
      <div className="absolute inset-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 40px,
              rgba(255,255,255,0.02) 40px,
              rgba(255,255,255,0.02) 80px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 40px,
              rgba(255,255,255,0.02) 40px,
              rgba(255,255,255,0.02) 80px
            )
          `
        }}
      />
      {/* Símbolos de cartas muy sutiles - responsive */}
      <div className="absolute top-1/4 left-1/4 text-white/3 text-3xl md:text-6xl rotate-12">♠</div>
      <div className="absolute top-1/4 right-1/4 text-white/3 text-3xl md:text-6xl -rotate-12">♥</div>
      <div className="absolute bottom-1/4 left-1/4 text-white/3 text-3xl md:text-6xl -rotate-12">♦</div>
      <div className="absolute bottom-1/4 right-1/4 text-white/3 text-3xl md:text-6xl rotate-12">♣</div>
    </div>
  );

  return (
    <div className="relative">
      {/* Contenedor principal */}
      <div className="relative bg-gray-900/40 backdrop-blur-sm rounded-2xl md:rounded-3xl p-3 md:p-6 shadow-2xl border border-gray-700/50">
        <CardPattern />
        
        {/* Header responsive */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-3">
          <div className="flex items-center gap-2 md:gap-3 flex-1">
            <div className="p-2 md:p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg md:rounded-xl shadow-lg">
              <Trophy className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg md:text-2xl font-bold text-white flex items-center gap-2 flex-wrap">
                Ruleta de Premios 
                <span className="text-yellow-400 text-base md:text-xl">♠</span>
              </h2>
              <p className="text-xs md:text-sm text-gray-400 leading-tight">
                {hasSpinsAvailable 
                  ? `Tienes ${totalAvailableSpins} giro(s) disponible(s)` 
                  : 'Sin giros disponibles'}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors"
              title={soundEnabled ? "Desactivar sonido" : "Activar sonido"}
            >
              {soundEnabled ? 
                <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-gray-400" /> : 
                <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              }
            </button>
            
            <button
              onClick={() => {
                setLoading(true);
                Promise.all([fetchPrizes(), fetchUserStatus()]).then(() => {
                  toast.success('Datos actualizados');
                });
              }}
              className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors"
              title="Recargar datos"
            >
              <RefreshCw className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Stats Cards responsive */}
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-blue-600/20 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 text-white border border-blue-500/30"
          >
            <div className="flex items-center justify-between mb-1 md:mb-2">
              <Gamepad2 className="w-4 h-4 md:w-6 md:h-6" />
              {userStatus?.has_demo_available && (
                <span className="text-xs bg-blue-500/30 px-1.5 py-0.5 md:px-2 md:py-1 rounded-full">Disponible</span>
              )}
            </div>
            <p className="text-xs md:text-sm opacity-90">Giro Demo</p>
            <p className="text-lg md:text-2xl font-bold">{userStatus?.has_demo_available ? '1' : '0'}</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-green-600/20 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 text-white border border-green-500/30"
          >
            <div className="flex items-center justify-between mb-1 md:mb-2">
              <Star className="w-4 h-4 md:w-6 md:h-6" />
              {userStatus?.has_real_available && (
                <span className="text-xs bg-green-500/30 px-1.5 py-0.5 md:px-2 md:py-1 rounded-full">Disponible</span>
              )}
            </div>
            <p className="text-xs md:text-sm opacity-90">Giro Real</p>
            <p className="text-lg md:text-2xl font-bold">{userStatus?.has_real_available ? '1' : '0'}</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-purple-600/20 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 text-white border border-purple-500/30"
          >
            <div className="flex items-center justify-between mb-1 md:mb-2">
              <Gift className="w-4 h-4 md:w-6 md:h-6" />
              {userStatus?.available_bonus_spins && userStatus.available_bonus_spins > 0 && (
                <span className="text-xs bg-purple-500/30 px-1.5 py-0.5 md:px-2 md:py-1 rounded-full">x{userStatus.available_bonus_spins}</span>
              )}
            </div>
            <p className="text-xs md:text-sm opacity-90">Giros Bonus</p>
            <p className="text-lg md:text-2xl font-bold">{userStatus?.available_bonus_spins || 0}</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-orange-600/20 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 text-white border border-orange-500/30"
          >
            <div className="flex items-center justify-between mb-1 md:mb-2">
              <TrendingUp className="w-4 h-4 md:w-6 md:h-6" />
            </div>
            <p className="text-xs md:text-sm opacity-90">Total Giros</p>
            <p className="text-lg md:text-2xl font-bold">{userStatus?.total_spins || 0}</p>
          </motion.div>
        </div>

        {/* Código Promocional responsive */}
        <div className="relative z-10 mb-4 md:mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-gray-700/50"
          >
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-base md:text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <Ticket className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                  ¿Tienes un código promocional?
                </h3>
                <p className="text-xs md:text-sm text-gray-400">
                  Ingresa tu código para obtener giros adicionales
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && handleValidateCode()}
                  placeholder="CÓDIGO-PROMO"
                  className="px-4 py-2.5 md:py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors flex-1 text-sm md:text-base"
                  disabled={isValidatingCode}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleValidateCode}
                  disabled={!promoCode || isValidatingCode}
                  className={`px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-sm md:text-base min-w-[120px] ${
                    !promoCode || isValidatingCode
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg'
                  }`}
                >
                  {isValidatingCode ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      <span className="hidden sm:inline">Validando...</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4" />
                      Validar
                    </>
                  )}
                </motion.button>
              </div>
            </div>
            
            <AnimatePresence>
              {codeMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mt-4 p-3 rounded-lg flex items-start gap-2 ${
                    codeMessage.type === 'success' 
                      ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                      : 'bg-red-500/20 border border-red-500/50 text-red-400'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {codeMessage.type === 'success' ? (
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 md:w-5 md:h-5" />
                    )}
                  </div>
                  <span className="text-xs md:text-sm font-medium leading-tight">{codeMessage.text}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Ruleta responsive */}
        <div className="relative z-10 mb-4 md:mb-6">
          {/* Pointer responsive */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 md:-translate-y-4 z-20">
            <motion.div
              animate={isSpinning ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5, repeat: isSpinning ? Infinity : 0 }}
              className="relative"
            >
              <div className="w-0 h-0 border-l-[20px] md:border-l-[30px] border-l-transparent border-r-[20px] md:border-r-[30px] border-r-transparent border-b-[40px] md:border-b-[60px] border-b-yellow-400 drop-shadow-lg" />
              <div className="absolute top-5 md:top-8 left-1/2 transform -translate-x-1/2">
                <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-yellow-300 animate-pulse" />
              </div>
            </motion.div>
          </div>

          {/* Wheel Container responsive */}
          <div className="relative w-full max-w-sm md:max-w-lg mx-auto aspect-square p-2 md:p-4">
            {/* Borde exterior con efecto de velocidad */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-0.5 md:p-1">
              <div className="w-full h-full rounded-full bg-gray-900" />
            </div>
            
            {/* Efecto de velocidad cuando gira */}
            {continuousSpinning && (
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(147, 51, 234, 0.3)',
                    '0 0 40px rgba(236, 72, 153, 0.5)',
                    '0 0 60px rgba(251, 191, 36, 0.7)',
                    '0 0 40px rgba(236, 72, 153, 0.5)',
                    '0 0 20px rgba(147, 51, 234, 0.3)',
                  ]
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            )}
            
            <motion.div
              className="absolute inset-2 md:inset-4 rounded-full overflow-hidden shadow-2xl"
              style={{
                boxShadow: '0 0 30px rgba(147, 51, 234, 0.3), inset 0 0 30px rgba(0,0,0,0.5)',
                filter: continuousSpinning ? 'blur(1px) md:blur(2px)' : 'none',
                transform: `rotate(${rotation}deg)`,
              }}
              animate={continuousSpinning ? { rotate: 360 } : {}}
              transition={
                continuousSpinning 
                  ? { 
                      duration: 0.5,
                      repeat: Infinity,
                      ease: "linear"
                    }
                  : undefined
              }
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {prizes.map((prize, index) => {
                  const startAngle = (index * prizeAngle * Math.PI) / 180;
                  const endAngle = ((index + 1) * prizeAngle * Math.PI) / 180;
                  const largeArcFlag = prizeAngle > 180 ? 1 : 0;

                  const x1 = 50 + 50 * Math.cos(startAngle);
                  const y1 = 50 + 50 * Math.sin(startAngle);
                  const x2 = 50 + 50 * Math.cos(endAngle);
                  const y2 = 50 + 50 * Math.sin(endAngle);

                  const textRadius = 32;
                  const textAngle = (startAngle + endAngle) / 2;
                  const textX = 50 + textRadius * Math.cos(textAngle);
                  const textY = 50 + textRadius * Math.sin(textAngle);

                  return (
                    <g key={prize.id}>
                      <path
                        d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                        fill={prize.color}
                        stroke="#2a2a2a"
                        strokeWidth="0.5"
                      />
                      
                      <foreignObject x={textX - 15} y={textY - 15} width="30" height="30">
                        <div className="flex items-center justify-center w-full h-full">
                          {prize.prize_value > 100 ? (
                            <Crown className="w-3 h-3 md:w-5 md:h-5 text-yellow-300 drop-shadow-lg" />
                          ) : prize.prize_value > 0 ? (
                            <Star className="w-3 h-3 md:w-4 md:h-4 text-white drop-shadow-lg" />
                          ) : (
                            <Gift className="w-3 h-3 md:w-4 md:h-4 text-white/70 drop-shadow-lg" />
                          )}
                        </div>
                      </foreignObject>
                      
                      <text
                        x={textX}
                        y={textY + 10}
                        fill="white"
                        fontSize="2"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="drop-shadow-lg select-none"
                        style={{ 
                          paintOrder: 'stroke',
                          stroke: '#000',
                          strokeWidth: '0.5px'
                        }}
                      >
                        {prize.name.length > 8 ? prize.name.substring(0, 8) + '...' : prize.name}
                      </text>
                    </g>
                  );
                })}
                
                <defs>
                  <radialGradient id="centerGradient">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#581c87" />
                  </radialGradient>
                  <filter id="centerShadow">
                    <feDropShadow dx="0" dy="0" stdDeviation="3" floodOpacity="0.5"/>
                  </filter>
                </defs>
                
                <circle cx="50" cy="50" r="12" fill="url(#centerGradient)" filter="url(#centerShadow)" />
                <circle cx="50" cy="50" r="10" fill="none" stroke="#fbbf24" strokeWidth="0.5" opacity="0.5" />
              </svg>
            </motion.div>

            {/* Spin Button responsive */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
              <motion.button
                onClick={handleSpin}
                disabled={isSpinning || !hasSpinsAvailable}
                whileHover={!isSpinning && hasSpinsAvailable ? { scale: 1.05 } : {}}
                whileTap={!isSpinning && hasSpinsAvailable ? { scale: 0.95 } : {}}
                className={`w-20 h-20 md:w-28 md:h-28 rounded-full font-bold text-white transition-all ${
                  isSpinning || !hasSpinsAvailable
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600 hover:shadow-lg hover:shadow-purple-500/50'
                }`}
                style={{
                  boxShadow: !isSpinning && hasSpinsAvailable ? '0 0 20px rgba(168, 85, 247, 0.4)' : ''
                }}
              >
                <div className="flex flex-col items-center justify-center">
                  {isSpinning ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Zap className="w-5 h-5 md:w-8 md:h-8" />
                    </motion.div>
                  ) : !hasSpinsAvailable ? (
                    <Lock className="w-5 h-5 md:w-8 md:h-8" />
                  ) : (
                    <Zap className="w-5 h-5 md:w-8 md:h-8" />
                  )}
                  <span className="text-xs md:text-sm mt-1 font-bold leading-tight">
                    {isSpinning ? 'GIRANDO' : !hasSpinsAvailable ? 'SIN GIROS' : 'GIRAR'}
                  </span>
                  {hasSpinsAvailable && !isSpinning && (
                    <span className="text-[10px] md:text-xs opacity-80 leading-none">
                      {totalAvailableSpins} disp.
                    </span>
                  )}
                </div>
              </motion.button>
            </div>

            {/* Efecto de partículas cuando gira rápido */}
            {continuousSpinning && (
              <>
                <div className="absolute inset-0 rounded-full pointer-events-none">
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 md:border-4 border-transparent border-t-yellow-400"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 0.3, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                <div className="absolute inset-0 rounded-full pointer-events-none">
                  <motion.div
                    className="absolute inset-0 rounded-full border border-2 border-transparent border-b-purple-400"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.4, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                <div className="absolute inset-0 rounded-full pointer-events-none">
                  <motion.div
                    className="absolute inset-0 rounded-full border border-2 border-transparent border-l-pink-400"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Prize Table responsive */}
        <div className="relative z-10 bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-gray-700/50">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <Trophy className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
            <h3 className="text-white font-semibold text-sm md:text-base">Tabla de Premios</h3>
            <span className="ml-auto text-xs text-gray-400">
              {prizes.length} premios
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 md:max-h-64 overflow-y-auto custom-scrollbar">
            {prizes.map((prize) => (
              <motion.div
                key={prize.id}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-2 p-2 md:p-3 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all"
              >
                <div
                  className="w-3 h-3 md:w-4 md:h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: prize.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-white font-medium truncate">{prize.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {prize.prize_value > 0 && (
                      <span className="text-xs text-green-400 font-bold">${prize.prize_value}</span>
                    )}
                    <span className="text-xs text-gray-500">
                      {prize.probability}%
                    </span>
                  </div>
                </div>
                {prize.prize_value > 100 && (
                  <Crown className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 flex-shrink-0" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Win Modal responsive */}
        <AnimatePresence>
          {showWinModal && wonPrize && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={handleCloseWinModal}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-sm md:max-w-md w-full text-center border border-purple-500/50 shadow-2xl mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Efecto de brillo animado */}
                <div className="absolute inset-0 rounded-2xl md:rounded-3xl overflow-hidden">
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-purple-600/20"
                    animate={{
                      opacity: [0.2, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                  />
                </div>
                
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-5xl md:text-7xl mb-3 md:mb-4"
                  >
                    {wonPrize.prize_value > 100 ? '👑' : wonPrize.prize_value > 0 ? '🎉' : '🎁'}
                  </motion.div>
                  
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl md:text-4xl font-bold text-white mb-2"
                  >
                    ¡INCREÍBLE!
                  </motion.h2>
                  
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg md:text-xl text-gray-300 mb-4 md:mb-6"
                  >
                    ¡Has ganado!
                  </motion.p>
                  
                  <motion.div
                    initial={{ scale: 0, rotate: 360 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    className="inline-block px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl text-white font-bold text-lg md:text-2xl mb-3 md:mb-4 shadow-lg relative"
                    style={{ 
                      backgroundColor: wonPrize.color,
                      boxShadow: `0 0 30px ${wonPrize.color}50`
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-xl md:rounded-2xl"
                      animate={{
                        boxShadow: [
                          `0 0 20px ${wonPrize.color}`,
                          `0 0 40px ${wonPrize.color}`,
                          `0 0 20px ${wonPrize.color}`
                        ]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <span className="text-sm md:text-2xl">{wonPrize.name}</span>
                  </motion.div>
                  
                  {wonPrize.prize_value > 0 && (
                    <motion.p
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
                      className="text-2xl md:text-4xl text-green-400 font-bold mb-3 md:mb-4"
                    >
                      ${wonPrize.prize_value}
                    </motion.p>
                  )}
                  
                  {wonPrize.description && (
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="text-gray-400 mb-4 md:mb-6 text-sm md:text-base"
                    >
                      {wonPrize.description}
                    </motion.p>
                  )}
                  
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCloseWinModal}
                    className="px-6 md:px-8 py-2.5 md:py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg md:rounded-xl font-semibold transition-all shadow-lg text-sm md:text-base"
                  >
                    ¡GENIAL!
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
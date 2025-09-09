// components/roulette/rouletteGame.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  Gamepad2, Gift, Star, Zap, Trophy, Crown, 
  Sparkles, TrendingUp, Lock, Unlock, Volume2, VolumeX,
  Ticket, CheckCircle, AlertCircle 
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
  
  // Estados para código promocional
  const [promoCode, setPromoCode] = useState('');
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [codeMessage, setCodeMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchPrizes();
    fetchUserStatus();
  }, []);

  const fetchPrizes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/roulette/prizes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        const activePrizes = (data.prizes || [])
          .filter((p: Prize) => p.is_active)
          .sort((a: Prize, b: Prize) => a.position - b.position);
        setPrizes(activePrizes);
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

  const playSound = (type: 'spin' | 'win') => {
    if (!soundEnabled) return;
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
        console.log('Resultado del giro:', result);
        
        // CORRECCIÓN: Buscar el premio por nombre o ID correctamente
        const winningPrizeIndex = prizes.findIndex(p => 
          p.name === result.spin.prize.name || p.id === result.spin.prize.id
        );
        
        if (winningPrizeIndex !== -1) {
          // CORRECCIÓN: Ajustar el cálculo del ángulo
          const prizeAngle = 360 / prizes.length;
          // El ángulo del premio ganador (desde el top, en sentido horario)
          const prizePosition = winningPrizeIndex * prizeAngle + (prizeAngle / 2);
          // Calcular rotación necesaria (el pointer está arriba, en 0°)
          const targetAngle = 360 - prizePosition;
          // Agregar múltiples vueltas
          const spins = 5 + Math.random() * 3;
          const finalRotation = rotation + (360 * spins) + targetAngle;
          
          console.log('Cálculo de rotación:', {
            winningPrizeIndex,
            prizeAngle,
            prizePosition,
            targetAngle,
            finalRotation
          });
          
          setRotation(finalRotation);
          
          setTimeout(async () => {
            setWonPrize(result.spin.prize);
            setShowWinModal(true);
            playSound('win');
            if (result.spin.prize.prize_value > 0) {
              triggerConfetti();
            }
            setIsSpinning(false);
            await fetchUserStatus();
          }, 4500);
        } else {
          console.error('Premio no encontrado en la lista');
          setIsSpinning(false);
          await fetchUserStatus();
        }
      } else {
        const error = await response.json();
        toast.error(error.message || 'Error al girar la ruleta');
        setIsSpinning(false);
      }
    } catch (error) {
      console.error('Error spinning:', error);
      toast.error('Error de conexión');
      setIsSpinning(false);
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
          className="w-20 h-20"
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
      {/* Símbolos de cartas muy sutiles */}
      <div className="absolute top-1/4 left-1/4 text-white/3 text-6xl rotate-12">♠</div>
      <div className="absolute top-1/4 right-1/4 text-white/3 text-6xl -rotate-12">♥</div>
      <div className="absolute bottom-1/4 left-1/4 text-white/3 text-6xl -rotate-12">♦</div>
      <div className="absolute bottom-1/4 right-1/4 text-white/3 text-6xl rotate-12">♣</div>
    </div>
  );

  return (
    <div className="relative">
      {/* Contenedor principal sin cambiar el fondo del header */}
      <div className="relative bg-gray-900/40 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-gray-700/50">
        <CardPattern />
        
        {/* Header */}
        <div className="relative z-10 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                Ruleta de Premios 
                <span className="text-yellow-400 text-xl">♠</span>
              </h2>
              <p className="text-gray-400">
                {hasSpinsAvailable 
                  ? `Tienes ${totalAvailableSpins} giro(s) disponible(s)` 
                  : 'Sin giros disponibles - Usa un código promocional'}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            {soundEnabled ? 
              <Volume2 className="w-5 h-5 text-gray-400" /> : 
              <VolumeX className="w-5 h-5 text-gray-400" />
            }
          </button>
        </div>

        {/* Stats Cards */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-blue-600/20 backdrop-blur-sm rounded-xl p-4 text-white border border-blue-500/30"
          >
            <div className="flex items-center justify-between mb-2">
              <Gamepad2 className="w-6 h-6" />
              {userStatus?.has_demo_available && (
                <span className="text-xs bg-blue-500/30 px-2 py-1 rounded-full">Disponible</span>
              )}
            </div>
            <p className="text-sm opacity-90">Giro Demo</p>
            <p className="text-2xl font-bold">{userStatus?.has_demo_available ? '1' : '0'}</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-green-600/20 backdrop-blur-sm rounded-xl p-4 text-white border border-green-500/30"
          >
            <div className="flex items-center justify-between mb-2">
              <Star className="w-6 h-6" />
              {userStatus?.has_real_available && (
                <span className="text-xs bg-green-500/30 px-2 py-1 rounded-full">Disponible</span>
              )}
            </div>
            <p className="text-sm opacity-90">Giro Real</p>
            <p className="text-2xl font-bold">{userStatus?.has_real_available ? '1' : '0'}</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-purple-600/20 backdrop-blur-sm rounded-xl p-4 text-white border border-purple-500/30"
          >
            <div className="flex items-center justify-between mb-2">
              <Gift className="w-6 h-6" />
              {userStatus?.available_bonus_spins && userStatus.available_bonus_spins > 0 && (
                <span className="text-xs bg-purple-500/30 px-2 py-1 rounded-full">x{userStatus.available_bonus_spins}</span>
              )}
            </div>
            <p className="text-sm opacity-90">Giros Bonus</p>
            <p className="text-2xl font-bold">{userStatus?.available_bonus_spins || 0}</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-orange-600/20 backdrop-blur-sm rounded-xl p-4 text-white border border-orange-500/30"
          >
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-6 h-6" />
            </div>
            <p className="text-sm opacity-90">Total Giros</p>
            <p className="text-2xl font-bold">{userStatus?.total_spins || 0}</p>
          </motion.div>
        </div>

        {/* Código Promocional */}
        <div className="relative z-10 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50"
          >
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-purple-400" />
                  ¿Tienes un código promocional?
                </h3>
                <p className="text-sm text-gray-400">
                  Ingresa tu código para obtener giros adicionales
                </p>
              </div>
              
              <div className="flex gap-3 w-full md:w-auto">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && handleValidateCode()}
                  placeholder="CÓDIGO-PROMO"
                  className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors flex-1 md:w-48"
                  disabled={isValidatingCode}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleValidateCode}
                  disabled={!promoCode || isValidatingCode}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
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
                      Validando...
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
                  className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
                    codeMessage.type === 'success' 
                      ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                      : 'bg-red-500/20 border border-red-500/50 text-red-400'
                  }`}
                >
                  {codeMessage.type === 'success' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <span className="text-sm font-medium">{codeMessage.text}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Ruleta */}
        <div className="relative z-10 mb-6">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 z-20">
            <motion.div
              animate={isSpinning ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5, repeat: isSpinning ? Infinity : 0 }}
              className="relative"
            >
              <div className="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[60px] border-b-yellow-400 drop-shadow-lg" />
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
              </div>
            </motion.div>
          </div>

          {/* Wheel Container */}
          <div className="relative w-full max-w-lg mx-auto aspect-square p-4">
            {/* Borde exterior */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-1">
              <div className="w-full h-full rounded-full bg-gray-900" />
            </div>
            
            <motion.div
              className="absolute inset-4 rounded-full overflow-hidden shadow-2xl"
              style={{
                transform: `rotate(${rotation}deg)`,
                boxShadow: '0 0 30px rgba(147, 51, 234, 0.3), inset 0 0 30px rgba(0,0,0,0.5)'
              }}
              animate={{ rotate: rotation }}
              transition={{ 
                duration: isSpinning ? 4.5 : 0, 
                ease: [0.17, 0.67, 0.16, 0.99]
              }}
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
                            <Crown className="w-5 h-5 text-yellow-300 drop-shadow-lg" />
                          ) : prize.prize_value > 0 ? (
                            <Star className="w-4 h-4 text-white drop-shadow-lg" />
                          ) : (
                            <Gift className="w-4 h-4 text-white/70 drop-shadow-lg" />
                          )}
                        </div>
                      </foreignObject>
                      
                      <text
                        x={textX}
                        y={textY + 10}
                        fill="white"
                        fontSize="2.5"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="drop-shadow-lg select-none"
                        style={{ 
                          paintOrder: 'stroke',
                          stroke: '#000',
                          strokeWidth: '0.5px'
                        }}
                      >
                        {prize.name.length > 10 ? prize.name.substring(0, 10) + '...' : prize.name}
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
                
                <circle cx="50" cy="50" r="15" fill="url(#centerGradient)" filter="url(#centerShadow)" />
                <circle cx="50" cy="50" r="12" fill="none" stroke="#fbbf24" strokeWidth="0.5" opacity="0.5" />
              </svg>
            </motion.div>

            {/* Spin Button */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
              <motion.button
                onClick={handleSpin}
                disabled={isSpinning || !hasSpinsAvailable}
                whileHover={!isSpinning && hasSpinsAvailable ? { scale: 1.1 } : {}}
                whileTap={!isSpinning && hasSpinsAvailable ? { scale: 0.95 } : {}}
                className={`w-28 h-28 rounded-full font-bold text-white transition-all ${
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
                      <Zap className="w-8 h-8" />
                    </motion.div>
                  ) : !hasSpinsAvailable ? (
                    <Lock className="w-8 h-8" />
                  ) : (
                    <Zap className="w-8 h-8" />
                  )}
                  <span className="text-sm mt-1 font-bold">
                    {isSpinning ? 'GIRANDO' : !hasSpinsAvailable ? 'SIN GIROS' : 'GIRAR'}
                  </span>
                  {hasSpinsAvailable && !isSpinning && (
                    <span className="text-xs opacity-80">
                      {totalAvailableSpins} disponible(s)
                    </span>
                  )}
                </div>
              </motion.button>
            </div>

            {isSpinning && (
              <div className="absolute inset-0 rounded-full pointer-events-none">
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-transparent border-t-yellow-400"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Prize Table */}
        <div className="relative z-10 bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h3 className="text-white font-semibold">Tabla de Premios</h3>
            <span className="ml-auto text-xs text-gray-400">
              {prizes.length} premios disponibles
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto custom-scrollbar">
            {prizes.map((prize) => (
              <motion.div
                key={prize.id}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 p-3 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all"
              >
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: prize.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white font-medium truncate">{prize.name}</p>
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
                  <Crown className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Win Modal */}
        <AnimatePresence>
          {showWinModal && wonPrize && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
              onClick={() => setShowWinModal(false)}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 rounded-3xl p-8 max-w-md w-full text-center border border-purple-500/50 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-purple-600/20 animate-pulse" />
                </div>
                
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-7xl mb-4"
                  >
                    {wonPrize.prize_value > 100 ? '👑' : wonPrize.prize_value > 0 ? '🎉' : '🎁'}
                  </motion.div>
                  
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl font-bold text-white mb-2"
                  >
                    ¡Felicidades!
                  </motion.h2>
                  
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-gray-300 mb-6"
                  >
                    Has ganado:
                  </motion.p>
                  
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="inline-block px-8 py-4 rounded-2xl text-white font-bold text-2xl mb-4 shadow-lg"
                    style={{ 
                      backgroundColor: wonPrize.color,
                      boxShadow: `0 0 30px ${wonPrize.color}50`
                    }}
                  >
                    {wonPrize.name}
                  </motion.div>
                  
                  {wonPrize.prize_value > 0 && (
                    <motion.p
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, type: "spring" }}
                      className="text-3xl text-green-400 font-bold mb-4"
                    >
                      ${wonPrize.prize_value}
                    </motion.p>
                  )}
                  
                  {wonPrize.description && (
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="text-gray-400 mb-6"
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
                    onClick={() => setShowWinModal(false)}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all shadow-lg"
                  >
                    ¡Genial!
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
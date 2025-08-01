import { Room } from '@/types/rooms.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { CreditCard, Building, Wallet, DollarSign, Coins, Smartphone, ArrowUpDown, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mapeo de iconos
const paymentIcons: Record<string, any> = {
  CreditCard,
  Building,
  Wallet,
  DollarSign,
  Coins,
  Smartphone,
  Bitcoin: Coins, // Fallback para Bitcoin
};

interface RoomPaymentMethodsProps {
  room: Room;
}

export function RoomPaymentMethods({ room }: RoomPaymentMethodsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4">
            <CreditCard className="h-3 w-3 mr-1" />
            Métodos de Pago
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Depósitos y <span className="gradient-text">Retiros Seguros</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Múltiples opciones para manejar tu dinero de forma rápida y segura
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {room.paymentMethods.map((method) => {
            const Icon = paymentIcons[method.icon] || Wallet;
            return (
              <motion.div key={method.id} variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-all group">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className={cn(
                        'p-3 rounded-lg bg-gradient-to-br',
                        method.type === 'deposit' && 'from-green-600 to-green-700',
                        method.type === 'withdrawal' && 'from-blue-600 to-blue-700',
                        method.type === 'both' && 'from-purple-600 to-purple-700'
                      )}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {method.type === 'both' ? (
                          <>
                            <ArrowUpDown className="h-3 w-3 mr-1" />
                            Depósito y Retiro
                          </>
                        ) : method.type === 'deposit' ? (
                          <>
                            <span className="mr-1">↓</span>
                            Solo Depósito
                          </>
                        ) : (
                          <>
                            <span className="mr-1">↑</span>
                            Solo Retiro
                          </>
                        )}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-poker-green transition-colors">
                      {method.name}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {/* Processing Time */}
                    {method.processingTime && (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <span className="text-sm text-gray-400 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Tiempo
                        </span>
                        <span className="text-sm font-medium">
                          {method.processingTime}
                        </span>
                      </div>
                    )}
                    
                    {/* Limits */}
                    {(method.minAmount || method.maxAmount) && (
                      <div className="p-3 rounded-lg bg-white/5 space-y-2">
                        {method.minAmount && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Mínimo</span>
                            <span className="text-sm font-medium text-green-500">
                              ${method.minAmount}
                            </span>
                          </div>
                        )}
                        {method.maxAmount && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Máximo</span>
                            <span className="text-sm font-medium text-blue-500">
                              ${method.maxAmount.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Fees */}
                    {method.fees && (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <span className="text-sm text-gray-400">Comisiones</span>
                        <span className={cn(
                          'text-sm font-medium',
                          method.fees === 'Sin comisiones' ? 'text-green-500' : 'text-yellow-500'
                        )}>
                          {method.fees}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Payment Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <Card className="glass border-poker-green/20 bg-gradient-to-r from-poker-green/10 to-transparent">
            <CardContent className="py-6">
              <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <div className="p-4 rounded-full bg-poker-green/20">
                  <svg className="h-12 w-12 text-poker-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    Transacciones 100% Seguras
                  </h3>
                  <p className="text-gray-400">
                    Todos los pagos están protegidos con encriptación SSL de 256 bits. 
                    Tu información financiera está completamente segura con nosotros.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
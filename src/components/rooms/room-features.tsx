import { Room } from '@/types/rooms.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { CheckCircle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mapeo de iconos string a componentes
import { 
  Trophy, Shield, Headphones, Zap, Smartphone, 
  Clock, Users, Globe, Gift, Video, Award, Crown, DollarSign 
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Trophy,
  Shield,
  Headphones,
  Zap,
  Smartphone,
  Clock,
  Users,
  Globe,
  Gift,
  Video,
  Award,
  Crown,
  DollarSign,
};

interface RoomFeaturesProps {
  room: Room;
}

export function RoomFeatures({ room }: RoomFeaturesProps) {
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
        hidden: { opacity: 0, scale: 0.8 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: {
                type: "spring" as const, // CAMBIO: Añadido 'as const' para especificar el tipo literal
                stiffness: 100
            }
        }
    };

    return (
        <section className="py-12 bg-gradient-to-b from-transparent via-background/50 to-transparent">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <Badge className="mb-4">
                        <Star className="h-3 w-3 mr-1" />
                        Características Premium
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        ¿Por qué elegir <span className="gradient-text">{room.name}</span>?
                    </h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Descubre todas las características que hacen de esta sala la mejor opción
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {room.features.map((feature) => {
                        const Icon = iconMap[feature.icon] || CheckCircle;
                        return (
                            <motion.div
                                key={feature.id}
                                variants={itemVariants}
                            >
                                <Card className={cn(
                                    'h-full group hover:shadow-xl transition-all',
                                    feature.highlighted && 'ring-2 ring-poker-green'
                                )}>
                                    <CardHeader>
                                        <div className="flex items-start gap-4">
                                            <div className={cn(
                                                'p-3 rounded-lg transition-all group-hover:scale-110',
                                                feature.highlighted 
                                                    ? 'bg-gradient-to-br from-poker-green to-green-600' 
                                                    : 'bg-gradient-to-br from-gray-700 to-gray-800'
                                            )}>
                                                <Icon className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <CardTitle className="text-lg mb-2 group-hover:text-poker-green transition-colors">
                                                    {feature.title}
                                                </CardTitle>
                                                <p className="text-sm text-gray-400">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    {feature.highlighted && (
                                        <CardContent>
                                            <Badge variant="outline" className="text-xs">
                                                <Star className="h-3 w-3 mr-1" />
                                                Característica Destacada
                                            </Badge>
                                        </CardContent>
                                    )}
                                </Card>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Pros and Cons */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                    {/* Pros */}
                    <Card className="glass border-green-500/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-500">
                                <CheckCircle className="h-5 w-5" />
                                Ventajas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {room.pros.map((pro, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="flex items-start gap-3"
                                    >
                                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-300">{pro}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Cons */}
                    <Card className="glass border-red-500/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-500">
                                <span className="text-xl">⚠️</span>
                                A Considerar
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {room.cons.map((con, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="flex items-start gap-3"
                                    >
                                        <span className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5">•</span>
                                        <span className="text-gray-300">{con}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}
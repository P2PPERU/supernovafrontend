// src/app/clubs/[id]/page.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useClub } from '@/hooks/useClubs';
import { 
  MapPin, 
  Users, 
  Globe, 
  Star,
  Mail,
  Phone,
  ExternalLink,
  Gamepad2,
  Clock,
  Shield,
  ArrowLeft,
  Facebook,
  Twitter,
  Instagram,
  MessageCircle,
  Calendar,
  Award,
  Zap,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface ClubDetailPageProps {
  params: {
    id: string;
  };
}

export default function ClubDetailPage({ params }: ClubDetailPageProps) {
  const { data, isLoading, error } = useClub(params.id);
  const club = data?.club;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            
            {/* Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="h-96 animate-pulse">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      <div className="space-y-2">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card className="h-64 animate-pulse">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !club) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Club no encontrado</h1>
              <p className="text-muted-foreground mb-6">
                El club que buscas no existe o no está disponible.
              </p>
              <Button asChild>
                <Link href="/clubs">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver a Clubs
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button variant="ghost" asChild>
            <Link href="/clubs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Clubs
            </Link>
          </Button>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8"
        >
          <Card className="overflow-hidden">
            {/* Banner */}
            {club.banner && (
              <div className="h-64 bg-gradient-to-r from-poker-green to-poker-blue relative overflow-hidden">
                <img 
                  src={club.banner} 
                  alt={`${club.name} banner`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                
                {/* Club Info Overlay */}
                <div className="absolute inset-0 flex items-end p-8">
                  <div className="flex items-end gap-6">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                      <AvatarImage src={club.logo || ''} alt={club.name} />
                      <AvatarFallback className="bg-gradient-to-br from-poker-green to-poker-blue text-white font-bold text-2xl">
                        {club.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-white">
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-4xl font-bold">{club.name}</h1>
                        {club.isFeatured && (
                          <Badge className="bg-poker-gold text-black">
                            <Star className="h-3 w-3 mr-1" />
                            Destacado
                          </Badge>
                        )}
                      </div>
                      {club.location && (
                        <div className="flex items-center gap-2 text-lg">
                          <MapPin className="h-5 w-5" />
                          <span>{club.location.city}, {club.location.country}</span>
                        </div>
                      )}
                      {club.rating && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="font-semibold">{club.rating}</span>
                          </div>
                          {club.totalReviews && (
                            <span className="text-white/80">
                              ({club.totalReviews} reseñas)
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>Acerca del Club</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {club.description}
                </p>
              </CardContent>
            </Card>

            {/* Features and Game Types */}
            <Card>
              <CardHeader>
                <CardTitle>Características y Juegos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Features */}
                {club.features && club.features.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Características
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {club.features.map((feature) => (
                        <Badge key={feature} variant="outline">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Game Types */}
                {club.gameTypes && club.gameTypes.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Gamepad2 className="h-4 w-4" />
                      Tipos de Juego
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {club.gameTypes.map((gameType) => (
                        <Badge key={gameType} variant="secondary">
                          {gameType}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Requirements */}
            {club.requirements && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Requisitos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Edad mínima</p>
                        <p className="text-sm text-muted-foreground">{club.requirements.minAge} años</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Verificación</p>
                        <p className="text-sm text-muted-foreground">
                          {club.requirements.verificationRequired ? 'Requerida' : 'No requerida'}
                        </p>
                      </div>
                    </div>
                    {club.requirements.minDeposit && (
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Depósito mínimo</p>
                          <p className="text-sm text-muted-foreground">S/ {club.requirements.minDeposit}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Right Column - Contact & Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {club.website && (
                  <Button asChild className="w-full">
                    <a href={club.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-2 h-4 w-4" />
                      Visitar Sitio Web
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}

                <div className="space-y-3">
                  {club.contactEmail && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={`mailto:${club.contactEmail}`}
                        className="text-sm hover:underline"
                      >
                        {club.contactEmail}
                      </a>
                    </div>
                  )}
                  
                  {club.contactPhone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={`tel:${club.contactPhone}`}
                        className="text-sm hover:underline"
                      >
                        {club.contactPhone}
                      </a>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                {club.socialLinks && (
                  <div>
                    <Separator className="my-4" />
                    <p className="text-sm font-medium mb-3">Redes Sociales</p>
                    <div className="flex gap-2">
                      {club.socialLinks.facebook && (
                        <Button variant="outline" size="icon" asChild>
                          <a href={club.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                            <Facebook className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {club.socialLinks.twitter && (
                        <Button variant="outline" size="icon" asChild>
                          <a href={club.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                            <Twitter className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {club.socialLinks.instagram && (
                        <Button variant="outline" size="icon" asChild>
                          <a href={club.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                            <Instagram className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {club.socialLinks.telegram && (
                        <Button variant="outline" size="icon" asChild>
                          <a href={club.socialLinks.telegram} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            {club.stats && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Estadísticas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold">{club.stats.totalMembers?.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Miembros</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold">{club.stats.activePlayers?.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Activos</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold">{club.stats.totalTournaments}</p>
                      <p className="text-xs text-muted-foreground">Torneos</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold">S/ {club.stats.avgPrizePool?.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Pozo Prom.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Schedule */}
            {club.schedule && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Horarios
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {club.schedule.openHours && (
                    <div>
                      <p className="text-sm font-medium">Horario de Atención</p>
                      <p className="text-sm text-muted-foreground">{club.schedule.openHours}</p>
                    </div>
                  )}
                  {club.schedule.tournamentDays && club.schedule.tournamentDays.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Días de Torneos</p>
                      <div className="flex flex-wrap gap-1">
                        {club.schedule.tournamentDays.map((day) => (
                          <Badge key={day} variant="outline" className="text-xs">
                            {day}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {club.schedule.timeZone && (
                    <div>
                      <p className="text-sm font-medium">Zona Horaria</p>
                      <p className="text-sm text-muted-foreground">{club.schedule.timeZone}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Created Date */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Miembro desde {formatDate(club.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
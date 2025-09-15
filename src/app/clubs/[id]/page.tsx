// src/app/clubs/[id]/page.tsx
'use client';

import { use, useState } from 'react';
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
  params: Promise<{
    id: string;
  }>;
}

export default function ClubDetailPage({ params }: ClubDetailPageProps) {
  const resolvedParams = use(params);
  const { data, isLoading, error } = useClub(resolvedParams.id);
  const club = data?.club;
  // DEBUG temporal
  console.log('🎯 Club received in component:', {
   logo: club?.logo,
   banner: club?.banner,
   logo_url: club?.logo_url,
   banner_url: club?.banner_url
 });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
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
            <div className="h-64 bg-gradient-to-r from-poker-green to-poker-blue relative overflow-hidden">
              {club.banner && (
                <img 
                  src={club.banner} 
                  alt={`${club.name} banner`}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/40" />
              
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
                      {club.settings?.isFeatured && (
                        <Badge className="bg-poker-gold text-black">
                          <Star className="h-3 w-3 mr-1" />
                          Destacado
                        </Badge>
                      )}
                    </div>
                    {(club.city || club.country) && (
                      <div className="flex items-center gap-2 text-lg">
                        <MapPin className="h-5 w-5" />
                        <span>{club.city || 'Sin especificar'}, {club.country || 'Perú'}</span>
                      </div>
                    )}
                    {club.member_count && (
                      <div className="flex items-center gap-2 mt-2">
                        <Users className="h-4 w-4" />
                        <span>{club.member_count} miembros</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
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
                {club.settings?.shortDescription && (
                  <p className="text-sm text-muted-foreground mt-4 italic">
                    {club.settings.shortDescription}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Features and Game Types */}
            <Card>
              <CardHeader>
                <CardTitle>Características y Juegos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Features */}
                {club.settings?.features && club.settings.features.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Características
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {club.settings.features.map((feature: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Game Types */}
                {club.settings?.gameTypes && club.settings.gameTypes.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Gamepad2 className="h-4 w-4" />
                      Tipos de Juego
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {club.settings.gameTypes.map((gameType: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {gameType}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Requirements */}
            {club.settings?.requirements && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Requisitos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {club.settings.requirements.minAge && (
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Edad mínima</p>
                          <p className="text-sm text-muted-foreground">{club.settings.requirements.minAge} años</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Verificación</p>
                        <p className="text-sm text-muted-foreground">
                          {club.settings.requirements.verificationRequired ? 'Requerida' : 'No requerida'}
                        </p>
                      </div>
                    </div>
                    {club.settings.requirements.minDeposit && (
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Depósito mínimo</p>
                          <p className="text-sm text-muted-foreground">S/ {club.settings.requirements.minDeposit}</p>
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
                  {club.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={`mailto:${club.email}`}
                        className="text-sm hover:underline"
                      >
                        {club.email}
                      </a>
                    </div>
                  )}
                  
                  {club.owner_phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={`tel:${club.owner_phone}`}
                        className="text-sm hover:underline"
                      >
                        {club.owner_phone}
                      </a>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                {club.social_media && Object.keys(club.social_media).length > 0 && (
                  <div>
                    <Separator className="my-4" />
                    <p className="text-sm font-medium mb-3">Redes Sociales</p>
                    <div className="flex gap-2">
                      {club.social_media.facebook && (
                        <Button variant="outline" size="icon" asChild>
                          <a href={club.social_media.facebook} target="_blank" rel="noopener noreferrer">
                            <Facebook className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {club.social_media.twitter && (
                        <Button variant="outline" size="icon" asChild>
                          <a href={club.social_media.twitter} target="_blank" rel="noopener noreferrer">
                            <Twitter className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {club.social_media.instagram && (
                        <Button variant="outline" size="icon" asChild>
                          <a href={club.social_media.instagram} target="_blank" rel="noopener noreferrer">
                            <Instagram className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {club.social_media.telegram && (
                        <Button variant="outline" size="icon" asChild>
                          <a href={club.social_media.telegram} target="_blank" rel="noopener noreferrer">
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Información del Club
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tipo</span>
                    <span className="text-sm font-medium">{club.club_type || 'Poker Room'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Estado</span>
                    <Badge variant={club.is_active ? 'default' : 'secondary'}>
                      {club.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Miembros</span>
                    <span className="text-sm font-medium">{club.member_count || 0}</span>
                  </div>
                  {club.owner_name && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Contacto</span>
                      <span className="text-sm font-medium">{club.owner_name}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

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
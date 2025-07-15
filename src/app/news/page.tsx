'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNews } from '@/hooks/useNews';
import { formatDate } from '@/lib/utils';
import { Calendar, Search, Filter, ArrowRight, Clock, Eye } from 'lucide-react';
import { News } from '@/types';

const categories = [
  { value: 'all', label: 'Todas' },
  { value: 'general', label: 'General' },
  { value: 'tournament', label: 'Torneos' },
  { value: 'promotion', label: 'Promociones' },
  { value: 'update', label: 'Actualizaciones' },
];

export default function NewsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useNews({
    page,
    limit: 9,
    category: category === 'all' ? undefined : category,
    search: search || undefined,
    status: 'published',
  });

  const news = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const featuredNews = news.filter(item => item.featured).slice(0, 1)[0];
  const regularNews = featuredNews 
    ? news.filter(item => item.id !== featuredNews.id)
    : news;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Noticias</h1>
        <p className="text-muted-foreground mt-2">
          Mantente al día con las últimas novedades del club
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar noticias..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Tabs */}
        <Tabs value={category} onValueChange={setCategory}>
          <TabsList className="grid w-full grid-cols-5">
            {categories.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value}>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando noticias...</p>
        </div>
      ) : news.length === 0 ? (
        <Card className="py-12">
          <CardContent>
            <p className="text-center text-muted-foreground">
              No se encontraron noticias con los filtros seleccionados.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Featured News */}
          {featuredNews && (
            <Card className="mb-8 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {featuredNews.imageUrl && (
                  <div className="relative h-64 lg:h-full">
                    <Image
                      src={featuredNews.imageUrl}
                      alt={featuredNews.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-poker-gold text-black">
                        Destacado
                      </Badge>
                    </div>
                  </div>
                )}
                <div className="p-6 lg:p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <Badge variant={getCategoryVariant(featuredNews.category)}>
                      {getCategoryLabel(featuredNews.category)}
                    </Badge>
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(featuredNews.publishedAt || featuredNews.createdAt)}
                    </span>
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {featuredNews.views} vistas
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mb-3">{featuredNews.title}</h2>
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {featuredNews.summary || featuredNews.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Por {featuredNews.author?.username || 'Admin'}
                    </span>
                    <Button asChild>
                      <Link href={`/news/${featuredNews.id}`}>
                        Leer más
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Regular News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {regularNews.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {item.imageUrl && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={getCategoryVariant(item.category)}>
                      {getCategoryLabel(item.category)}
                    </Badge>
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(item.publishedAt || item.createdAt)}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-3">
                    {item.summary || item.content}
                  </CardDescription>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {item.views}
                    </span>
                    <Button variant="link" className="p-0" asChild>
                      <Link href={`/news/${item.id}`}>
                        Leer más
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                {totalPages > 5 && <span className="px-2">...</span>}
                {totalPages > 5 && (
                  <Button
                    variant={page === totalPages ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPage(totalPages)}
                  >
                    {totalPages}
                  </Button>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Helper functions
function getCategoryVariant(category: string): any {
  switch (category) {
    case 'tournament':
      return 'default';
    case 'promotion':
      return 'secondary';
    case 'update':
      return 'outline';
    default:
      return 'secondary';
  }
}

function getCategoryLabel(category: string): string {
  switch (category) {
    case 'tournament':
      return 'Torneo';
    case 'promotion':
      return 'Promoción';
    case 'update':
      return 'Actualización';
    case 'general':
      return 'General';
    default:
      return category;
  }
}
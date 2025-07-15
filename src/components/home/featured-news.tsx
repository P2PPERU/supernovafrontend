'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar } from 'lucide-react';
import { useFeaturedNews } from '@/hooks/useNews';
import { formatDate } from '@/lib/utils';
import { News } from '@/types';

export function FeaturedNews() {
  const { data, isLoading } = useFeaturedNews(3);

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>Cargando noticias...</p>
          </div>
        </div>
      </section>
    );
  }

  const news: News[] = data?.news || [];

  if (news.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Últimas Noticias</h2>
            <p className="text-muted-foreground mt-2">
              Mantente informado con las últimas novedades del club
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/news">
              Ver todas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item: News) => (
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
                  <Badge variant={item.category === 'tournament' ? 'default' : 'secondary'}>
                    {item.category}
                  </Badge>
                  <span className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(item.publishedAt || item.createdAt)}
                  </span>
                </div>
                <CardTitle className="line-clamp-2">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-3">
                  {item.summary || item.content}
                </CardDescription>
                <Button variant="link" className="mt-4 p-0" asChild>
                  <Link href={`/news/${item.id}`}>
                    Leer más
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
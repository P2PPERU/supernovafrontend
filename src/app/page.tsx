import { HeroSection } from '@/components/home/hero-section';
import { FeaturesSection } from '@/components/home/features-section';
import { FeaturedRooms } from '@/components/home/featured-rooms';
import { StatsSection } from '@/components/home/stats-section';
import { PromoSection } from '@/components/home/promo-section';
import { FeaturedNews } from '@/components/home/featured-news';
import { TestimonialsSection } from '@/components/home/testimonials-section';

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <FeaturedRooms />
      <StatsSection />
      <FeaturesSection />
      <PromoSection />
      <TestimonialsSection />
      <FeaturedNews />
    </div>
  );
}
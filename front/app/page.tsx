import { Navbar } from '@/components/landing/Navbar';
import { ScrollProgress } from '@/components/landing/ScrollProgress';
import { Hero } from '@/components/landing/Hero';
import { HeroBenefits } from '@/components/landing/HeroBenefits';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { VideoReel } from '@/components/landing/VideoReel';
import { CommunityGallery } from '@/components/landing/CommunityGallery';
import { Testimonials } from '@/components/landing/Testimonials';
import { Pricing } from '@/components/landing/Pricing';
import { Faq } from '@/components/landing/Faq';
import { CtaFinal } from '@/components/landing/CtaFinal';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <main className="overflow-x-hidden">
      <ScrollProgress />
      <Navbar />
      <Hero />
      <HeroBenefits />
      <Features />
      <HowItWorks />
      <VideoReel />
      <CommunityGallery />
      <Testimonials />
      <Pricing />
      <Faq />
      <CtaFinal />
      <Footer />
    </main>
  );
}

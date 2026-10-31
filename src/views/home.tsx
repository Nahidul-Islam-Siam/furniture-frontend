import { HeroSection } from '../components/grid/HeroSection';
import { RichTextSection } from '../components/grid/RichTextSection';
import { FeaturedCategories } from '../components/grid/FeaturedCategories';
import { CollectionSwitcher } from '../components/grid/CollectionSwitcher';
import { CenturyBanner } from '../components/grid/CenturyBanner';
import { ValuePropsSection } from '../components/grid/ValuePropsSection';
import { TestimonialsSection } from '../components/grid/TestimonialsSection';
import { VideoSection } from '../components/grid/VideoSection';
import { CompanyLogosSection } from '../components/grid/CompanyLogosSection';
import { MeaningfulDesignSection } from '../components/grid/MeaningfulDesignSection';
import { FooterPromotions } from '../components/grid/FooterPromotions';

export default function Home() {
  return (
    <div className="w-full">
      {/* 1. Hero Banner */}
      <HeroSection />

      {/* 2. Brand Manifesto */}
      <RichTextSection />

      {/* 3. 4-Category Visual Grid */}
      <FeaturedCategories />

      {/* 4. Featured Products (Chair & Table Switcher) */}
      <CollectionSwitcher />

      {/* 5. For 21st Century Banner */}
      <CenturyBanner />

      {/* 6. Value Propositions (Free Delivery, Warranty, EMI) */}
      <ValuePropsSection />

      {/* 7. Client Reviews ("Don't take our word for it") */}
      <TestimonialsSection />

      {/* 8. YouTube Video Feature ("Hear From Our Customers") */}
      <VideoSection />

      {/* 9. Top Companies Logo Grid */}
      <CompanyLogosSection />

      {/* 10. "We Create Meaningful Design" Story Section */}
      <MeaningfulDesignSection />

      {/* 11. Footer Story Promotions (3 Cards) */}
      <FooterPromotions />
    </div>
  );
}

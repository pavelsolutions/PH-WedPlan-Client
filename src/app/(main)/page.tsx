import HeroSection from "@/components/home/HeroSection";
import WhyChooseSection from "@/components/home/WhyChooseSection";
import FeaturedServicesSection from "@/components/home/FeaturedServicesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FinalCTASection from "@/components/home/FinalCTASection";
import WeddingServiceCategories from "@/components/home/WeddingServiceCategories";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WeddingServiceCategories/>
      {/* <PopularCategoriesSection /> */}
      <WhyChooseSection />
      <FeaturedServicesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FinalCTASection />
    </>
  );
}
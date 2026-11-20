import HeroSection from "@/components/home/HeroSection";
import PopularCategoriesSection from "@/components/home/PopularCategoriesSection";
import WhyChooseSection from "@/components/home/WhyChooseSection";
import FeaturedServicesSection from "@/components/home/FeaturedServicesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FinalCTASection from "@/components/home/FinalCTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PopularCategoriesSection />
      <WhyChooseSection />
      <FeaturedServicesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FinalCTASection />
    </>
  );
}
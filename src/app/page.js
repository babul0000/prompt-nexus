import Banner from "@/components/Banner";
import FeaturedPrompts from "@/components/FeaturedPrompts";
import AuthCallToAction from "@/components/AuthCallToAction";
import HowItWorks from "@/components/HowItWorks";
import WhyChooseUs from "@/components/WhyChooseUs";
import PromptEssentials from "@/components/PromptEssentials";
import TopCreators from "@/components/TopCreators";
import EngineCompatibility from "@/components/EngineCompatibility";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030014]">
      <Banner />
      <FeaturedPrompts />
      <AuthCallToAction />
      <HowItWorks />
      <WhyChooseUs />
      <PromptEssentials />
      <TopCreators />
      <EngineCompatibility />
      <Testimonials />
    </main>
  );
}

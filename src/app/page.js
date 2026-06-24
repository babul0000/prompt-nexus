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
    <main className="min-h-screen bg-slate-50 dark:bg-[#030014] text-zinc-900 dark:text-white transition-colors duration-300">
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

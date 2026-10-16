import ClosingSection from "./ClosingSection";
import DemoSection from "./DemoSection";
import FaqSection from "./FaqSection";
import HeroSection from "./HeroSection";
import LandingFooter from "./LandingFooter";
import LandingNav from "./LandingNav";
import PricingSection from "./PricingSection";
import TopicsSection from "./TopicsSection";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)] [scroll-behavior:smooth]">
      <LandingNav />
      <main>
        <HeroSection />
        <DemoSection />
        <TopicsSection />
        <PricingSection />
        <FaqSection />
        <ClosingSection />
      </main>
      <LandingFooter />
    </div>
  );
}

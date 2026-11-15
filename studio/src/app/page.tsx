import SmoothScroll from "@/components/layout/SmoothScroll";
import PillNavbar from "@/components/layout/PillNavbar";
import Footer from "@/components/layout/Footer";
import GrainOverlay from "@/components/ui/GrainOverlay";
import Hero from "@/components/sections/Hero";
import CurvedGallery from "@/components/sections/CurvedGallery";
import EditorialShowcase from "@/components/sections/EditorialShowcase";
import CaseStudies from "@/components/sections/CaseStudies";
import Pricing from "@/components/sections/Pricing";

export default function Home() {
  return (
    <SmoothScroll>
      <div aria-hidden="true" className="aura" />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-bone focus:px-4 focus:py-2 focus:text-ink">
        Skip to content
      </a>
      <PillNavbar />
      <main id="main" className="relative z-10">
        <Hero />
        <CurvedGallery />
        <EditorialShowcase />
        <CaseStudies />
        <Pricing />
      </main>
      <div className="relative z-10"><Footer /></div>
      <GrainOverlay />
    </SmoothScroll>
  );
}

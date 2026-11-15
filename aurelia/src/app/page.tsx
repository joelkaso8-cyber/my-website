import SmoothScroll from "@/components/layout/SmoothScroll";
import PillNavbar from "@/components/layout/PillNavbar";
import DemoBadge from "@/components/layout/DemoBadge";
import GrainOverlay from "@/components/ui/GrainOverlay";
import Hero from "@/components/sections/Hero";
import CurvedGallery from "@/components/sections/CurvedGallery";
import SanctuaryStory from "@/components/sections/SanctuaryStory";
import RestaurantShowcase from "@/components/sections/RestaurantShowcase";
import BookingFooter from "@/components/sections/BookingFooter";

export default function Home() {
  return (
    <SmoothScroll>
      <div aria-hidden="true" className="aura" />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-alabaster focus:px-4 focus:py-2 focus:text-ink">
        Skip to content
      </a>
      <PillNavbar />
      <DemoBadge />
      <main id="main" className="relative z-10">
        <Hero />
        <CurvedGallery />
        <SanctuaryStory />
        <RestaurantShowcase />
      </main>
      <BookingFooter />
      <GrainOverlay />
    </SmoothScroll>
  );
}

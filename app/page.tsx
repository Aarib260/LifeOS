import Hero from "@/components/window-manager/AppWindow";
import WorldMap from "@/components/map/WorldMap";
import FeaturedCountries from "@/components/window-manager/WindowControls";
import ContinentExplorer from "@/components/window-manager/ContinentExplorer";
import TravelStats from "@/components/window-manager/TravelStats";
import SectionHeader from "@/components/apps/calendar/CalendarApp";

export default function Home() {
  return (
    <div>
      <Hero />

      <div id="map-section" className="relative max-w-7xl mx-auto px-6 pt-[120px]">
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="pt-8">
          <SectionHeader
            eyebrow="Interactive"
            title="Explore the Map"
            description="Hover, click, and zoom to discover countries around the world."
            align="center"
          />
          <WorldMap />
        </div>
      </div>

      <div className="pt-[120px]">
        <FeaturedCountries />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="pt-[120px]">
        <ContinentExplorer />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="pt-[120px] pb-[80px]">
        <TravelStats />
      </div>
    </div>
  );
}
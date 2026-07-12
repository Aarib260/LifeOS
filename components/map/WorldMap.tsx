"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import countriesData from "@/data/countries.json";
import { Country } from "@/country";
import { MAP_CONFIG } from "@/lib/constants";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const countries = countriesData as Country[];
const nameToId = new Map(countries.map((c) => [c.name, c.id]));

export default function WorldMap() {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [zoom, setZoom] = useState(MAP_CONFIG.defaultZoom);
  const [center, setCenter] = useState<[number, number]>(
    MAP_CONFIG.defaultCenter
  );
  const router = useRouter();

  function handleClick(geoName: string) {
    const id = nameToId.get(geoName);
    if (id) router.push(`/countries/${id}`);
  }

  function handleZoomIn() {
    setZoom((z) => Math.min(z * 1.5, MAP_CONFIG.maxZoom));
  }

  function handleZoomOut() {
    setZoom((z) => Math.max(z / 1.5, MAP_CONFIG.minZoom));
  }

  function handleReset() {
    setZoom(MAP_CONFIG.defaultZoom);
    setCenter(MAP_CONFIG.defaultCenter);
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold tracking-tight mb-2">
          Interactive World Map
        </h2>
        <p className="text-sm text-[#94A3B8]">
          Hover to preview · Click to explore · Scroll to zoom
        </p>
      </div>

      <div className="glass rounded-[32px] overflow-hidden relative">
        <div className="w-full aspect-[2/1] max-w-6xl mx-auto relative">
          <ComposableMap projectionConfig={{ scale: 140 }} className="w-full h-full">
            <ZoomableGroup
              zoom={zoom}
              center={center}
              onMoveEnd={({ zoom: z, coordinates }) => {
                setZoom(z);
                setCenter(coordinates);
              }}
              minZoom={MAP_CONFIG.minZoom}
              maxZoom={MAP_CONFIG.maxZoom}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const geoName = geo.properties.name;
                    const hasData = nameToId.has(geoName);

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={() => setHoveredCountry(geoName)}
                        onMouseLeave={() => setHoveredCountry(null)}
                        onClick={() => handleClick(geoName)}
                        style={{
                          default: {
                            fill: hasData ? "#1a2740" : "#141d2e",
                            stroke: "#0b1324",
                            strokeWidth: 0.6,
                            outline: "none",
                          },
                          hover: {
                            fill: hasData ? "#4FD1FF" : "#1a2740",
                            stroke: "#0b1324",
                            strokeWidth: 0.6,
                            outline: "none",
                            cursor: hasData ? "pointer" : "default",
                            filter: hasData
                              ? "drop-shadow(0 0 8px rgba(79,209,255,0.6))"
                              : "none",
                          },
                          pressed: {
                            fill: hasData ? "#67E8F9" : "#1a2740",
                            outline: "none",
                          },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          {/* Floating glass zoom controls */}
          <div className="absolute top-5 right-5 flex flex-col gap-2">
            <button
              onClick={handleZoomIn}
              className="glass w-11 h-11 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors"
            >
              <ZoomIn size={17} />
            </button>
            <button
              onClick={handleZoomOut}
              className="glass w-11 h-11 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors"
            >
              <ZoomOut size={17} />
            </button>
            <button
              onClick={handleReset}
              className="glass w-11 h-11 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors"
            >
              <RotateCcw size={17} />
            </button>
          </div>

          {/* Hover tooltip - floating glass card */}
          {hoveredCountry && nameToId.has(hoveredCountry) && (
            <div className="glass absolute bottom-5 left-5 rounded-xl px-4 py-2.5 text-sm font-medium pointer-events-none">
              {hoveredCountry}
            </div>
          )}
        </div>

        {/* Footer legend */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.06] text-xs text-[#7C8A9A]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4FD1FF]" />
              Interactive
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white/20" />
              Unavailable
            </span>
          </div>
          <span>Powered by Atlas</span>
        </div>
      </div>
    </div>
  );
}
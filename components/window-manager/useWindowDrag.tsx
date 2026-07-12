"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import countries from "@/data/countries.json";
import { Country } from "@/country";
import { fadeIn } from "@/lib/appRegistry";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return (countries as Country[]).filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.capital.toLowerCase().includes(q) ||
        c.continent.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(id: string) {
    setQuery("");
    setIsOpen(false);
    router.push(`/countries/${id}`);
  }

  return (
  <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
    <div
      className="
        group
        flex
        items-center
        h-16
        rounded-full
        border
        border-white/10
        bg-white/[0.04]
        backdrop-blur-2xl
        px-6
        transition-all
        duration-300
        focus-within:border-cyan-400/30
        focus-within:shadow-[0_0_40px_rgba(79,209,255,0.15)]
      "
    >
      <Search
        size={20}
        className="
          text-slate-400
          transition-all
          duration-300
          group-focus-within:text-cyan-300
          group-focus-within:scale-110
        "
      />

      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Search countries, capitals, or continents..."
        className="
          flex-1
          bg-transparent
          px-4
          text-base
          text-white
          placeholder:text-slate-500
          outline-none
        "
      />

      <div
        className="
          hidden
          sm:flex
          items-center
          gap-1
          rounded-full
          border
          border-white/10
          bg-white/5
          px-3
          py-1
          text-xs
          text-slate-400
        "
      >
        Ctrl
        <span className="font-semibold">K</span>
      </div>
    </div>

    <AnimatePresence>
      {isOpen && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2 }}
          className="
            absolute
            left-0
            right-0
            mt-4
            overflow-hidden
            rounded-3xl
            border
            border-white/10
            bg-[#09111F]/90
            backdrop-blur-2xl
            shadow-2xl
            z-50
          "
        >
          {results.slice(0, 6).map((country) => (
            <button
              key={country.id}
              onClick={() => handleSelect(country.id)}
              className="
                group
                flex
                w-full
                items-center
                gap-4
                px-5
                py-4
                transition-all
                duration-200
                hover:bg-white/5
              "
            >
              <img
                src={country.flag}
                alt={country.name}
                className="
                  h-9
                  w-12
                  rounded-md
                  object-cover
                  shadow-lg
                "
              />

              <div className="flex-1 text-left">
                <p
                  className="
                    font-medium
                    text-white
                    transition-colors
                    group-hover:text-cyan-300
                  "
                >
                  {country.name}
                </p>

                <p className="text-sm text-slate-400">
                  {country.capital} • {country.continent}
                </p>
              </div>

              <span
                className="
                  opacity-0
                  transition-all
                  duration-200
                  group-hover:opacity-100
                  group-hover:translate-x-1
                  text-cyan-300
                "
              >
                →
              </span>
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>

    <AnimatePresence>
      {isOpen && query.trim() && results.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="
            absolute
            left-0
            right-0
            mt-4
            rounded-3xl
            border
            border-white/10
            bg-[#09111F]/90
            backdrop-blur-2xl
            p-8
            text-center
          "
        >
          <div className="mb-2 text-3xl">🌍</div>

          <p className="font-medium text-white">
            No countries found
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Try searching for Japan, Canada, Italy, or Brazil.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
}
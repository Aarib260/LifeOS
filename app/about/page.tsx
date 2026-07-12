"use client";

import { motion } from "framer-motion";
import { Globe2, ExternalLink, Sparkles } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/appRegistry";
import GlassPanel from "@/components/apps/habits/HabitsApp";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div variants={staggerItem} className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/15 mb-6">
            <Globe2 size={28} className="text-emerald-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">About Atlas</h1>
          <p className="text-white/60 max-w-xl mx-auto">
            An interactive world explorer built for curious minds who want to
            discover the planet, one country at a time.
          </p>
        </motion.div>

        <motion.div variants={staggerItem} className="mb-8">
          <GlassPanel className="p-8">
            <h2 className="text-xl font-semibold mb-3">What is Atlas?</h2>
            <p className="text-white/70 leading-relaxed">
              Atlas lets you explore countries through an animated interactive
              map, dive into detailed country profiles covering culture,
              landmarks, and cuisine, and build your own list of favorites and
              places you dream of visiting. Everything runs entirely on
              static data.
            </p>
          </GlassPanel>
        </motion.div>

        <motion.div variants={staggerItem} className="mb-8">
          <GlassPanel className="p-8">
            <h2 className="text-xl font-semibold mb-3">How it was built</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Atlas is built with Next.js and TypeScript, styled with Tailwind
              CSS, and animated with Framer Motion. The interactive world map
              uses React Simple Maps. All country data lives in a single
              JSON file, and favorites and visited status are saved locally
              in your browser.
            </p>
            <div className="flex items-center gap-2 text-sm text-emerald-400">
              <Sparkles size={16} />
              <span>Built for a Hack Club hackathon</span>
            </div>
          </GlassPanel>
        </motion.div>

        <motion.div variants={staggerItem}>
          <GlassPanel className="p-8 text-center">
            <p className="text-white/60 mb-4">
              Have feedback or found a bug? This project is open source.
            </p>
            <button
              onClick={() => window.open("#", "_blank")}
              className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <ExternalLink size={16} />
              View on GitHub
            </button>
          </GlassPanel>
        </motion.div>
      </motion.div>
    </div>
  );
}

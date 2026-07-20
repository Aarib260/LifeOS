"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ParticleCanvas, type ParticleStage } from "./boot/ParticleCanvas";

interface BootScreenProps {
  onComplete: () => void;
}

/**
 * Timeline: black hold -> glowing dot -> particles drift/connect ->
 * particles converge into a ring -> wordmark fades in inside the ring ->
 * soft pulse -> calls onComplete (parent crossfades this out and reveals
 * the actual desktop underneath, already mounted).
 */
export function BootScreen({ onComplete }: BootScreenProps) {
  const [stage, setStage] = useState<ParticleStage>("hidden");
  const [showWordmark, setShowWordmark] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setStage("dot"), 300);
    const t2 = setTimeout(() => setStage("drift"), 700);
    const t3 = setTimeout(() => setStage("converge"), 1900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleConverged = () => {
    setStage("settled");
    setShowWordmark(true);
    // Hold on the settled/pulsing logo briefly before handing off.
    setTimeout(onComplete, 1100);
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center bg-[#0A0E14]">
      <ParticleCanvas stage={stage} onConverged={handleConverged} />

      <AnimatePresence>
        {showWordmark && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: [0.85, 1.06, 1] }}
            transition={{ duration: 0.9, times: [0, 0.6, 1], ease: "easeOut" }}
            className="relative flex flex-col items-center gap-1"
          >
            <span className="text-lg font-semibold tracking-tight text-[#F4EEE2]">
              LifeOS
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";

export default function Particles() {
  return (
    <>
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 1, 0.2],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
          }}
          className="absolute w-1 h-1 rounded-full bg-cyan-300/50"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </>
  );
}
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Carousel from "./Carousel";
import { heroSlides } from "@/lib/data";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden">
      {/* Parallax background carousel */}
      <motion.div style={{ y }} className="absolute inset-0">
        <Carousel slides={heroSlides} />
      </motion.div>

      {/* Content overlay */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4 text-sm tracking-[0.3em] uppercase text-ivory/80"
        >
          Luxury Redefined
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="font-serif text-5xl leading-tight tracking-wide text-ivory md:text-7xl lg:text-8xl"
        >
          Irham Jaya
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="my-6 h-px w-20 bg-gold"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="max-w-md text-base leading-relaxed text-ivory/80 md:text-lg"
        >
          Exquisite jewelry crafted with unparalleled artistry
          and the finest precious materials
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="mt-10 flex gap-4"
        >
          <a
            href="#collection"
            className="rounded-full border border-ivory bg-ivory px-8 py-3 text-sm tracking-widest uppercase text-charcoal transition-all duration-300 hover:bg-transparent hover:text-ivory"
          >
            Explore Collection
          </a>
          <a
            href="#catalog"
            className="rounded-full border border-ivory/40 px-8 py-3 text-sm tracking-widest uppercase text-ivory transition-all duration-300 hover:border-ivory hover:bg-ivory/10"
          >
            View Catalog
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="h-10 w-6 rounded-full border border-ivory/40 p-1"
        >
          <div className="mx-auto h-2 w-0.5 rounded-full bg-ivory/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}

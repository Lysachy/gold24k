"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import SectionWrapper from "./SectionWrapper";

export default function BrandStory() {
  return (
    <SectionWrapper className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative aspect-[4/5] overflow-hidden rounded-xl"
        >
          <Image
            src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&q=80"
            alt="Jewelry craftsmanship"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="space-y-8"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-gold-dark">
            Our Story
          </p>
          <h2 className="font-serif text-4xl leading-snug tracking-wide text-charcoal md:text-5xl">
            Crafted with
            <br />
            Intention
          </h2>
          <div className="h-px w-16 bg-gold" />
          <p className="text-base leading-relaxed text-charcoal/70 md:text-lg">
            Each piece in our collection is a testament to generations of
            artisanal excellence. Our master jewelers pour their passion into
            every curve, every setting, every polished surface — creating
            heirlooms that transcend time.
          </p>
          <p className="text-base leading-relaxed text-charcoal/70 md:text-lg">
            From sourcing the finest ethically mined gemstones to the final
            hand-finishing, we believe luxury should be felt in every detail.
          </p>
          <a
            href="#"
            className="inline-block border-b border-charcoal/30 pb-1 text-sm tracking-widest uppercase text-charcoal transition-colors duration-300 hover:border-gold hover:text-gold-dark"
          >
            Discover Our Heritage
          </a>
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="mt-24 overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="flex whitespace-nowrap"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="mx-8 font-serif text-6xl tracking-widest text-taupe md:text-8xl"
            >
              Elegance
            </span>
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

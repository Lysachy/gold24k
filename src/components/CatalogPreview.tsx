"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import SectionWrapper from "./SectionWrapper";
import { catalogCategories } from "@/lib/data";

export default function CatalogPreview() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <SectionWrapper id="catalog">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-xs tracking-[0.3em] uppercase text-gold-dark">
            Browse
          </p>
          <h2 className="font-serif text-4xl tracking-wide text-charcoal md:text-5xl">
            Signature Catalog
          </h2>
          <div className="mx-auto mt-6 h-px w-16 bg-gold" />
        </motion.div>
      </div>

      {/* Horizontal scroll */}
      <div
        ref={scrollRef}
        className="hide-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 md:px-12 lg:px-24"
      >
        {catalogCategories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="relative flex-shrink-0 snap-center cursor-pointer overflow-hidden rounded-xl"
            style={{ width: "min(80vw, 360px)", aspectRatio: "3/4" }}
          >
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(max-width: 768px) 80vw, 360px"
              className="object-cover transition-transform duration-700 ease-out hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <h3 className="font-serif text-2xl tracking-wide text-ivory">
                {category.name}
              </h3>
              <p className="mt-1 text-sm tracking-widest text-ivory/70">
                {category.count} Pieces
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/catalog"
          className="inline-block rounded-full border border-charcoal/20 px-10 py-3 text-xs tracking-[0.2em] uppercase text-charcoal transition-all duration-500 hover:border-charcoal hover:bg-charcoal hover:text-ivory"
        >
          View Full Catalog
        </Link>
      </div>
    </SectionWrapper>
  );
}

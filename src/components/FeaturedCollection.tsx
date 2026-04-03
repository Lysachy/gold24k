"use client";

import SectionWrapper from "./SectionWrapper";
import ProductCard from "./ProductCard";
import { featuredProducts } from "@/lib/data";
import { motion } from "framer-motion";

export default function FeaturedCollection() {
  return (
    <SectionWrapper id="collection" className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <p className="mb-3 text-xs tracking-[0.3em] uppercase text-gold-dark">
          Curated Selection
        </p>
        <h2 className="font-serif text-4xl tracking-wide text-charcoal md:text-5xl">
          Featured Collection
        </h2>
        <div className="mx-auto mt-6 h-px w-16 bg-gold" />
      </motion.div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {featuredProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
            index={index}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}

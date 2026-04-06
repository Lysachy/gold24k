"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface ProductCardProps {
  name: string;
  price: string;
  image: string;
  index: number;
  purity?: string | null;
}

export default function ProductCard({
  name,
  price,
  image,
  index,
  purity,
}: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
      whileHover={{ scale: 1.03 }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-taupe">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {purity && (
          <div className="absolute top-3 right-3 flex h-12 w-12 items-center justify-center rounded-full bg-gold/90 backdrop-blur-sm">
            <span className="text-base font-bold tracking-wide text-ivory">{purity}</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-charcoal/90 to-transparent transition-opacity duration-500 group-hover:from-charcoal" />
        <div className="absolute bottom-0 left-0 p-5">
          <h3 className="text-sm font-semibold tracking-[0.15em] uppercase text-ivory">
            {name}
          </h3>
          <p className="mt-1 text-sm font-medium tracking-widest text-ivory/70">{price}</p>
        </div>
      </div>
    </motion.div>
  );
}

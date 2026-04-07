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
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg className="h-16 w-16 text-charcoal/20" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
          </div>
        )}
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
          {price && <p className="mt-1 text-sm font-medium tracking-widest text-ivory/70">{price}</p>}
        </div>
      </div>
    </motion.div>
  );
}

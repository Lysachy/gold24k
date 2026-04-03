"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface ProductCardProps {
  name: string;
  price: string;
  image: string;
  index: number;
}

export default function ProductCard({
  name,
  price,
  image,
  index,
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
        <div className="absolute inset-0 bg-charcoal/0 transition-colors duration-500 group-hover:bg-charcoal/10" />
      </div>
      <div className="mt-5 space-y-1">
        <h3 className="font-serif text-lg tracking-wide text-charcoal">
          {name}
        </h3>
        <p className="text-sm tracking-widest text-charcoal/60">{price}</p>
      </div>
    </motion.div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Slide {
  image: string;
  headline: string;
  subtext: string;
}

interface CarouselProps {
  slides: Slide[];
}

export default function Carousel({ slides }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const variants = {
    enter: (dir: number) => ({ opacity: 0, scale: 1.05, x: dir > 0 ? 100 : -100 }),
    center: { opacity: 1, scale: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, scale: 0.98, x: dir > 0 ? -100 : 100 }),
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={slides[current].image}
            alt={slides[current].headline}
            fill
            priority={current === 0}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/30" />
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-500 ${
              i === current ? "w-8 bg-ivory" : "w-2 bg-ivory/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

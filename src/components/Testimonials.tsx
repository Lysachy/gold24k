"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionWrapper from "./SectionWrapper";
import { testimonials } from "@/lib/data";

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <SectionWrapper className="bg-taupe/40">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-xs tracking-[0.3em] uppercase text-gold-dark">
          Testimonials
        </p>
        <h2 className="mb-16 font-serif text-4xl tracking-wide text-charcoal md:text-5xl">
          Voices of Elegance
        </h2>

        <div className="relative min-h-[200px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="space-y-8"
            >
              <p className="font-serif text-2xl leading-relaxed text-charcoal/80 italic md:text-3xl">
                &ldquo;{testimonials[current].quote}&rdquo;
              </p>
              <div>
                <p className="text-sm tracking-widest uppercase text-charcoal">
                  {testimonials[current].author}
                </p>
                <p className="mt-1 text-xs tracking-wider text-charcoal/50">
                  {testimonials[current].title}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="mt-12 flex justify-center gap-3">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-500 ${
                i === current
                  ? "w-8 bg-gold"
                  : "w-2 bg-charcoal/20"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

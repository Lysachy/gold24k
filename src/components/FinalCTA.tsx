"use client";

import { motion } from "framer-motion";
import SectionWrapper from "./SectionWrapper";

export default function FinalCTA() {
  return (
    <SectionWrapper className="py-32">
      <div className="mx-auto max-w-2xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-xs tracking-[0.3em] uppercase text-gold-dark"
        >
          Begin Your Journey
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-4xl leading-snug tracking-wide text-charcoal md:text-6xl"
        >
          Find the Piece That
          <br />
          Speaks to You
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto my-8 h-px w-16 bg-gold"
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-10 text-base leading-relaxed text-charcoal/60 md:text-lg"
        >
          Every masterpiece awaits its destined owner.
          Let us guide you to yours.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <a
            href="#"
            className="group inline-flex items-center gap-3 rounded-full bg-charcoal px-10 py-4 text-sm tracking-widest uppercase text-ivory transition-all duration-300 hover:bg-charcoal/90 hover:shadow-lg"
          >
            <span>Book a Consultation</span>
            <motion.span
              className="inline-block"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              &rarr;
            </motion.span>
          </a>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

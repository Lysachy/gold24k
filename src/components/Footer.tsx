"use client";

import { motion } from "framer-motion";

const navLinks = ["Collection", "About", "Journal", "Contact"];
const socialLinks = ["Instagram", "Pinterest", "Twitter"];

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="border-t border-taupe px-6 py-16 md:px-12 lg:px-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl tracking-widest text-charcoal">
              Irham Jaya
            </h3>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-charcoal/50">
              Exquisite jewelry for those who appreciate the art of
              timeless elegance.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="mb-4 text-xs tracking-[0.2em] uppercase text-charcoal/40">
              Navigation
            </p>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm tracking-wider text-charcoal/60 transition-colors duration-300 hover:text-charcoal"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="mb-4 text-xs tracking-[0.2em] uppercase text-charcoal/40">
              Follow Us
            </p>
            <ul className="space-y-3">
              {socialLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm tracking-wider text-charcoal/60 transition-colors duration-300 hover:text-charcoal"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-taupe pt-8 md:flex-row">
          <p className="text-xs tracking-wider text-charcoal/40">
            &copy; 2026 Irham Jaya. All rights reserved.
          </p>
          <p className="text-xs tracking-wider text-charcoal/40">
            Crafted with care
          </p>
        </div>
      </div>
    </motion.footer>
  );
}

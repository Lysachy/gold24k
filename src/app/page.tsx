"use client";

import Hero from "@/components/Hero";
import FeaturedCollection from "@/components/FeaturedCollection";
import BrandStory from "@/components/BrandStory";
import CatalogPreview from "@/components/CatalogPreview";
import Testimonials from "@/components/Testimonials";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedCollection />
      <BrandStory />
      <CatalogPreview />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  );
}

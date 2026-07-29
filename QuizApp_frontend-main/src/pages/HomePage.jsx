/**
 * HomePage.jsx — Landing Page
 * ─────────────────────────────────────────────
 * Composes Hero → Features → BannerSlider →
 * Testimonials → Footer into a single page.
 */

import Hero from "../components/Hero";
import Features from "../components/Features";
import BannerSlider from "../components/BannerSlider";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <BannerSlider />
      <Testimonials />
      <Footer />
    </>
  );
}

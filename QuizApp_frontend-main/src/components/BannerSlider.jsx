/**
 * BannerSlider.jsx — Category Carousel
 * ─────────────────────────────────────────────
 * Swiper-powered carousel showcasing quiz categories
 * with autoplay, responsive breakpoints, and dark mode.
 */

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

/* ── Banner slide data ── */
const banners = [
  {
    title: "Science & Technology",
    subtitle: "Explore the wonders of the universe",
    gradient: "from-blue-600 to-cyan-500",
    emoji: "🔬",
  },
  {
    title: "History & Culture",
    subtitle: "Travel through time and civilisations",
    gradient: "from-amber-600 to-yellow-400",
    emoji: "🏛️",
  },
  {
    title: "Mathematics",
    subtitle: "Sharpen your logical thinking",
    gradient: "from-emerald-600 to-teal-400",
    emoji: "📐",
  },
  {
    title: "General Knowledge",
    subtitle: "A little bit of everything",
    gradient: "from-purple-600 to-pink-500",
    emoji: "🧠",
  },
  {
    title: "Programming",
    subtitle: "Code your way to the top",
    gradient: "from-gray-800 to-gray-600",
    emoji: "💻",
  },
];

export default function BannerSlider() {
  return (
    <section className="bg-white py-24 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <span className="mb-2 inline-block rounded-full bg-indigo-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            Categories
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
            Browse Quiz <span className="text-indigo-600 dark:text-indigo-400">Categories</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            From science to pop culture — there's something for everyone.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="!pb-12"
          >
            {banners.map(({ title, subtitle, gradient, emoji }) => (
              <SwiperSlide key={title}>
                <div
                  className={`relative flex h-56 flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-8 text-center text-white shadow-lg transition-transform duration-300 hover:scale-[1.03]`}
                >
                  {/* decorative circle */}
                  <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
                  <span className="mb-3 text-5xl">{emoji}</span>
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="mt-1 text-sm text-white/80">{subtitle}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}

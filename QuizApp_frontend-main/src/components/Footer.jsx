/**
 * Footer.jsx — Site Footer
 * ─────────────────────────────────────────────
 * 4-column layout: Brand + socials, Quick Links,
 * Resources, Contact info. Bottom copyright bar.
 * Already uses a dark bg (gray-900) so minimal dark: overrides.
 */

import { Link } from "react-router-dom";
import {
  Brain,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "Quizzes", path: "/quizzes" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Admin", path: "/admin" },
  { name: "Login", path: "/login" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* ── Brand ── */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2">
              <Brain className="h-8 w-8 text-indigo-400" />
              <span className="text-xl font-extrabold text-white">
                Quiz<span className="text-indigo-400">Master</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              The smartest quiz platform to test your knowledge, track your
              growth, and compete with learners around the world.
            </p>

            {/* Social icons */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 text-gray-400 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-600 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map(({ name, path }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="text-sm text-gray-400 transition-colors duration-200 hover:text-indigo-400"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Resources ── */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Resources
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <a href="#" className="transition-colors duration-200 hover:text-indigo-400">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors duration-200 hover:text-indigo-400">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors duration-200 hover:text-indigo-400">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors duration-200 hover:text-indigo-400">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                123 Quiz Street, Knowledge City, India
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="h-4 w-4 shrink-0 text-indigo-400" />
                <a href="mailto:hello@quizmaster.com" className="transition-colors duration-200 hover:text-indigo-400">
                  hello@quizmaster.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="h-4 w-4 shrink-0 text-indigo-400" />
                <a href="tel:+911234567890" className="transition-colors duration-200 hover:text-indigo-400">
                  +91 12345 67890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} QuizMaster. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

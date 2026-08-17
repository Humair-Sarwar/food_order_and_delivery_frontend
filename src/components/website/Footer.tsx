import React from "react";
import logo from "../../assets/images/logo.png";
import { NavLink } from "react-router-dom";

interface FooterProps {
  settings?: {
    id?: number;
    site_name?: string;
    email?: string | null;
    phone?: string | null;
    whatsapp_number?: string | null;
    whatsapp_enabled?: boolean;
    footer_description?: string | null;
    logo_id?: string | null;
    cod_enabled?: boolean;
    digital_payment_enabled?: boolean;
    logo?: {
      id: string;
      media_path: string;
    } | null;
  };
}

// Reusable SVG wrapper for clean look
const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-5 h-5 text-orange-500">{children}</div>
);

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  return (
    <footer className="bg-[#0a0a0a] text-gray-400 py-20 px-6 border-t rounded-tl-4xl rounded-tr-4xl border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
        {/* Brand Section */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 cursor-pointer">
            <NavLink
              to={"/"}
              className="w-32 h-12 sm:w-40 sm:h-14 overflow-hidden flex items-center justify-center -ml-2 sm:-ml-3"
            >
              <img
                src={
                  settings?.logo?.media_path
                    ? `${API_BASE_URL}/storage/${settings.logo.media_path}`
                    : logo
                }
                alt={
                  settings?.site_name ||
                  "Online Food Ordering & Delivery System Logo"
                }
                className="w-full h-full object-contain"
              />
            </NavLink>
          </div>
          <p className="text-sm leading-relaxed">
            {settings?.footer_description
              ? settings?.footer_description
              : "Order your favorite meals from the best restaurants around you. Browse menus, discover delicious food, place your order with ease, and enjoy convenient doorstep delivery—all in one place."}
          </p>
        </div>

        {/* Links */}
        <div className="space-y-6">
          <h4 className="text-sm font-bold text-white uppercase tracking-widest">
            Platform
          </h4>
          <ul className="space-y-3 text-sm">
            {["Menu", "How it Works", "Careers", "Gift Cards"].map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="hover:text-orange-500 transition-colors duration-300"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-6">
          <h4 className="text-sm font-bold text-white uppercase tracking-widest">
            Support
          </h4>
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <IconWrapper>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </IconWrapper>
              <a
                href={`tel:${settings?.phone ? settings?.phone : "+92 300 0000000"}`}
              >
                {settings?.phone ? settings?.phone : "+92 300 0000000"}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <IconWrapper>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </IconWrapper>
              <a
                href={`mailto:${settings?.email ? settings?.email : "hello@ofods.pk"}`}
              >
                {settings?.email ? settings?.email : "hello@ofods.pk"}
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="space-y-6">
          <h4 className="text-sm font-bold text-white uppercase tracking-widest">
            Stay Updated
          </h4>
          <div className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-500 transition-all"
            />
            <button className="bg-orange-600 cursor-pointer hover:bg-orange-500 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-orange-600/20">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-xs">© 2026 OFODS. All rights reserved.</p>
        <div className="flex gap-8 text-xs font-medium">
          <a href="#" className="hover:text-white transition">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

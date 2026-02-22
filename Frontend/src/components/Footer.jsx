import React from "react";
import { Mail, Phone, MapPin, ChevronRight } from "lucide-react";
import logo4 from '../assets/logo4.png';
import logo3 from '../assets/logo3.png';

export default function Footer() {
  return (
    <footer className="bg-[#2A2A00] text-white py-8 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* BRAND + DESCRIPTION */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src={logo3} className="w-9 h-9" alt="logo" />
            <img src={logo4} className="w-15 h-8" alt="logo" />
          </div>

          <p className="text-gray-300 leading-relaxed mb-4 text-sm">
            To empower farmers with accessible, AI-driven tools that enable early detection
            of crop diseases, improve yields, and promote sustainable farming practices —
            no matter where they live or farm.
          </p>
        </div>

        {/* EXPLORE LINKS */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Explore</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="flex items-center gap-2">
              <ChevronRight className="text-green-400" size={18} /> About
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="text-green-400" size={18} /> Services
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="text-green-400" size={18} /> Contact & FAQ
            </li>
          </ul>
        </div>

        {/* CONTACT INFO */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>

          <div className="flex items-center gap-2 text-gray-300 text-sm mb-2">
            <Phone className="text-green-400" size={18} />
            9999888222
          </div>

          <div className="flex items-center gap-2 text-gray-300 text-sm mb-2">
            <Mail className="text-green-400" size={18} />
            agriiq@gmail.com
          </div>

          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <MapPin className="text-green-400" size={18} />
            XYZ Sample Street
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="text-center text-gray-400 text-xs mt-4 border-t border-gray-700 pt-2 pb-2">
        © All Copyright 2024 by Shawon Etc Themes
        <div className="mt-1">
          <span className="cursor-pointer hover:text-white">Terms of Use</span> |
          <span className="ml-2 cursor-pointer hover:text-white">Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
}
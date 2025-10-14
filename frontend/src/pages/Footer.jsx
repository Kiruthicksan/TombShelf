// components/Footer.jsx
import { NavLink } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              TomeShelf
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed max-w-md">
              Your digital library for discovering and reading amazing books. 
              Explore thousands of titles and build your personal collection.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">
              Explore
            </h4>
            <ul className="space-y-2">
              <li>
                <NavLink 
                  to="/" 
                  className="text-gray-500 hover:text-gray-800 text-sm transition-colors"
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/library" 
                  className="text-gray-500 hover:text-gray-800 text-sm transition-colors"
                >
                  Novels
                </NavLink>
              </li>
             
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <NavLink 
                  to="/contact" 
                  className="text-gray-500 hover:text-gray-800 text-sm transition-colors"
                >
                  Contact Us
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/help" 
                  className="text-gray-500 hover:text-gray-800 text-sm transition-colors"
                >
                  Help Center
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/privacy" 
                  className="text-gray-500 hover:text-gray-800 text-sm transition-colors"
                >
                  Privacy Policy
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/terms" 
                  className="text-gray-500 hover:text-gray-800 text-sm transition-colors"
                >
                  Terms of Service
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-100 mt-8 pt-6">
          {/* Copyright & Disclaimer */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <div className="text-gray-500 text-sm mb-4 md:mb-0 text-center md:text-left">
              © {currentYear} TomeShelf. All rights reserved.
            </div>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
             
              <a
                href="#"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="mailto:support@tomeshelf.com"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Personal Project Disclaimer */}
          <div className="text-center">
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">
              <strong>Disclaimer:</strong> This is a personal project for portfolio purposes. 
              I do not claim ownership of any book content, images, or intellectual property 
              displayed on this platform. All copyrighted materials belong to their respective owners.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
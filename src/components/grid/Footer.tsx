import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Send } from 'lucide-react';
import { toast } from 'sonner';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Thank you for subscribing to GRID Furniture exclusive offers!');
    setEmail('');
  };

  return (
    <footer className="bg-[#111111] text-neutral-300 pt-16 pb-12 border-t border-neutral-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-16 border-b border-neutral-800">
          
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-heading font-black tracking-widest text-2xl text-white">
                GRID
              </span>
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed font-light">
              Modern work furniture in Bangladesh. High quality office Desk, Chair, Cabinet, shelves, and ergonomic chairs with up to 5 years warranty.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2 text-neutral-400">
              <a
                href="https://www.instagram.com/gridfurnitures"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:text-white hover:border-neutral-600 transition-colors"
                title="Follow us on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/99grid"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:text-white hover:border-neutral-600 transition-colors"
                title="Follow us on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@gridfurniture5735"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:text-white hover:border-neutral-600 transition-colors"
                title="Watch on YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-white text-base tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-400 font-normal">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-white transition-colors">
                  Search & Explore
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Know More About GRID
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/pages/warranty" className="hover:text-white transition-colors">
                  Return & Warranty Policy
                </Link>
              </li>
              <li>
                <Link to="/policies/terms-of-service" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Product Collections */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-white text-base tracking-wide">
              Collections
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-400 font-normal">
              <li>
                <Link to="/collections/chair" className="hover:text-white transition-colors">
                  GRID Chair Collection
                </Link>
              </li>
              <li>
                <Link to="/collections/chair" className="hover:text-white transition-colors">
                  Steelcase Chair Collection
                </Link>
              </li>
              <li>
                <Link to="/collections/table" className="hover:text-white transition-colors">
                  GRID Table & Desk Collection
                </Link>
              </li>
              <li>
                <Link to="/collections/sofa" className="hover:text-white transition-colors">
                  GRID Sofa Collection
                </Link>
              </li>
              <li>
                <Link to="/collections/storage" className="hover:text-white transition-colors">
                  GRID Storage Solutions
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-white transition-colors">
                  All Collections
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter Subscription */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-white text-base tracking-wide">
              Stay Connected
            </h4>
            <p className="text-sm text-neutral-400 font-light leading-relaxed">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-full text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-white hover:bg-neutral-200 text-black text-xs font-semibold rounded-full flex items-center justify-center transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            <div className="text-xs text-neutral-500 pt-1">
              Hotline: +880 1700-009947 (10 AM - 8 PM)
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Payment icons */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © 2026 GRID Furniture • GRID Ventures Ltd. All rights reserved.
          </div>

          {/* Supported payment badges */}
          <div className="flex items-center gap-3 text-neutral-400 font-medium">
            <span className="px-2.5 py-1 bg-neutral-900 rounded border border-neutral-800">
              bKash
            </span>
            <span className="px-2.5 py-1 bg-neutral-900 rounded border border-neutral-800">
              Nagad
            </span>
            <span className="px-2.5 py-1 bg-neutral-900 rounded border border-neutral-800">
              Visa
            </span>
            <span className="px-2.5 py-1 bg-neutral-900 rounded border border-neutral-800">
              Mastercard
            </span>
            <span className="px-2.5 py-1 bg-neutral-900 rounded border border-neutral-800">
              COD
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

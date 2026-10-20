import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Search, ShoppingBag, User, Menu, X, ChevronDown, PhoneCall, ShieldCheck, Truck } from 'lucide-react';

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const { totalItems, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collectionDropdownOpen, setCollectionDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const collectionLinks = [
    { label: 'All Chairs', href: '/collections/chair' },
    { label: 'All Tables & Desks', href: '/collections/table' },
    { label: 'Sofa Collection', href: '/collections/sofa' },
    { label: 'Storage & Credenzas', href: '/collections/storage' },
    { label: 'Steelcase Executive Chairs', href: '/collections/chair' },
    { label: 'All Collections', href: '/collections' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#111111] text-white text-xs py-2 px-4 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-center">
          <div className="flex items-center gap-4 text-[13px] text-neutral-300 font-sans tracking-wide">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-neutral-400" />
              Free Home Delivery with assembly inside Dhaka within 3 working days
            </span>
          </div>
          <div className="flex items-center gap-4 text-neutral-400 text-xs font-sans">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-300" /> Up to 5 Years Warranty
            </span>
            <span className="hidden md:inline-block text-neutral-600">|</span>
            <span className="hidden md:flex items-center gap-1 text-neutral-300">
              <PhoneCall className="w-3.5 h-3.5" /> Hotline: +880 1700-009947
            </span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-200 py-3.5'
            : 'bg-white border-b border-neutral-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Left: Mobile hamburger & Brand Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 text-neutral-800 hover:text-black transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <img
                src="https://99grid.com/cdn/shop/files/saffasfasf_100x.png?v=1652710673"
                alt="GRID Furniture"
                className="h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-[1.02]"
                onError={(e) => {
                  // Fallback to text logo if image fails
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="font-heading font-black tracking-widest text-xl sm:text-2xl text-neutral-900 uppercase">
                GRID
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 font-sans text-[15px] font-medium text-neutral-800">
            {/* All Collection Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setCollectionDropdownOpen(true)}
              onMouseLeave={() => setCollectionDropdownOpen(false)}
            >
              <button
                onClick={() => navigate('/collections')}
                className="flex items-center gap-1 py-2 text-neutral-900 hover:text-black transition-colors"
              >
                All Collection
                <ChevronDown className="w-4 h-4 text-neutral-500 transition-transform group-hover:rotate-180" />
              </button>

              {/* Dropdown Menu */}
              {collectionDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-md shadow-xl border border-neutral-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {collectionLinks.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      className="block px-5 py-2.5 text-sm text-neutral-700 hover:text-black hover:bg-neutral-50 font-normal transition-colors"
                      onClick={() => setCollectionDropdownOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/collections/table"
              className="py-2 text-neutral-800 hover:text-black transition-colors hover:underline underline-offset-8"
            >
              Elevating Desk Series
            </Link>
            <Link
              to="/pages/grid-studio"
              className="py-2 text-neutral-800 hover:text-black transition-colors hover:underline underline-offset-8"
            >
              Grid Studio
            </Link>
            <a
              href="https://www.youtube.com/channel/UCerNlR7eZVNTqn_Z90t-Tjg/videos"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 text-neutral-800 hover:text-black transition-colors hover:underline underline-offset-8"
            >
              Videos
            </a>
            <Link
              to="/blog"
              className="py-2 text-neutral-800 hover:text-black transition-colors hover:underline underline-offset-8"
            >
              Articles
            </Link>
            <Link
              to="/about"
              className="py-2 text-neutral-800 hover:text-black transition-colors hover:underline underline-offset-8"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="py-2 text-neutral-800 hover:text-black transition-colors hover:underline underline-offset-8"
            >
              Contact
            </Link>
          </nav>

          {/* Right: Search, Account, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-full transition-colors"
              title="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account */}
            <Link
              to="/login"
              className="p-2 text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-full transition-colors hidden sm:flex"
              title="Customer Login"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart Trigger with live count */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-neutral-900 hover:text-black hover:bg-neutral-100 rounded-full transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-in zoom-in-50">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-out Menu */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl z-50 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-5 border-b border-neutral-100">
                <span className="font-heading font-black tracking-widest text-xl text-neutral-900">
                  GRID FURNITURE
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-neutral-500 hover:text-black"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Links */}
              <div className="p-5 space-y-4 font-sans text-base">
                <div className="border-b border-neutral-100 pb-3">
                  <div className="font-semibold text-neutral-900 mb-2">Collections</div>
                  <div className="pl-3 space-y-2.5 text-sm text-neutral-600">
                    {collectionLinks.map((item) => (
                      <Link
                        key={item.label}
                        to={item.href}
                        className="block hover:text-black"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link
                  to="/collections/table"
                  className="block text-neutral-800 font-medium hover:text-black"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Elevating Desk Series
                </Link>
                <Link
                  to="/pages/grid-studio"
                  className="block text-neutral-800 font-medium hover:text-black"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Grid Studio
                </Link>
                <a
                  href="https://www.youtube.com/channel/UCerNlR7eZVNTqn_Z90t-Tjg/videos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-neutral-800 font-medium hover:text-black"
                >
                  Videos
                </a>
                <Link
                  to="/blog"
                  className="block text-neutral-800 font-medium hover:text-black"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Articles
                </Link>
                <Link
                  to="/about"
                  className="block text-neutral-800 font-medium hover:text-black"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="block text-neutral-800 font-medium hover:text-black"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  to="/login"
                  className="block text-neutral-800 font-medium hover:text-black pt-2 border-t border-neutral-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In / Account
                </Link>
              </div>
            </div>

            {/* Drawer Footer Hotline */}
            <div className="p-5 bg-neutral-50 border-t border-neutral-100 text-xs text-neutral-500 space-y-1">
              <p className="font-semibold text-neutral-800">GRID Furniture Bangladesh</p>
              <p>Hotline: +880 1700-009947</p>
              <p>Delivery all over Bangladesh</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

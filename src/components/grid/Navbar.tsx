"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  LayoutDashboard,
  ShieldCheck,
  Package,
  Settings,
  LogOut,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { UEFLogo } from "../ui/UEFLogo";
import { useCart } from "../../context/CartContext";
import { useAppDispatch, useAppSelector, logout, setUser, UserRole } from "@/redux";
import {
  clearAuthCookies,
  getClientCookie,
  getHomeRouteForRole,
  isAdminRole,
  isJwtTokenValid,
  normalizeRoleString,
  parseJwtPayload,
} from "@/lib/authCookies";
import { useGetUserQuery } from "@/redux/service/profileData";
import { useLogoutMutation } from "@/redux/service/auth/authApi";
import {
  CATEGORIES,
  CHAIR_PRODUCTS,
  TABLE_PRODUCTS,
  FOOTER_PROMOTIONS,
} from "@/data/gridData";

interface NavbarProps {
  onOpenSearch: () => void;
}

interface MobileCategoryGroup {
  label: string;
  href?: string;
  subItems?: { label: string; href: string; tag?: string }[];
}

const MOBILE_CATEGORIES: MobileCategoryGroup[] = [
  {
    label: "New & Featured",
    subItems: [
      { label: "All Collections", href: "/collections", tag: "Catalog" },
      { label: "CNC Laser Cut Desks", href: "/collections/table" },
      { label: "Ergonomic Seating", href: "/collections/chair" },
      { label: "Metal Racks & Storage", href: "/collections/storage" },
    ],
  },
  {
    label: "Desks & Workstations",
    subItems: [
      { label: "All Tables & Desks", href: "/collections/table" },
      { label: "Gaming & Dual-Setup Desks", href: "/collections/table" },
      { label: "Executive Office Tables", href: "/collections/table" },
      { label: "Custom Size Desk Quote", href: "/contact", tag: "Bespoke" },
    ],
  },
  {
    label: "Ergonomic Chairs",
    subItems: [
      { label: "All Seating", href: "/collections/chair" },
      { label: "Pro Ergonomic Mesh", href: "/collections/chair" },
      { label: "Studio & Task Chairs", href: "/collections/chair" },
    ],
  },
  {
    label: "Storage & Steel Racks",
    subItems: [
      { label: "All Storage Systems", href: "/collections/storage" },
      { label: "Slotted Metal Racks", href: "/collections/storage" },
      { label: "Credenzas & Organizers", href: "/collections/storage" },
    ],
  },
  {
    label: "CNC Laser Fabrication",
    subItems: [
      { label: "Custom Laser-Cut Gates & Panels", href: "/contact" },
      { label: "Electrical Panel Enclosures", href: "/contact" },
      { label: "Grid Studio & Corporate Projects", href: "/pages/grid-studio" },
    ],
  },
  {
    label: "Custom Size Order",
    href: "/contact",
  },
  {
    label: "5-Year Warranty",
    href: "/warranty",
  },
];

interface MegaMenuColumn {
  heading: string;
  links: { label: string; href: string; emphasize?: boolean }[];
}

interface MegaMenuCard {
  title: string;
  href: string;
  image: string;
}

interface DesktopMegaMenu {
  key: string;
  label: string;
  href: string;
  columns: [MegaMenuColumn, MegaMenuColumn];
  cards: [MegaMenuCard, MegaMenuCard, MegaMenuCard, MegaMenuCard];
}

const DESKTOP_MEGA_MENUS: DesktopMegaMenu[] = [
  {
    key: "collections",
    label: "Collections",
    href: "/collections",
    columns: [
      {
        heading: "Categories",
        links: [
          { label: "Ergonomic Chairs", href: "/collections/chair" },
          { label: "Desks & Tables", href: "/collections/table" },
          { label: "Storage & Racks", href: "/collections/storage" },
          { label: "Lounge Sofas", href: "/collections/sofa" },
          { label: "Custom CNC Steel", href: "/contact" },
          { label: "Shop All", href: "/collections", emphasize: true },
        ],
      },
      {
        heading: "Curated Series",
        links: [
          { label: "Motorized Standing", href: "/collections/table" },
          { label: "Executive Seating", href: "/collections/chair" },
          { label: "Studio & Corporate", href: "/pages/grid-studio" },
          { label: "Shegun Solid Wood", href: "/products/grid-teakwood-table" },
          { label: "5-Year Warranty", href: "/warranty" },
        ],
      },
    ],
    cards: [
      {
        title: "All Desks & Tables",
        href: "/collections/table",
        image: CATEGORIES[1].image,
      },
      {
        title: "Ergonomic Seating",
        href: "/collections/chair",
        image: CHAIR_PRODUCTS[0].images[0],
      },
      {
        title: "Modular Storage",
        href: "/collections/storage",
        image: CATEGORIES[3].image,
      },
      {
        title: "Precision CNC Metal",
        href: "/pages/grid-studio",
        image: FOOTER_PROMOTIONS[1].image,
      },
    ],
  },
  {
    key: "desks",
    label: "Desks",
    href: "/collections/table",
    columns: [
      {
        heading: "By Model",
        links: [
          { label: "Elevating L-Shape Pro", href: "/products/grid-elevating-l-shape-table" },
          { label: "Dual Motor Standing", href: "/products/grid-elevating-desk-pro" },
          { label: "Single Motor Standing", href: "/products/grid-elevating-desk" },
          { label: "Supreme Conference", href: "/products/grid" },
          { label: "Quad Desk Pro", href: "/products/grid-quad-desk-pro" },
          { label: "Shop All Desks", href: "/collections/table", emphasize: true },
        ],
      },
      {
        heading: "Workspaces",
        links: [
          { label: "Creator & Coding Studio", href: "/products/grid-taskmaster-table" },
          { label: "Corner L-Layouts", href: "/products/grid-indie-desk-l-shape" },
          { label: "Solid Shegun Top", href: "/products/grid-solid-shegun-wooden-table-top" },
          { label: "Teakwood Industrial", href: "/products/grid-teakwood-table" },
          { label: "Custom Size Quote", href: "/contact" },
        ],
      },
    ],
    cards: [
      {
        title: "Elevating L-Shape Pro",
        href: "/products/grid-elevating-l-shape-table",
        image: TABLE_PRODUCTS[0].images[0],
      },
      {
        title: "Dual Motor Standing",
        href: "/products/grid-elevating-desk-pro",
        image: TABLE_PRODUCTS[1].images[0],
      },
      {
        title: "Taskmaster Studio",
        href: "/products/grid-taskmaster-table",
        image: TABLE_PRODUCTS[5].images[0],
      },
      {
        title: "Solid Shegun Wood",
        href: "/products/grid-solid-shegun-wooden-table-top",
        image: TABLE_PRODUCTS[11].images[0],
      },
    ],
  },
  {
    key: "chairs",
    label: "Chairs",
    href: "/collections/chair",
    columns: [
      {
        heading: "Categories",
        links: [
          { label: "All Office Seating", href: "/collections/chair" },
          { label: "Executive High-Back", href: "/products/grid-grand-master-chair" },
          { label: "Ergonomic Mesh", href: "/products/grid-ergofit-chair" },
          { label: "Split-Lumbar Posture", href: "/products/grid-spine-chair" },
          { label: "Compact Task Chairs", href: "/products/grid-swift-pro-chair" },
          { label: "Shop All Chairs", href: "/collections/chair", emphasize: true },
        ],
      },
      {
        heading: "Engineering Line",
        links: [
          { label: "Steelcase Leap Series", href: "/products/grid-x-steelcase-leap" },
          { label: "Haworth Fern Mesh", href: "/products/grid-x-haworth-fern" },
          { label: "Personality Plus", href: "/products/grid-x-steelcase-personality-plus" },
          { label: "5-Year Servicing", href: "/warranty" },
        ],
      },
    ],
    cards: [
      {
        title: "Steelcase Leap",
        href: "/products/grid-x-steelcase-leap",
        image: CHAIR_PRODUCTS[0].images[0],
      },
      {
        title: "Haworth Fern",
        href: "/products/grid-x-haworth-fern",
        image: CHAIR_PRODUCTS[2].images[0],
      },
      {
        title: "ErgoFit 12-Hour",
        href: "/products/grid-ergofit-chair",
        image: CHAIR_PRODUCTS[7].images[0],
      },
      {
        title: "Split Spine Series",
        href: "/products/grid-spine-chair",
        image: CHAIR_PRODUCTS[14].images[0],
      },
    ],
  },
  {
    key: "storage-cnc",
    label: "Storage & CNC",
    href: "/collections/storage",
    columns: [
      {
        heading: "Systems & Metalwork",
        links: [
          { label: "Metal Storage Systems", href: "/collections/storage" },
          { label: "Slotted Steel Racks", href: "/collections/storage" },
          { label: "Credenzas & Cabinets", href: "/collections/storage" },
          { label: "Laser-Cut Gates & Panels", href: "/contact" },
          { label: "Electrical Enclosures", href: "/contact" },
        ],
      },
      {
        heading: "Factory Services",
        links: [
          { label: "Grid Studio Fit-Outs", href: "/pages/grid-studio" },
          { label: "Custom CAD Drawings", href: "/contact" },
          { label: "Nationwide Delivery", href: "/warranty" },
          { label: "Request Quote", href: "/contact", emphasize: true },
        ],
      },
    ],
    cards: [
      {
        title: "Modern Credenzas",
        href: "/collections/storage",
        image: CATEGORIES[3].image,
      },
      {
        title: "CNC Laser Fabrication",
        href: "/pages/grid-studio",
        image: FOOTER_PROMOTIONS[1].image,
      },
      {
        title: "Factory Workstations",
        href: "/collections/table",
        image: FOOTER_PROMOTIONS[0].image,
      },
      {
        title: "Custom Sizing & Delivery",
        href: "/contact",
        image: FOOTER_PROMOTIONS[2].image,
      },
    ],
  },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const { totalItems, setIsCartOpen } = useCart();
  const dispatch = useAppDispatch();
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const [triggerLogout] = useLogoutMutation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<MobileCategoryGroup | null>(
    null
  );
  const [activeMegaKey, setActiveMegaKey] = useState<string | null>(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [cookieRole, setCookieRole] = useState<string | null>(null);
  const [tokenEmail, setTokenEmail] = useState<string | null>(null);

  const headerRef = useRef<HTMLElement>(null);
  const megaCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Check client session on mount / auth changes without SSR mismatch
  useEffect(() => {
    const token =
      accessToken || getClientCookie("accessToken") || getClientCookie("token");
    if (token && isJwtTokenValid(token)) {
      const payload = parseJwtPayload(token);
      setHasSession(true);
      setCookieRole(payload?.role || getClientCookie("role") || null);
      setTokenEmail(payload?.email || null);
    } else {
      setHasSession(false);
      setCookieRole(null);
      setTokenEmail(null);
    }
  }, [user, accessToken, pathname]);

  // Hydrate Redux user profile seamlessly across storefront pages when session cookie exists
  const { data: profileRes } = useGetUserQuery(undefined, {
    skip: !hasSession || !!user,
  });

  useEffect(() => {
    if (profileRes?.data && !user && hasSession) {
      const token =
        accessToken || getClientCookie("accessToken") || getClientCookie("token");
      const normalizedRoleStr = normalizeRoleString(profileRes.data.role);
      if (typeof document !== "undefined") {
        document.cookie = `role=${normalizedRoleStr}; path=/; max-age=86400; SameSite=Lax`;
      }
      dispatch(
        setUser({
          user: {
            id: profileRes.data._id || profileRes.data.id || "",
            name: profileRes.data.name,
            email: profileRes.data.email,
            phone: profileRes.data.phone,
            role: UserRole[normalizedRoleStr],
            avatar: profileRes.data.avatar,
          },
          accessToken: token,
          refreshToken: null,
        })
      );
    }
  }, [profileRes, user, hasSession, accessToken, dispatch]);

  const activeMega =
    DESKTOP_MEGA_MENUS.find((item) => item.key === activeMegaKey) ?? null;
  const isMegaMenuOpen = activeMega !== null;
  const isHome = pathname === "/";
  const isTransparent = isHome && !isScrolled && !isMegaMenuOpen;

  const openMegaMenu = (key: string) => {
    if (megaCloseTimerRef.current) {
      clearTimeout(megaCloseTimerRef.current);
      megaCloseTimerRef.current = null;
    }
    setAccountMenuOpen(false);
    setActiveMegaKey(key);
  };

  const scheduleCloseMegaMenu = () => {
    if (megaCloseTimerRef.current) {
      clearTimeout(megaCloseTimerRef.current);
    }
    megaCloseTimerRef.current = setTimeout(() => {
      setActiveMegaKey(null);
    }, 140);
  };

  const closeMegaMenuNow = () => {
    if (megaCloseTimerRef.current) {
      clearTimeout(megaCloseTimerRef.current);
      megaCloseTimerRef.current = null;
    }
    setActiveMegaKey(null);
  };

  useEffect(() => {
    return () => {
      if (megaCloseTimerRef.current) {
        clearTimeout(megaCloseTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close desktop mega-menu on outside click or Escape
  useEffect(() => {
    if (!isMegaMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(e.target as Node)
      ) {
        closeMegaMenuNow();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMegaMenuNow();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isMegaMenuOpen]);

  // Close desktop account dropdown on outside click or Escape
  useEffect(() => {
    if (!accountMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(e.target as Node)
      ) {
        setAccountMenuOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAccountMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [accountMenuOpen]);

  // Lock background scroll & support Escape when mobile menu is open
  useEffect(() => {
    if (!mobileMenuOpen) {
      setActiveSubmenu(null);
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    mobileDrawerRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeSubmenu) {
          setActiveSubmenu(null);
        } else {
          setMobileMenuOpen(false);
          mobileTriggerRef.current?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen, activeSubmenu]);

  // Close open menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveSubmenu(null);
    setAccountMenuOpen(false);
    closeMegaMenuNow();
  }, [pathname]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setActiveSubmenu(null);
    mobileTriggerRef.current?.focus();
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await triggerLogout().unwrap();
    } catch {}
    clearAuthCookies();
    dispatch(logout());
    setHasSession(false);
    setAccountMenuOpen(false);
    setMobileMenuOpen(false);
    setIsLoggingOut(false);
    toast.success("Signed out successfully");
    router.refresh();
  };

  const normalizedRoleStr = normalizeRoleString(user?.role || cookieRole);
  const userIsAdmin = hasSession && isAdminRole(normalizedRoleStr);
  const portalHref = hasSession ? getHomeRouteForRole(normalizedRoleStr) : "/login";
  const displayName =
    user?.name ||
    profileRes?.data?.name ||
    tokenEmail?.split("@")[0] ||
    "Account";
  const firstName = displayName.split(" ")[0] || "Account";
  const displayEmail =
    user?.email || profileRes?.data?.email || tokenEmail || "";
  const avatarUrl =
    typeof user?.avatar === "string"
      ? user.avatar
      : user?.avatar?.url || profileRes?.data?.avatar?.url || "";
  const avatarInitial = (displayName[0] || "U").toUpperCase();

  const portalLabel = userIsAdmin ? "Admin Portal" : "My Dashboard";

  return (
    <>
      {/* Subtle backdrop scrim below desktop mega-menu */}
      {isMegaMenuOpen && (
        <div
          aria-hidden="true"
          onClick={closeMegaMenuNow}
          className="hidden lg:block fixed inset-0 bg-black/15 z-30 animate-in fade-in duration-150"
        />
      )}

      {/* Main Navigation Bar */}
      <header
        ref={headerRef}
        onMouseLeave={scheduleCloseMegaMenu}
        className={`w-full transition-colors duration-200 z-40 ${
          isHome
            ? isTransparent
              ? "fixed top-0 left-0 right-0 bg-gradient-to-b from-black/55 via-black/20 to-transparent py-4 border-none text-white"
              : "fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200/80 py-3.5 text-neutral-900"
            : "sticky top-0 bg-white border-b border-stone-200/80 py-3.5 text-neutral-900 shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Mobile hamburger & Brand Logo */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              ref={mobileTriggerRef}
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-editorial-menu"
              className={`lg:hidden p-1.5 bg-transparent border-0 outline-none cursor-pointer transition-colors ${
                isTransparent
                  ? "text-white hover:text-white/80"
                  : "text-neutral-800 hover:text-black"
              }`}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" aria-hidden="true" />
            </button>

            <Link
              href="/"
              className="flex items-center group no-underline hover:no-underline"
              aria-label="Unique Engineering & Furniture"
            >
              <UEFLogo
                variant={isTransparent ? "light" : "dark"}
                size="md"
                showText={true}
              />
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav
            aria-label="Primary"
            className="hidden lg:flex items-center gap-6 xl:gap-8 font-sans text-[12.5px] font-medium uppercase tracking-[0.07em]"
          >
            {DESKTOP_MEGA_MENUS.map((menu) => {
              const isActive = activeMegaKey === menu.key;
              return (
                <button
                  key={menu.key}
                  type="button"
                  aria-expanded={isActive}
                  aria-controls="desktop-mega-menu-panel"
                  onMouseEnter={() => openMegaMenu(menu.key)}
                  onFocus={() => openMegaMenu(menu.key)}
                  onClick={() =>
                    isActive ? closeMegaMenuNow() : openMegaMenu(menu.key)
                  }
                  className={`relative py-2 bg-transparent border-0 outline-none cursor-pointer transition-colors after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0.5 after:h-[1.5px] after:transition-transform after:duration-200 after:origin-center ${
                    isTransparent
                      ? `text-white hover:text-white/85 after:bg-white ${
                          isActive ? "after:scale-x-100" : "after:scale-x-0"
                        }`
                      : `text-neutral-800 hover:text-black after:bg-neutral-900 ${
                          isActive ? "text-black after:scale-x-100" : "after:scale-x-0"
                        }`
                  }`}
                >
                  {menu.label}
                </button>
              );
            })}

            <Link
              href="/about"
              onMouseEnter={closeMegaMenuNow}
              onFocus={closeMegaMenuNow}
              className={`py-2 no-underline hover:no-underline transition-colors ${
                isTransparent
                  ? "text-white hover:text-white/85"
                  : "text-neutral-800 hover:text-black"
              }`}
            >
              About UEF
            </Link>

            <Link
              href="/contact"
              onMouseEnter={closeMegaMenuNow}
              onFocus={closeMegaMenuNow}
              className={`py-2 no-underline hover:no-underline transition-colors ${
                isTransparent
                  ? "text-cyan-200 hover:text-white"
                  : "text-cyan-700 hover:text-cyan-900"
              }`}
            >
              Custom Order
            </Link>
          </nav>

          {/* Right: Search, Cart, & Auth-Aware Account Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 1. Search Trigger */}
            <button
              type="button"
              onClick={onOpenSearch}
              className={`p-2 rounded-full bg-transparent border-0 outline-none cursor-pointer transition-colors ${
                isTransparent
                  ? "text-white hover:text-white/80 hover:bg-white/10"
                  : "text-neutral-800 hover:text-black hover:bg-neutral-100"
              }`}
              title="Search furniture &amp; metal products"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[1.6]" aria-hidden="true" />
            </button>

            {/* 2. Shopping Bag / Cart */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className={`p-2 rounded-full bg-transparent border-0 outline-none cursor-pointer transition-colors relative ${
                isTransparent
                  ? "text-white hover:text-white/80 hover:bg-white/10"
                  : "text-neutral-900 hover:text-black hover:bg-neutral-100"
              }`}
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 stroke-[1.6]" aria-hidden="true" />
                {totalItems > 0 ? (
                  <span className="absolute -top-1.5 -right-2 min-w-[17px] h-[17px] px-1 rounded-full bg-cyan-600 text-white text-[10px] font-bold flex items-center justify-center ring-[1.5px] ring-white">
                    {totalItems}
                  </span>
                ) : (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-cyan-600 rounded-full ring-[1.5px] ring-white shadow-sm"
                  />
                )}
              </div>
            </button>

            {/* 3. Account: Logged-In Avatar Dropdown vs Sign In Link */}
            {hasSession ? (
              <div ref={accountDropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    closeMegaMenuNow();
                    setAccountMenuOpen((prev) => !prev);
                  }}
                  aria-expanded={accountMenuOpen}
                  aria-haspopup="menu"
                  aria-label={`${displayName} account menu`}
                  className={`flex items-center gap-2 rounded-full pl-1 pr-2.5 py-1 transition-all cursor-pointer border ${
                    isTransparent
                      ? "bg-white/15 hover:bg-white/25 text-white border-white/25 backdrop-blur-sm"
                      : "bg-neutral-100/90 hover:bg-neutral-200/80 text-neutral-900 border-neutral-200/80"
                  }`}
                >
                  <div className="relative h-7 w-7 shrink-0">
                    <div className="h-7 w-7 rounded-full overflow-hidden bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center uppercase">
                      {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={avatarUrl}
                          alt={displayName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        avatarInitial
                      )}
                    </div>
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-1.5 ring-white"
                    />
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold max-w-[96px] truncate">
                    {firstName}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 opacity-75 transition-transform duration-150 ${
                      accountMenuOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {/* Desktop & Tablet Account Menu Popover */}
                {accountMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-white text-slate-900 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.2)] border border-slate-200/80 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    {/* User Identity Header */}
                    <div className="p-3.5 bg-slate-50/80 border-b border-slate-100 flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-slate-900 text-white text-xs font-bold flex items-center justify-center uppercase border border-slate-200">
                        {avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={avatarUrl}
                            alt={displayName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          avatarInitial
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {displayName}
                        </div>
                        {displayEmail && (
                          <div className="text-[11px] text-slate-500 truncate">
                            {displayEmail}
                          </div>
                        )}
                        <span
                          className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                            userIsAdmin
                              ? "bg-cyan-50 text-cyan-700 border border-cyan-200/80"
                              : "bg-slate-200/70 text-slate-700"
                          }`}
                        >
                          {normalizedRoleStr === "SUPER_ADMIN"
                            ? "Super Admin"
                            : userIsAdmin
                            ? "Administrator"
                            : "Customer"}
                        </span>
                      </div>
                    </div>

                    {/* Role-Specific Navigation Links */}
                    <div className="p-1.5 space-y-0.5">
                      {userIsAdmin ? (
                        <>
                          <Link
                            href="/admin"
                            role="menuitem"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 no-underline transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-cyan-600" aria-hidden="true" />
                            <span>Admin Portal</span>
                          </Link>
                          <Link
                            href="/admin/orders"
                            role="menuitem"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 no-underline transition-colors"
                          >
                            <Package className="w-4 h-4 text-slate-400" aria-hidden="true" />
                            <span>Manage Orders</span>
                          </Link>
                          <Link
                            href="/admin/settings"
                            role="menuitem"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 no-underline transition-colors"
                          >
                            <Settings className="w-4 h-4 text-slate-400" aria-hidden="true" />
                            <span>Store Settings</span>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/dashboard"
                            role="menuitem"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 no-underline transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-cyan-600" aria-hidden="true" />
                            <span>My Dashboard</span>
                          </Link>
                          <Link
                            href="/dashboard/orders"
                            role="menuitem"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 no-underline transition-colors"
                          >
                            <Package className="w-4 h-4 text-slate-400" aria-hidden="true" />
                            <span>My Orders</span>
                          </Link>
                          <Link
                            href="/dashboard/profile"
                            role="menuitem"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 no-underline transition-colors"
                          >
                            <User className="w-4 h-4 text-slate-400" aria-hidden="true" />
                            <span>Profile &amp; Address</span>
                          </Link>
                        </>
                      )}
                    </div>

                    {/* Sign Out Footer */}
                    <div className="p-1.5 border-t border-slate-100">
                      <button
                        type="button"
                        role="menuitem"
                        disabled={isLoggingOut}
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 bg-transparent border-0 cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isLoggingOut ? (
                          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        ) : (
                          <LogOut className="w-4 h-4" aria-hidden="true" />
                        )}
                        <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className={`inline-flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full transition-colors no-underline hover:no-underline ${
                  isTransparent
                    ? "text-white hover:text-white/80 hover:bg-white/10"
                    : "text-neutral-800 hover:text-black hover:bg-neutral-100"
                }`}
                title="Sign In"
                aria-label="Sign in to your account"
              >
                <User className="w-5 h-5 stroke-[1.6]" aria-hidden="true" />
                <span className="hidden sm:inline text-xs font-semibold">
                  Sign in
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* Full-Width Editorial Desktop Mega Menu */}
        {activeMega && (
          <div
            id="desktop-mega-menu-panel"
            className="hidden lg:block absolute top-full left-0 right-0 bg-white text-neutral-900 border-t border-stone-200/80 border-b border-stone-200 shadow-[0_24px_48px_-14px_rgba(15,23,42,0.14)] z-50 animate-in fade-in slide-in-from-top-1 duration-150"
          >
            <div
              key={activeMega.key}
              className="max-w-7xl mx-auto px-6 lg:px-8 py-8 grid grid-cols-12 gap-7 items-start animate-in fade-in duration-150"
            >
              {/* Left Columns: Category & Curated Link Lists */}
              {activeMega.columns.map((column, colIdx) => (
                <div
                  key={column.heading}
                  className={`col-span-2 ${
                    colIdx > 0 ? "border-l border-stone-100 pl-6" : ""
                  }`}
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-400 mb-4">
                    {column.heading}
                  </div>
                  <ul role="list" className="m-0 p-0 list-none space-y-2.5">
                    {column.links.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          onClick={closeMegaMenuNow}
                          className={`block text-[13px] leading-snug no-underline transition-colors ${
                            item.emphasize
                              ? "pt-1 font-semibold text-neutral-900 hover:text-cyan-700"
                              : "font-normal text-stone-600 hover:text-black"
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Right Columns: 4 Editorial Product/Collection Showcase Cards */}
              <div className="col-span-8 grid grid-cols-4 gap-5 pl-2">
                {activeMega.cards.map((card) => (
                  <Link
                    key={card.title}
                    href={card.href}
                    onClick={closeMegaMenuNow}
                    className="group block no-underline"
                  >
                    <div className="aspect-[4/4.3] w-full overflow-hidden bg-stone-50 border border-stone-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={card.image}
                        alt={card.title}
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-2.5 mb-0 text-[12.5px] font-medium text-stone-800 group-hover:text-black truncate transition-colors">
                      {card.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Aesop-Inspired Full-Screen Editorial Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div
          id="mobile-editorial-menu"
          ref={mobileDrawerRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
          className="fixed inset-0 z-50 h-[100svh] bg-[#fcfaf5] text-[#222220] flex flex-col lg:hidden outline-none animate-in fade-in duration-200"
        >
          {/* Minimalist Editorial Top Header */}
          <div className="flex h-16 shrink-0 items-center justify-between px-5 border-b border-stone-200/80">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="flex items-center no-underline"
              aria-label="Unique Engineering & Furniture Home"
            >
              <UEFLogo size="sm" variant="dark" showText={true} />
            </Link>

            <div className="flex items-center gap-3.5 text-[#222220]">
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  onOpenSearch();
                }}
                aria-label="Search catalog"
                className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center bg-transparent border-0 cursor-pointer text-current hover:opacity-65 transition-opacity"
              >
                <Search className="w-[18px] h-[18px] stroke-[1.6]" aria-hidden="true" />
              </button>

              {hasSession ? (
                <Link
                  href={portalHref}
                  onClick={closeMobileMenu}
                  aria-label={portalLabel}
                  className="h-7 w-7 rounded-full overflow-hidden bg-stone-900 text-white text-[11px] font-bold flex items-center justify-center uppercase no-underline border border-stone-300"
                >
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    avatarInitial
                  )}
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  aria-label="Sign in"
                  className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center text-current no-underline hover:opacity-65 transition-opacity"
                >
                  <User className="w-[18px] h-[18px] stroke-[1.6]" aria-hidden="true" />
                </Link>
              )}

              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  setIsCartOpen(true);
                }}
                className="min-h-[36px] px-1 inline-flex items-center gap-1 bg-transparent border-0 cursor-pointer text-[13px] font-medium tracking-tight text-current hover:opacity-65 transition-opacity"
              >
                <span>Cart</span>
                {totalItems > 0 && (
                  <span className="inline-flex items-center justify-center rounded-full bg-stone-900 text-white text-[10px] font-semibold px-1.5 min-w-[18px] h-[18px] leading-none">
                    {totalItems}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={closeMobileMenu}
                aria-label="Close menu"
                className="min-h-[36px] min-w-[36px] inline-flex items-center justify-end bg-transparent border-0 cursor-pointer text-current hover:opacity-65 transition-opacity"
              >
                <X className="w-5 h-5 stroke-[1.6]" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Scrollable Editorial Body */}
          <div className="relative flex-1 overflow-y-auto overscroll-contain">
            {activeSubmenu ? (
              /* Submenu Drill-Down View */
              <div className="animate-in slide-in-from-right-4 fade-in duration-150">
                <button
                  type="button"
                  onClick={() => setActiveSubmenu(null)}
                  className="w-full px-5 py-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-stone-500 hover:text-stone-900 border-b border-stone-200/80 bg-stone-100/50 border-x-0 border-t-0 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  <span>Back to Menu</span>
                </button>

                <div className="px-5 pt-5 pb-2">
                  <h2 className="font-heading text-lg font-semibold text-stone-900 m-0">
                    {activeSubmenu.label}
                  </h2>
                </div>

                <ul
                  role="list"
                  className="m-0 p-0 list-none divide-y divide-stone-200/75 border-b border-stone-200/75"
                >
                  {activeSubmenu.subItems?.map((sub) => (
                    <li key={sub.label}>
                      <Link
                        href={sub.href}
                        onClick={closeMobileMenu}
                        className="flex items-center justify-between px-5 py-4 text-[15px] text-stone-800 hover:bg-stone-100/70 transition-colors no-underline"
                      >
                        <span>{sub.label}</span>
                        <span className="inline-flex items-center gap-2">
                          {sub.tag && (
                            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-stone-200/70 text-stone-700">
                              {sub.tag}
                            </span>
                          )}
                          <ChevronRight
                            className="w-4 h-4 text-stone-400 stroke-[1.5]"
                            aria-hidden="true"
                          />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              /* Primary Editorial Category List */
              <div className="pb-20">
                <nav aria-label="Mobile categories">
                  <ul
                    role="list"
                    className="m-0 p-0 list-none divide-y divide-stone-200/80 border-b border-stone-200/80"
                  >
                    {MOBILE_CATEGORIES.map((item) => (
                      <li key={item.label}>
                        {item.subItems ? (
                          <button
                            type="button"
                            onClick={() => setActiveSubmenu(item)}
                            className="w-full px-5 py-3.5 flex items-center justify-between text-left text-[15.5px] font-normal text-[#262624] hover:bg-stone-100/70 bg-transparent border-0 cursor-pointer transition-colors"
                          >
                            <span>{item.label}</span>
                            <ChevronRight
                              className="w-4 h-4 text-stone-500 stroke-[1.5]"
                              aria-hidden="true"
                            />
                          </button>
                        ) : (
                          <Link
                            href={item.href || "/collections"}
                            onClick={closeMobileMenu}
                            className="w-full px-5 py-3.5 flex items-center justify-between text-[15.5px] font-normal text-[#262624] hover:bg-stone-100/70 no-underline transition-colors"
                          >
                            <span>{item.label}</span>
                            <ChevronRight
                              className="w-4 h-4 text-stone-500 stroke-[1.5]"
                              aria-hidden="true"
                            />
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* 2-Column Minimalist Utility & Account Links */}
                <div className="px-5 py-5 grid grid-cols-2 gap-x-6 gap-y-3.5 text-[13.5px] text-stone-700">
                  <Link
                    href="/blog"
                    onClick={closeMobileMenu}
                    className="hover:text-black no-underline transition-colors"
                  >
                    Design Journal
                  </Link>
                  {hasSession ? (
                    <Link
                      href={portalHref}
                      onClick={closeMobileMenu}
                      className="font-medium text-stone-900 hover:text-black no-underline transition-colors"
                    >
                      {portalLabel}
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      onClick={closeMobileMenu}
                      className="font-medium text-stone-900 hover:text-black no-underline transition-colors"
                    >
                      Log in
                    </Link>
                  )}

                  <Link
                    href="/about"
                    onClick={closeMobileMenu}
                    className="hover:text-black no-underline transition-colors"
                  >
                    Showroom &amp; Factory
                  </Link>
                  {hasSession ? (
                    <Link
                      href={userIsAdmin ? "/admin/orders" : "/dashboard/orders"}
                      onClick={closeMobileMenu}
                      className="hover:text-black no-underline transition-colors"
                    >
                      {userIsAdmin ? "Manage Orders" : "My Orders"}
                    </Link>
                  ) : (
                    <a
                      href="https://wa.me/8801755348053"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-black no-underline transition-colors"
                    >
                      Live assistance
                    </a>
                  )}

                  {hasSession ? (
                    <>
                      <a
                        href="https://wa.me/8801755348053"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-black no-underline transition-colors"
                      >
                        Live assistance
                      </a>
                      <button
                        type="button"
                        disabled={isLoggingOut}
                        onClick={handleLogout}
                        className="text-left text-stone-500 hover:text-red-600 transition-colors cursor-pointer inline-flex items-center gap-1.5 bg-transparent border-0 p-0 disabled:opacity-60"
                      >
                        {isLoggingOut && (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                        )}
                        <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/signup"
                      onClick={closeMobileMenu}
                      className="hover:text-black no-underline transition-colors"
                    >
                      Create account
                    </Link>
                  )}
                </div>

                {/* Editorial Visual Story Cards Strip (Horizontal Peek) */}
                <div className="px-5 pt-1">
                  <div className="flex gap-3.5 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <Link
                      href="/collections"
                      onClick={closeMobileMenu}
                      className="w-[70%] sm:w-[46%] shrink-0 snap-start group no-underline"
                    >
                      <div className="aspect-[16/10] w-full overflow-hidden bg-stone-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={FOOTER_PROMOTIONS[0].image}
                          alt="Unique Engineering Studio Collections"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <p className="mt-2 mb-0 text-xs font-medium text-stone-800 truncate">
                        Architectural Workstations
                      </p>
                    </Link>

                    <Link
                      href="/contact"
                      onClick={closeMobileMenu}
                      className="w-[70%] sm:w-[46%] shrink-0 snap-start group no-underline"
                    >
                      <div className="aspect-[16/10] w-full overflow-hidden bg-stone-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={FOOTER_PROMOTIONS[1].image}
                          alt="Precision CNC Laser Cutting"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <p className="mt-2 mb-0 text-xs font-medium text-stone-800 truncate">
                        Precision CNC Fabrication
                      </p>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Floating Dark Concierge Chat Trigger (Bottom-right inside overlay) */}
          <a
            href="https://wa.me/8801755348053"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Live assistance on WhatsApp"
            title="Chat with UEF Factory Team"
            className="fixed bottom-5 right-5 z-10 h-11 w-11 rounded-full bg-[#333230] hover:bg-black text-white shadow-lg flex items-center justify-center no-underline transition-transform active:scale-95"
          >
            <MessageCircle className="w-5 h-5" aria-hidden="true" />
          </a>
        </div>
      )}
    </>
  );
};

export default Navbar;

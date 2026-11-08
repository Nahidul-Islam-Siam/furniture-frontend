---
name: ui-ux-design
description: Premium UI/UX design, design system, and frontend styling skill for high-converting e-commerce and modern web apps. Use when creating modern, responsive, accessible, and aesthetically pleasing interfaces using Tailwind CSS, Framer Motion, shadcn/ui components, luxury furniture/product layouts, and conversion-optimized checkout flows.
---

# UI/UX Design Skill (`ui-ux-design`)

This skill provides expert design guidelines, layout principles, and component patterns inspired by premium architectural brands (such as 99grid, Bang & Olufsen, Apple, and Herman Miller).

---

## 1. Design Philosophy & Foundations

### Visual Principles
- **Minimalist Luxury**: High-contrast typography, generous whitespace (padding/margins), clean geometric alignment, and restrained accent colors.
- **Color Palette**:
  - `Background`: Neutral tones (`#FFFFFF`, `#F9FAFB`, `#121212` for dark accents).
  - `Primary / Accent`: Refined Terracotta / Warm Clay (`#c9653b` or `#e07548`), Deep Charcoal (`#171717`), Soft Muted (`#737373`).
  - `Borders & Separators`: Subtle opacity borders (`border-neutral-200/80` or `border-neutral-100`).
- **Typography**:
  - Headings: Serif or modern geometric sans (`Playfair Display`, `Cormorant Garamond`, `Plus Jakarta Sans`, `Inter`).
  - Body: High-legibility sans-serif with comfortable line-height (`leading-relaxed`).

---

## 2. High-Converting Product Details Page (PDP) Layout

When designing or implementing single product pages:

1. **Sticky Split Layout**:
   - Left Column (60%): Multi-image thumbnail gallery, sticky hero image with smooth crossfade or zoom on hover.
   - Right Column (40%): Sticky product info stack containing:
     - Breadcrumb navigation (`Home > Sofas > Grid Aeva Sofa`).
     - Product title, category tag, rating & review count.
     - Price block: Bold current price, strikethrough original price, discount percentage badge (`Save 20%`).
     - Variant selectors:
       - **Finish**: Wood / Metal / Matte swatch pills.
       - **Color**: Visual circular color dots with active border rings and tooltips.
       - **Dimensions**: Clear W × D × H measurements in inches / cm.
     - Quantity stepper `[- 1 +]` + sticky high-contrast **"Add to Cart"** and **"Buy Now"** CTA buttons.
     - Value assurance badges: Free Delivery, 5-Year Warranty, 7-Day Easy Returns, 100% Solid Wood.
     - Expandable accordion tabs: Description, Specifications, Material & Care, Delivery Timeline.

---

## 3. Micro-Interactions & Animation Patterns

Use Framer Motion with restrained, natural easing:

```tsx
import { motion } from "framer-motion";

// Subtle Fade Up for cards
export const FadeUpCard = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);
```

### Drawer & Modal Standards
- **Cart Drawer**: Slide in from right (`x: 100%` to `x: 0`), dim backdrop, instant subtotal calculation, free shipping progress bar, and 1-click checkout button.
- **Quick View Modal**: Centered modal with glassmorphism backdrop (`backdrop-blur-sm bg-black/40`), closing on Esc key or outside click.

---

## 4. Accessibility (a11y) & Responsiveness

- [ ] Mobile navigation drawer with smooth hamburger toggle.
- [ ] Color contrast ratio >= 4.5:1 for normal text and 3:1 for large text (WCAG AA).
- [ ] Focus states: Distinct `focus-visible:ring-2 focus-visible:ring-primary` for keyboard users.
- [ ] Accessible form elements: Always link `<label htmlFor="id">` with `<Input id="id" />`.
- [ ] Image performance: Always specify `width`, `height`, and `alt` attributes or use Next.js `<Image>`.

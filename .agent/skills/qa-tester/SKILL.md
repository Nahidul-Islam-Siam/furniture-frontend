---
name: qa-tester
description: Quality assurance, automated and manual test engineering, end-to-end (E2E) workflow validation, and edge-case testing skill. Use when creating test plans, testing user authentication, validating cart and payment flows, auditing responsive UI across devices, testing API contract edge cases, and verifying production readiness.
---

# QA Tester Skill (`qa-tester`)

This skill provides comprehensive test plans, edge-case checklists, and validation strategies for web applications, e-commerce platforms, and backend REST APIs.

---

## 1. E-Commerce End-to-End (E2E) Test Matrix

| Area | Test Scenario | Expected Outcome | Severity |
| :--- | :--- | :--- | :--- |
| **Auth** | Login with valid credentials | Receives JWT token, cookie set, redirected to `/dashboard` or `/admin` based on role | Critical |
| **Auth** | Login with wrong password | Clear inline error message displayed; password field cleared | High |
| **Auth** | 1-Click Demo Login (Customer) | Instantly seeds demo user state, enters dashboard without backend latency | Medium |
| **Catalog** | Click product card in `/collections` | Routes cleanly to `/products/[slug]` or `/collections/[category]/products/[slug]` | Critical |
| **PDP** | Switch image thumbnails | Main hero image switches with smooth crossfade, no 404 broken image | High |
| **PDP** | Select wood finish & color swatches | Active swatch gets highlighted ring; matching price/SKU updates | High |
| **PDP** | Click "Add to Cart" | Cart badge count increments; Cart Drawer slides open with item details | Critical |
| **Cart** | Increment/decrement item quantity | Subtotal and total dynamically re-calculate; zero quantity prompts removal | Critical |
| **Checkout** | Complete guest / authenticated order | Order stored in DB with status `Pending`; confirmation modal or redirect triggered | Critical |
| **Payment** | SSLCommerz / gateway redirection | Initiates secure payment session, processes return IPN, updates order status to `PAID` | Critical |
| **Admin** | Review Moderation | Approve, Reject, or Delete pending reviews; public testimonials page updates | High |

---

## 2. API Contract & Edge-Case Validation Checklist

When testing REST API endpoints:

1. **Input Validation (Zod / Joi)**:
   - Test empty body `{}` on `POST /api/v1/auth/login` -> expect `400 Bad Request` with structured error array.
   - Test invalid email format `user@` -> expect validation error message.
   - Test password shorter than minimum limit -> expect validation error message.

2. **Authorization Boundary Checks**:
   - Call `GET /api/v1/user/all` without `Authorization` header -> expect `401 Unauthorized`.
   - Call `PATCH /api/v1/product/update` with `role: "USER"` -> expect `403 Forbidden`.
   - Attempt to modify another user's profile with forged ID -> expect `403 Forbidden`.

3. **Data Integrity & Concurrency**:
   - Test ordering an item with `stock: 0` -> expect `400 Out of Stock` error.
   - Test concurrent checkout requests on last remaining inventory item -> exactly one succeeds, others fail gracefully.

---

## 3. UI/UX & Responsive Cross-Device Auditing

### Viewport Breakpoints
- **Mobile**: `375px` (iPhone SE) and `390px` (iPhone 14/15)
  - Verify hamburger menu opens without overflow.
  - Verify sticky bottom CTA bar on PDP doesn't cover footer content.
  - Verify touch targets are at least 44×44px.
- **Tablet**: `768px` (iPad Portrait)
  - Verify 2-column product grid renders with balanced gap spacing.
- **Desktop**: `1280px` & `1440px` (MacBook / FHD Monitor)
  - Verify split 60/40 PDP layout, sticky summary stack, and full footer layout.

---

## 4. Performance & Core Web Vitals (CWV)

- **Largest Contentful Paint (LCP)**: Under 2.5s. Optimize hero images (`priority` prop in Next.js `<Image>`).
- **Cumulative Layout Shift (CLS)**: Under 0.1. Ensure all images and icons have explicit dimensions.
- **Interaction to Next Paint (INP)**: Under 200ms. Avoid blocking UI during form submissions by providing immediate loading spinners.

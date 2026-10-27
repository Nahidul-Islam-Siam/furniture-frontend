# SaaSify - Enterprise React SaaS Template

A production-ready, scalable SaaS application template built with **React 19**, **TypeScript**, **Tailwind CSS**, **Vite**, **Redux Toolkit**, and **Redux Persist**.

Featuring an isolated **Public Marketing Site**, **User Dashboard**, and **Admin Dashboard** with Role-Based Access Control (RBAC), persistent state, and an interceptor-based API layer.

---

## 🏗️ Enterprise Architecture & Folder Structure

This project follows a **Domain-Driven Feature Architecture** combined with a centralized layout and routing engine:

```text
react-saas-template/
├── .husky/                         # Git hooks (pre-commit, pre-push security scanner)
├── public/                         # Static assets (images, PWA icons, manifest)
├── scripts/
│   └── security-check.js           # Automated malware, api.js & font integrity validator
│
├── src/
│   ├── assets/                     # Bundled visual assets & brand graphics
│   ├── components/                 # Shared UI components
│   │   ├── ui/                     # Primitives (Radix / Shadcn buttons, dialogs, dropdowns)
│   │   ├── custom-ui/              # Custom brand components (MotionHeading, Banner)
│   │   ├── common/                 # Reusable tables, loaders, empty states
│   │   └── partials/               # Global partials (Navbar, Footer)
│   │
│   ├── config/                     # Site configuration, navigation links, constants
│   ├── context/                    # React Contexts (Theme, Toast notifications)
│   ├── hooks/                      # Global utility hooks (useDebounce, useMediaQuery)
│   │
│   ├── layouts/                    # Distinct layout shells per domain
│   │   ├── AdminLayout/            # Admin sidebar, status monitor, impersonation header
│   │   ├── UserLayout/             # User sidebar, balance widget, notification bell
│   │   ├── MarketingLayout/        # Public landing header, transparent navigation, footer
│   │   └── AuthLayout/             # Focused card/split layout for Login & Register
│   │
│   ├── features/                   # Domain-driven feature modules
│   │   ├── admin/                  # === ADMIN DASHBOARD DOMAIN ===
│   │   │   ├── analytics/          # Revenue graphs, platform metrics, charts
│   │   │   ├── user-management/    # Users list, role editor, bans, permissions
│   │   │   ├── audit-logs/         # Security logs, admin action history
│   │   │   └── system-settings/    # Maintenance toggles, platform flags
│   │   │
│   │   ├── user/                   # === USER DASHBOARD DOMAIN ===
│   │   │   ├── overview/           # User homepage & activity feed
│   │   │   ├── billing/            # Stripe integration, invoices, plan tier
│   │   │   ├── profile/            # User account settings, avatar, 2FA
│   │   │   └── notifications/      # User notification preferences
│   │   │
│   │   ├── auth/                   # === AUTHENTICATION DOMAIN ===
│   │   │   ├── pages/              # Login, Register, Forgot Password
│   │   │   ├── components/         # Social auth buttons, OTP inputs
│   │   │   └── hooks/              # useAuth, useSession
│   │   │
│   │   └── marketing/              # === PUBLIC MARKETING DOMAIN ===
│   │       ├── home/               # Hero, ValueProps, Testimonials, Video
│   │       ├── pricing/            # Pricing tiers, feature comparison
│   │       └── contact/            # Support form, FAQ
│   │
│   ├── lib/                        # Core infrastructure
│   │   ├── api/                    # Centralized API Integration Layer
│   │   │   ├── client.ts           # Axios instance with JWT bearer & refresh interceptors
│   │   │   ├── services/           # Feature API services (authService, adminService, userService)
│   │   │   └── utils/              # API error normalization & response helpers
│   │   │
│   │   ├── store/                  # Redux Toolkit + Redux Persist State Engine
│   │   │   ├── slices/             # Feature slices (authSlice, preferencesSlice, uiSlice)
│   │   │   ├── middleware/         # Custom middleware (auth.middleware)
│   │   │   ├── store.ts            # configureStore + persistReducer setup
│   │   │   └── index.ts            # Typed hooks (useAppDispatch, useAppSelector)
│   │   │
│   │   └── utils.ts                # Tailwind class mergers (cn / clsx)
│   │
│   ├── routes/                     # Centralized Routing & Role Guards
│   │   ├── guards/
│   │   │   ├── RoleGuard.tsx       # Enforces RBAC ('ADMIN' vs 'USER')
│   │   │   ├── ProtectedRoute.tsx  # Blocks unauthenticated visitors
│   │   │   └── GuestRoute.tsx      # Prevents logged-in users from viewing /login
│   │   ├── admin.routes.tsx        # /admin/* route definitions
│   │   ├── user.routes.tsx         # /dashboard/* route definitions
│   │   ├── public.routes.tsx       # Public marketing routes
│   │   └── index.tsx               # Master createBrowserRouter()
│   │
│   ├── types/                      # Global TypeScript definitions & Enums
│   │   ├── auth.types.ts           # Role: 'ADMIN' | 'USER' | 'MODERATOR'
│   │   ├── user.types.ts           # User profile and subscription schemas
│   │   └── api.types.ts            # Standardized ApiResponse<T> interfaces
│   │
│   ├── App.tsx                     # Router provider & global providers
│   ├── index.css                   # Global Tailwind CSS definitions
│   └── main.tsx                    # React DOM root + Redux Provider + PersistGate
│
├── package.json
├── postcss.config.js               # Clean PostCSS configuration
├── tailwind.config.js              # Tailwind styling tokens
├── tsconfig.json                   # TypeScript path aliases (@/*)
└── vite.config.ts                  # Vite build configuration & plugins
```

---

## ⚡ State Persistence (Redux Toolkit + Redux Persist)

The application uses **Redux Toolkit** for immutable state management and **Redux Persist** to retain critical sessions across page refreshes and browser restarts.

### 1. Store Configuration (`src/lib/store/store.ts`)
Only selected slices (`auth`, `preferences`) are whitelisted for `localStorage` persistence, preventing temporary UI state from getting stuck:

```typescript
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import preferencesReducer from './slices/preferencesSlice';
import uiReducer from './slices/uiSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'preferences'], // Persists session & theme across reloads
};

const rootReducer = combineReducers({
  auth: authReducer,
  preferences: preferencesReducer,
  ui: uiReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 2. Main Entry Point Binding (`src/main.tsx`)
`PersistGate` delays the rendering of the application until the persisted state has been retrieved and saved to Redux:

```tsx
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './lib/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Loading session...</div>} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
```

---

## 🌐 Centralized API Integration Layer

All backend communication flows through an **Axios API Client** (`src/lib/api/client.ts`) that automatically handles authentication headers and token expiration:

- **Automatic Bearer Token Attachment**: Pulls the JWT directly from the Redux store on every outgoing request.
- **Automatic 401 Interceptor**: Intercepts expired session errors, triggers a token refresh, and retries the failed request or logs out the user cleanly.

```typescript
// Example: src/lib/api/services/adminService.ts
import apiClient from '../client';
import { User, PaginatedResponse } from '@/types';

export const adminService = {
  getUsers: (page = 1, limit = 10) =>
    apiClient.get<PaginatedResponse<User>>('/admin/users', { params: { page, limit } }),

  updateUserRole: (userId: string, role: 'ADMIN' | 'USER') =>
    apiClient.patch(`/admin/users/${userId}/role`, { role }),

  getSystemAnalytics: () =>
    apiClient.get('/admin/analytics'),
};
```

---

## 🛡️ Role-Based Access Control (RBAC) & Route Matrix

| Route | Role Allowed | Layout Used | Description |
| :--- | :--- | :--- | :--- |
| `/` | Public | `MarketingLayout` | Landing page, features, testimonials |
| `/login`, `/signup` | Guest Only | `AuthLayout` | Redirects to `/dashboard` if already logged in |
| `/dashboard/*` | `USER`, `ADMIN` | `UserLayout` | Personal overview, profile, billing, settings |
| `/admin/*` | `ADMIN` Only | `AdminLayout` | Platform analytics, user manager, audit logs |

### Role Guard Example (`src/routes/guards/RoleGuard.tsx`):
```tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/lib/store';

export const RoleGuard = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { user, token } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />;
  }

  return <Outlet />;
};
```

---

## 🔒 Automated Repository Security (Husky Safeguards)

To safeguard against injected malware and unauthorized build scripts, Husky hooks and a custom security scanner are configured:

1. **Malware & Backdoor Scanner (`scripts/security-check.js`)**:
   - Blocks any attempt to add `node api.js` or `api.js` to `package.json` scripts or the root directory.
   - Validates `postcss.config.*` files (blocks line lengths > 400 chars, `eval()`, network calls, and child process execution).
   - Validates font assets (`.woff`, `.woff2`, `.ttf`) via magic byte header inspections to stop disguised executable scripts.
2. **Husky Hooks**:
   - `pre-commit`: Runs security checks and `npm run build` (`tsc && vite build`) before allowing commits.
   - `pre-push`: Runs security checks and production builds before pushing code to GitHub.
   - `post-merge`: Automatically scans incoming code immediately after `git pull` or `git merge`.

Run the security scan manually:
```bash
npm run security-check
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Production Build
```bash
npm run build
```

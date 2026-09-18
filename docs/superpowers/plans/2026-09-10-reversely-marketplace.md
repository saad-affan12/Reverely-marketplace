# Reversely Reverse Marketplace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete, polished frontend for Reversely — a Reverse Multi-Vendor Marketplace built with React, TypeScript, Vite, Tailwind CSS, Lucide React, Zustand, and React Router.

**Architecture:** Modular feature-based structure with Zustand persistent state (localStorage sync) and a decoupled API service layer for effortless future REST API integration. Complete role-based security routing for Customer, Vendor, and Admin users.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Zustand, React Router v7, Axios (mocked client wrapper).

**Spec:** `docs/superpowers/specs/2026-09-10-reversely-marketplace-design.md`

## Global Constraints
- Primary color: Deep Indigo (`#4f46e5` / `bg-indigo-600`)
- Background: Light slate neutral (`#f8fafc` / `bg-slate-50`)
- Cards: Pure white with soft border and subtle shadow (`bg-white border border-slate-200 shadow-sm rounded-xl`)
- Currency: Formatted Indian Rupees (`₹30,000` via `Intl.NumberFormat('en-IN')`)
- Primary Differentiator: Customer posts requirement -> Vendors compete with quotes -> Customer compares & accepts -> Order created -> Visual 6-stage order tracking.

---

### Task 1: Project Initialization & Build Setup

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js` or `@import "tailwindcss"` in `src/index.css`, `index.html`
- Create: `src/main.tsx`, `src/App.tsx`, `src/index.css`

**Interfaces:**
- Consumes: N/A
- Produces: Project build setup with Vite, Tailwind CSS v4, Lucide icons, React Router v7, Zustand, Axios.

- [ ] **Step 1: Scaffold Vite React TS application and dependencies**

Run: `npm init vite@latest . -- --template react-ts` (or create `package.json` with required dependencies).

- [ ] **Step 2: Install dependencies**

Dependencies: `react`, `react-dom`, `react-router-dom`, `zustand`, `lucide-react`, `axios`, `clsx`, `tailwind-merge`.
DevDependencies: `typescript`, `@types/react`, `@types/react-dom`, `@vitejs/plugin-react`, `tailwindcss`, `@tailwindcss/vite`, `vite`.

- [ ] **Step 3: Configure Tailwind CSS v4 & Theme CSS Variables in `src/index.css`**

Add CSS custom properties for palette and global styles.

- [ ] **Step 4: Verify build succeeds**

Run: `npm run build`

---

### Task 2: Data Models & Realistic Indian Marketplace Seed Data

**Files:**
- Create: `src/types/index.ts`
- Create: `src/mock/seedData.ts`

**Interfaces:**
- Consumes: N/A
- Produces: `User`, `Requirement`, `Offer`, `Order`, `Product` interfaces and 15+ realistic seed records.

- [ ] **Step 1: Write TypeScript interfaces in `src/types/index.ts`**

Define `UserRole`, `User`, `RequirementStatus`, `Requirement`, `OfferBadge`, `OfferStatus`, `Offer`, `OrderStatus`, `OrderTimelineItem`, `Order`, `Product`.

- [ ] **Step 2: Write realistic Indian marketplace seed data in `src/mock/seedData.ts`**

Seed items:
- Demo users: Customer (Saad), Vendors (PrintHub, FurnitureCraft), Admin.
- Requirements: "100 Custom T-Shirts", "Office Furniture Setup", "Event Photography", "Bulk Electronics".
- Offers: Competitive quotes with match scores (94%, 88%, etc.), badges (BEST VALUE, FASTEST DELIVERY, TOP RATED).
- Orders: Live tracking orders with timestamps.
- Products: Traditional marketplace products.

---

### Task 3: Abstracted API Service Layer & Zustand Stores

**Files:**
- Create: `src/services/api/client.ts`
- Create: `src/services/api/authApi.ts`
- Create: `src/services/api/requirementsApi.ts`
- Create: `src/services/api/offersApi.ts`
- Create: `src/services/api/ordersApi.ts`
- Create: `src/services/api/productsApi.ts`
- Create: `src/stores/useAuthStore.ts`
- Create: `src/stores/useRequirementStore.ts`
- Create: `src/stores/useOfferStore.ts`
- Create: `src/stores/useOrderStore.ts`

**Interfaces:**
- Consumes: `src/types/index.ts`, `src/mock/seedData.ts`
- Produces: Abstracted async service calls and reactive Zustand persistent stores with `localStorage` fallback.

- [ ] **Step 1: Create Mock API client abstraction in `src/services/api/`**

Functions: `getRequirements()`, `createRequirement(data)`, `getOffers(reqId)`, `submitOffer(data)`, `acceptOffer(offerId)`, `getOrders()`, `updateOrderStatus(id, status)`.

- [ ] **Step 2: Implement Zustand stores with persistence in `src/stores/`**

Create auth, requirement, offer, and order stores initialized with `seedData` if `localStorage` is empty.

---

### Task 4: Reusable Base UI Component Library

**Files:**
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Input.tsx`
- Create: `src/components/ui/Select.tsx`
- Create: `src/components/ui/Textarea.tsx`
- Create: `src/components/ui/Card.tsx`
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/Modal.tsx`
- Create: `src/components/ui/StatCard.tsx`
- Create: `src/components/ui/Toast.tsx`
- Create: `src/components/ui/ConfirmDialog.tsx`
- Create: `src/components/ui/EmptyState.tsx`
- Create: `src/components/ui/LoadingState.tsx`

**Interfaces:**
- Consumes: React props & Tailwind styling
- Produces: Modular UI component set matching the SaaS / Fintech minimal aesthetic.

- [ ] **Step 1: Create Form & Button UI components**
- [ ] **Step 2: Create Layout & Feedback UI components (Card, Modal, Badge, StatCard, Toast)**

---

### Task 5: Global Navigation & Layout Architecture

**Files:**
- Create: `src/components/layout/Navbar.tsx`
- Create: `src/components/layout/Footer.tsx`
- Create: `src/components/layout/Sidebar.tsx`
- Create: `src/components/layout/ProtectedLayout.tsx`

**Interfaces:**
- Consumes: `useAuthStore`
- Produces: Role-aware navigation headers (Logged out, Customer, Vendor, Admin) and protected route wrappers.

- [ ] **Step 1: Implement `Navbar.tsx` with dynamic role navigation & mobile drawer**
- [ ] **Step 2: Implement `ProtectedLayout.tsx` with role guard redirects**

---

### Task 6: Authentication & Demo Mode Role Selector

**Files:**
- Create: `src/pages/auth/Login.tsx`

**Interfaces:**
- Consumes: `useAuthStore`
- Produces: Split-screen authentication view with 1-click Demo Login cards for Customer, Vendor, and Admin.

- [ ] **Step 1: Build `Login.tsx` page with Demo Account quick-login buttons**

---

### Task 7: Landing Page & Public Exploration Routes

**Files:**
- Create: `src/pages/public/LandingPage.tsx`
- Create: `src/pages/public/ExplorePage.tsx`
- Create: `src/pages/public/HowItWorksPage.tsx`

**Interfaces:**
- Consumes: Seed products & requirements
- Produces: Polished startup landing page with hero banner, 4-step workflow, marketplace metrics, and exploration views.

- [ ] **Step 1: Build `LandingPage.tsx` with Reversely tagline, CTA, requirement input card, and metrics**
- [ ] **Step 2: Build `ExplorePage.tsx` and `HowItWorksPage.tsx`**

---

### Task 8: Customer Post Requirement Multi-Step Builder

**Files:**
- Create: `src/pages/customer/PostRequirementPage.tsx`

**Interfaces:**
- Consumes: `useRequirementStore`
- Produces: 4-step requirement builder wizard (What → Quantity/Budget → Delivery → Specs) with real-time summary sidebar and success confirmation screen.

- [ ] **Step 1: Implement 4-step form wizard with sticky Requirement Summary sidebar**
- [ ] **Step 2: Implement submission handler to create requirement and route to details**

---

### Task 9: Customer Requirement Details, Offers Feed & Side-by-Side Offer Comparison

**Files:**
- Create: `src/pages/customer/RequirementDetailsPage.tsx`
- Create: `src/pages/customer/OffersPage.tsx`
- Create: `src/pages/customer/CompareOffersPage.tsx`
- Create: `src/components/shared/OfferComparison.tsx`

**Interfaces:**
- Consumes: `useRequirementStore`, `useOfferStore`, `useOrderStore`
- Produces: Detailed requirement specs, offer cards with match score badges, and desktop/mobile side-by-side comparison matrix with "Accept Offer" order generation.

- [ ] **Step 1: Build `RequirementDetailsPage.tsx` & `OffersPage.tsx`**
- [ ] **Step 2: Build `CompareOffersPage.tsx` with matrix comparison & Accept Offer modal**

---

### Task 10: Vendor Opportunities Marketplace & Quotation Builder

**Files:**
- Create: `src/pages/vendor/OpportunitiesPage.tsx`
- Create: `src/pages/vendor/OpportunityDetailsPage.tsx`
- Create: `src/pages/vendor/SubmitOfferPage.tsx`

**Interfaces:**
- Consumes: `useRequirementStore`, `useOfferStore`
- Produces: Vendor opportunity feed with category/budget filters and quotation builder showing real-time budget differential.

- [ ] **Step 1: Build `OpportunitiesPage.tsx` filterable grid with Match Score badges**
- [ ] **Step 2: Build `SubmitOfferPage.tsx` quotation builder with budget comparison feedback**

---

### Task 11: Customer & Vendor Dashboards

**Files:**
- Create: `src/pages/customer/CustomerDashboard.tsx`
- Create: `src/pages/vendor/VendorDashboard.tsx`

**Interfaces:**
- Consumes: All stores
- Produces: Role-tailored dashboards with quick stats, recent requirements/opportunities, and actionable order widgets.

- [ ] **Step 1: Build `CustomerDashboard.tsx` (Active Requirements, Received Offers, Recent Orders)**
- [ ] **Step 2: Build `VendorDashboard.tsx` (New Opportunities, Submitted Offers, Revenue, Analytics)**

---

### Task 12: Visual 6-Stage Order Lifecycle Tracking

**Files:**
- Create: `src/pages/orders/OrderTrackingPage.tsx`
- Create: `src/components/ui/OrderTimeline.tsx`

**Interfaces:**
- Consumes: `useOrderStore`
- Produces: Visual 6-stage delivery stepper (`Requirement Accepted` -> `Confirmed` -> `Processing` -> `Packed` -> `Shipped` -> `Delivered`) with timeline log and vendor contact card.

- [ ] **Step 1: Build `OrderTimeline.tsx` visual stepper**
- [ ] **Step 2: Build `OrderTrackingPage.tsx` with delivery details and status updates**

---

### Task 13: Admin Dashboard & Management Interfaces

**Files:**
- Create: `src/pages/admin/AdminDashboard.tsx`
- Create: `src/pages/admin/AdminUsersPage.tsx`
- Create: `src/pages/admin/AdminRequirementsPage.tsx`
- Create: `src/pages/admin/AdminOrdersPage.tsx`

**Interfaces:**
- Consumes: Platform stores
- Produces: Executive dashboard with platform KPIs, revenue summaries, and interactive data management tables.

- [ ] **Step 1: Build `AdminDashboard.tsx` KPI overview & charts**
- [ ] **Step 2: Build Admin management data tables for Users, Requirements, and Orders**

---

### Task 14: App Assembly, Routing & Supporting Pages

**Files:**
- Create: `src/pages/public/NotFoundPage.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: All page components & router
- Produces: Complete navigable application with working end-to-end customer, vendor, and admin flows.

- [ ] **Step 1: Wire up all routes in `src/App.tsx`**
- [ ] **Step 2: Build & verify end-to-end user workflows**

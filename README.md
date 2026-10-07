# ⚡ Reversely — Reverse & Traditional Multi-Vendor Marketplace

<div align="center">

![Reversely Banner](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80)

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0-4338CA?style=for-the-badge)](https://zustand.docs.pmnd.rs/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

**A high-performance, hybrid multi-vendor commerce platform that flips the traditional marketplace model on its head.**

[Explore Live Demo](#-getting-started) • [Core Concept](#-the-reverse-marketplace-concept) • [Role Workflows](#-role-based-workflows) • [Architecture](#️-architecture--tech-stack) • [Roadmap](#️-roadmap--backend-integration)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [The Reverse Marketplace Concept](#-the-reverse-marketplace-concept)
- [Key Features](#-key-features)
- [Role-Based Workflows](#-role-based-workflows)
  - [👤 Customer Experience](#1--customer-experience)
  - [🏢 Vendor Experience](#2--vendor-experience)
  - [🛡️ Admin Oversight](#3-️-admin-oversight)
- [Architecture & Tech Stack](#-architecture--tech-stack)
  - [Technology Matrix](#technology-matrix)
  - [Directory Structure](#directory-structure)
  - [Data Models](#data-models)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
  - [Demo Accounts & Authentication](#demo-accounts--authentication)
- [Design System & Aesthetics](#-design-system--aesthetics)
- [Roadmap & Backend Integration](#-roadmap--backend-integration)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

In traditional e-commerce, customers spend countless hours browsing rigid catalogs, comparing disparate sellers, and negotiating custom quotes offline.

**Reversely** reimagines procurement and commerce with a **Reverse RFP (Request for Proposal) Engine**:
1. Customers define *what* they need, *quantity*, *specifications*, *budget range*, and *deadline*.
2. Verified vendors discover these requirements as business opportunities and submit tailored, competitive bids.
3. Customers compare bids side-by-side using an intelligent match score matrix and accept the best quotation with one click.
4. The system automatically creates an order with a **visual 6-stage lifecycle tracker**.

Simultaneously, Reversely preserves standard direct-to-consumer browsing for off-the-shelf catalog products.

---

## 🔄 The Reverse Marketplace Concept

```
┌─────────────────────────┐
│   1. CUSTOMER POSTS     │ ──> Title, Category, Quantity, Budget Range,
│      REQUIREMENT        │     Delivery Location, Deadline & Custom Specs
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   2. VENDORS DISCOVER   │ ──> Filter opportunities by category, budget & match score;
│      OPPORTUNITIES      │     Analyze project specs & customer timeline
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   3. VENDORS SUBMIT     │ ──> Quote tailored pricing, delivery estimate,
│      COMPETITIVE QUOTES │     warranty & included value-add services
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   4. COMPARE & ACCEPT   │ ──> Side-by-side matrix comparison with Best Value,
│      OFFERS             │     Fastest Delivery, and Top Rated algorithmic badges
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   5. 6-STAGE ORDER      │ ──> Requirement Accepted ➔ Confirmed ➔ Processing ➔
│      LIFECYCLE TRACKING │     Packed ➔ Shipped ➔ Delivered
└─────────────────────────┘
```

---

## ✨ Key Features

### 🎯 Reverse Commerce Engine
- **4-Step Requirement Wizard**: Intuitive step-by-step form (General Info → Quantity & Budget → Delivery & Timeline → Technical Specifications) with a real-time sticky summary sidebar.
- **Dynamic Quotation Builder**: Vendors formulate competitive bids with instant visual feedback against the customer's target budget.
- **Side-by-Side Comparison Matrix**: Compare competing vendor bids across price, delivery timeline, warranty, trust rating, and bundled services.
- **Algorithmic Match Badges**: Automatic highlight tags for `BEST VALUE`, `FASTEST DELIVERY`, and `TOP RATED` offers.

### 📦 Traditional Multi-Vendor Marketplace
- **Direct Catalog Browsing**: Explore vendor storefronts and product listings with category filtering and search.
- **Product Management**: Vendors can create, update, manage stock levels, and publish catalog offerings.

### 🚚 Visual 6-Stage Order Lifecycle Tracker
- **Stage Progression**: Track progress seamlessly from `Requirement Accepted` → `Confirmed` → `Processing` → `Packed` → `Shipped` → `Delivered`.
- **Interactive Delivery Stepper**: Real-time visual timeline with completion timestamps, vendor contact details, and itemized deliverables.

### 🛡️ Enterprise-Grade Role-Based Access Control (RBAC)
- Distinct dashboards, layouts, navigation bars, and routing rules for **Customer**, **Vendor**, and **Admin**.
- Automated route guards with seamless redirection.
- **1-Click Demo Switcher**: Instant credential autofill to experience any persona without manual sign-up.

### 💎 Next-Gen SaaS Interface
- Built with a sleek dark-themed palette (`#050816`), neon accent hues, glassmorphic cards, and fluid page transitions powered by `motion/react`.
- Formatted natively with Indian Rupee (`₹`) localized currency standards.

---

## 👥 Role-Based Workflows

### 1. 👤 Customer Experience
| Route | Description |
|---|---|
| `/customer/dashboard` | High-level analytics: active RFPs, incoming offers, recent orders, quick actions |
| `/customer/requirements/new` | 4-step interactive builder to publish new requirements |
| `/customer/requirements` | Active and historical RFPs with status filters and offer counts |
| `/customer/requirements/:id` | Full specification view and received vendor quotations |
| `/customer/requirements/:id/compare` | Multi-vendor side-by-side comparison matrix with 1-click offer acceptance |
| `/customer/orders` | Customer order ledger and fulfillment statuses |

### 2. 🏢 Vendor Experience
| Route | Description |
|---|---|
| `/vendor/dashboard` | Business overview: match score opportunities, active quotations, revenue, win rates |
| `/vendor/opportunities` | Marketplace of open customer requirements with budget & category filters |
| `/vendor/opportunities/:id/offer` | Quotation drafting terminal with real-time budget comparison metrics |
| `/vendor/offers` | Management center for pending, accepted, and rejected quotations |
| `/vendor/products` | Direct product inventory management (create, edit, stock levels) |
| `/vendor/orders` | Order fulfillment management and status transitions |

### 3. 🛡️ Admin Oversight
| Route | Description |
|---|---|
| `/admin/dashboard` | Platform KPI terminal: Gross Volume, User Demographics, Conversion Rates |
| `/admin/users` | User management, credential auditing, and KYC verification states |
| `/admin/vendors` | Vendor compliance, rating moderation, and storefront approval |
| `/admin/requirements` | Platform-wide requirement feed moderation |
| `/admin/orders` | End-to-end transaction audit trail and delivery oversight |

---

## 🏗️ Architecture & Tech Stack

### Technology Matrix

| Layer | Technology | Purpose |
|---|---|---|
| **Core Framework** | React 19 (`react`, `react-dom`) | Modern reactive component architecture |
| **Language** | TypeScript 5.7 | End-to-end type safety and model validation |
| **Build Tooling** | Vite 6.1 | Ultra-fast HMR and optimized production bundling |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`) | Next-generation utility-first CSS engine |
| **Routing** | React Router v7 (`react-router-dom`) | Declarative client-side routing & route guards |
| **State Management**| Zustand v5 | Lightweight, persistent state with `localStorage` sync |
| **Animations** | Motion (`motion/react`) | Smooth page transitions and micro-interactions |
| **Icons** | Lucide React | Clean, consistent vector iconography |
| **HTTP Client** | Axios (Abstracted Mock Layer) | Decoupled API architecture ready for REST/GraphQL backends |

---

### Directory Structure

```
reversely-marketplace/
├── docs/                                  # Specifications and design plans
│   └── superpowers/
│       ├── plans/                         # Step-by-step implementation milestones
│       └── specs/                         # Architectural design specification
├── public/                                # Public assets and favicon
├── src/
│   ├── api/ & services/                   # Abstracted API client layer
│   │   └── api/
│   │       ├── client.ts                  # Axios configuration / mock transport
│   │       ├── authApi.ts                 # Session and authentication mocks
│   │       ├── requirementsApi.ts         # Requirement CRUD operations
│   │       ├── offersApi.ts               # Quotation submission and acceptance
│   │       ├── ordersApi.ts               # Order tracking and status changes
│   │       ├── productsApi.ts             # Direct catalog endpoints
│   │       └── adminApi.ts                # Moderation and administrative stats
│   ├── components/
│   │   ├── admin/                         # Admin-specific data visualization
│   │   ├── layout/                        # Layout shells (Navbar, Footer, Sidebar, ProtectedLayout)
│   │   ├── motion/                        # Reusable motion wrapper primitives
│   │   ├── shared/                        # Domain components (OfferComparison, RequirementCard)
│   │   └── ui/                            # Atomic design system (Button, Modal, StatCard, OrderTimeline)
│   ├── mock/
│   │   └── seedData.ts                    # Realistic seed dataset (Requirements, Offers, Orders, Users)
│   ├── pages/
│   │   ├── admin/                         # Admin dashboard and management screens
│   │   ├── auth/                          # Login with 1-click demo role selector, Register
│   │   ├── customer/                      # Requirement builder, comparison matrix, dashboard
│   │   ├── orders/                        # 6-stage visual order tracking page
│   │   ├── public/                        # Landing page, How It Works, Explore, Product Details
│   │   ├── shared/                        # Notifications, profile pages
│   │   └── vendor/                        # Opportunities feed, quotation submitter, vendor store
│   ├── stores/                            # Zustand stores with localStorage persistence
│   │   ├── useAuthStore.ts                # Current session, role switches, login/logout
│   │   ├── useRequirementStore.ts         # Customer RFP storage and mutations
│   │   ├── useOfferStore.ts               # Vendor quotes, match scores, acceptance logic
│   │   ├── useOrderStore.ts               # Order lifecycle and timeline progression
│   │   └── useProductStore.ts             # Traditional e-commerce catalog items
│   ├── types/
│   │   └── index.ts                       # Unified TypeScript interfaces
│   ├── App.tsx                            # Root router configuration with animated routes
│   ├── index.css                          # Tailwind CSS custom themes & global styles
│   └── main.tsx                           # Application entry point
├── index.html                             # HTML5 root with Google Fonts (Instrument Serif, Space Grotesk)
├── package.json                           # Dependencies and scripts
├── tsconfig.json                          # TypeScript configuration
└── vite.config.ts                         # Vite configuration with Tailwind CSS v4 plugin
```

---

### Data Models

```typescript
// Core Data Schema (src/types/index.ts)

export type UserRole = 'customer' | 'vendor' | 'admin';

export interface Requirement {
  id: string;               // e.g. REQ-1024
  customerId: string;
  customerName: string;
  title: string;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  minBudget: number;
  maxBudget: number;
  location: string;
  deadline: string;
  status: 'open' | 'closed' | 'fulfilled' | 'cancelled';
  offersCount: number;
  specifications: string[];
  createdAt: string;
}

export interface Offer {
  id: string;               // e.g. OFF-501
  requirementId: string;
  vendorId: string;
  vendorName: string;
  vendorRating: number;
  vendorTrustScore: number;
  price: number;            // INR ₹
  deliveryDays: number;
  warranty: string;
  includedServices: string[];
  matchScore: number;       // e.g. 94%
  badges?: ('BEST VALUE' | 'FASTEST DELIVERY' | 'TOP RATED')[];
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Order {
  id: string;               // e.g. ORD-1045
  requirementId?: string;
  offerId?: string;
  customerId: string;
  vendorId: string;
  title: string;
  totalAmount: number;
  status: 'requirement_accepted' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'delivered';
  timeline: OrderTimelineItem[];
  expectedDelivery: string;
}
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher) or **yarn** / **pnpm**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/saad-affan12/Reverely-marketplace.git
   cd Reverely-marketplace
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

### Running the Application

- **Start Development Server:**
  ```bash
  npm run dev
  ```
  Open `http://localhost:5173` in your browser.

- **Build Production Bundle:**
  ```bash
  npm run build
  ```

- **Preview Production Build:**
  ```bash
  npm run preview
  ```

---

### Demo Accounts & Authentication

The authentication screen (`/login`) includes **1-Click Instant Demo Login Cards**:

| Role | Email | Company / Name | Capabilities |
|---|---|---|---|
| **Customer** | `customer@example.com` | Saad Ahmed (Apex Innovations) | Post RFPs, compare bids, accept offers, track orders |
| **Vendor** | `vendor@example.com` | PrintHub Solutions | Bid on RFPs, manage catalog, fulfill orders |
| **Vendor 2** | `vendor2@example.com`| TechCraft Enterprises | Alternative vendor for competitive quote testing |
| **Admin** | `admin@example.com` | Reversely HQ | Global platform analytics, users & orders moderation |

> [!TIP]
> You do not need to remember passwords. Clicking any demo card instantly sets up the session and redirects you to the designated role dashboard.

---

## 🎨 Design System & Aesthetics

Reversely is styled with a distinct, premium **Dark Tech SaaS** visual language:

- **Canvas & Backgrounds**: Deep Void (`#050816`), Slate Obsidian (`#0B0F19`), and Navy Charcoal (`#111827`).
- **Primary Accents**: Vivid Electric Indigo (`#5B37F5` / `#6366F1`) and Sky Violet.
- **Status Indicators**:
  - Emerald (`#10B981`): Accepted offers, delivered orders, top ratings.
  - Amber (`#F59E0B`): Pending reviews, processing orders.
  - Rose (`#F43F5E`): Rejected quotes, closed requirements.
- **Typography**:
  - Headings & Editorial Display: **Instrument Serif** & **Space Grotesk**
  - Interface & Body Text: **Plus Jakarta Sans**
- **Micro-Interactions**: Smooth entrance and exit animations between routes with `motion/react`.

---

## 🗺️ Roadmap & Backend Integration

Reversely was built intentionally with an **abstracted service architecture** (`src/services/api/`), allowing seamless migration from mock storage to live backends:

- [ ] **REST / GraphQL Backend Integration**: Plug Node.js (NestJS / Express), Go, or Python FastAPI backends into `src/services/api/client.ts`.
- [ ] **Live Bid WebSockets**: Enable real-time quote updates as vendors submit bids during active RFPs.
- [ ] **Escrow Payment Integration**: Support automated escrow milestones (advance deposit upon acceptance, release upon delivery confirmation) using Stripe or Razorpay.
- [ ] **AI-Powered Match Engine**: Machine learning model analyzing vendor past delivery performance and catalog history to generate personalized match scores.
- [ ] **In-App Direct Chat**: Real-time buyer-to-seller clarification messaging during open RFP rounds.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

Crafted with ❤️ for modern procurement and seamless multi-vendor commerce.

</div>

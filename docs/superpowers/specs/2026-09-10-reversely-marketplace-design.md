# Architectural Design Specification: Reversely - Reverse Multi-Vendor Marketplace Frontend

**Date:** 2026-09-10  
**Project:** Reversely (Reverse & Traditional Multi-Vendor Marketplace)  
**Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Zustand, React Router v7  
**Status:** Approved Architectural Spec  

---

## 1. Overview & Core Concept

Reversely is a hybrid multi-vendor marketplace where the **PRIMARY DIFFERENTIATOR** is the **Reverse Marketplace Workflow**:
1. **Customer Posts Requirement** (Title, Category, Quantity, Budget Range, Location, Deadline, Specs)
2. **Vendors Discover Opportunities** (Filtered by category, location, match score)
3. **Vendors Submit Competitive Quotations** (Price, Delivery Days, Warranty, Services)
4. **Customer Compares & Accepts Offer** (Side-by-side comparison matrix with Best Value AI callout)
5. **Order Lifecycle & Tracking** (Visual 6-stage delivery stepper)

In addition, Reversely supports traditional multi-vendor ecommerce (Vendor product listing, Customer catalog browsing, Direct checkout).

---

## 2. Technical Architecture & Folder Structure

```
src/
├── api/                   # Abstracted API client & mock services
│   ├── client.ts          # Axios wrapper / mock interceptor
│   ├── auth.ts            # Auth & session mock endpoints
│   ├── requirements.ts    # Reverse requirement CRUD
│   ├── offers.ts          # Vendor quotation submit & accept
│   ├── orders.ts          # Order creation & tracking updates
│   ├── products.ts        # Direct product catalog mock
│   └── admin.ts           # Admin reporting & user management
├── components/
│   ├── ui/                # Base design system components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Textarea.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   ├── StatCard.tsx
│   │   ├── OrderTimeline.tsx
│   │   ├── Toast.tsx
│   │   └── ConfirmDialog.tsx
│   ├── layout/            # Layout wrappers
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ProtectedLayout.tsx
│   │   └── Sidebar.tsx
│   └── shared/            # Domain components
│       ├── RequirementCard.tsx
│       ├── OfferCard.tsx
│       ├── OfferComparison.tsx
│       └── ProductCard.tsx
├── stores/                # Zustand persistent stores (localStorage sync)
│   ├── useAuthStore.ts
│   ├── useRequirementStore.ts
│   ├── useOfferStore.ts
│   ├── useOrderStore.ts
│   └── useProductStore.ts
├── types/                 # TypeScript interfaces
│   └── index.ts
├── mock/                  # Seed datasets (Indian marketplace context)
│   └── seedData.ts
└── pages/                 # Route page components
    ├── public/            # Landing, Explore, HowItWorks, ProductDetails, About, NotFound
    ├── auth/              # Login (with Demo Role Selector), Register
    ├── customer/          # CustomerDashboard, PostRequirement, RequirementDetails, Offers, CompareOffers, CustomerOrders
    ├── vendor/            # VendorDashboard, Opportunities, OpportunityDetails, SubmitOffer, VendorProducts, ProductEdit, VendorOrders
    └── admin/             # AdminDashboard, UserMgmt, VendorMgmt, ProductMgmt, RequirementMgmt, OrderMgmt
```

---

## 3. Data Models & TypeScript Types

### `User`
```typescript
export type UserRole = 'customer' | 'vendor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyName?: string;
  avatar?: string;
  verified?: boolean;
}
```

### `Requirement`
```typescript
export type RequirementStatus = 'open' | 'closed' | 'fulfilled' | 'cancelled';

export interface Requirement {
  id: string; // REQ-1024
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
  status: RequirementStatus;
  offersCount: number;
  specifications: string[];
  attachments?: string[];
  createdAt: string;
}
```

### `Offer`
```typescript
export type OfferBadge = 'BEST VALUE' | 'FASTEST DELIVERY' | 'TOP RATED';
export type OfferStatus = 'pending' | 'accepted' | 'rejected';

export interface Offer {
  id: string; // OFF-501
  requirementId: string;
  vendorId: string;
  vendorName: string;
  vendorRating: number;
  vendorTrustScore: number; // 0 - 100
  price: number; // INR ₹
  deliveryDays: number;
  warranty: string;
  includedServices: string[];
  notes: string;
  matchScore: number; // percentage
  badges?: OfferBadge[];
  status: OfferStatus;
  createdAt: string;
}
```

### `Order`
```typescript
export type OrderStatus = 'requirement_accepted' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'delivered';

export interface OrderTimelineItem {
  status: OrderStatus;
  label: string;
  timestamp: string;
  completed: boolean;
}

export interface Order {
  id: string; // ORD-1045
  requirementId?: string;
  offerId?: string;
  productId?: string;
  customerId: string;
  customerName: string;
  vendorId: string;
  vendorName: string;
  title: string;
  totalAmount: number;
  status: OrderStatus;
  expectedDelivery: string;
  timeline: OrderTimelineItem[];
  createdAt: string;
}
```

---

## 4. Complete Route Structure

| Route | Role Access | Component Purpose |
|---|---|---|
| `/` | Public | High-conversion Landing Page |
| `/login` | Public | Split-screen Auth with Instant Demo Login buttons |
| `/explore` | Public | Marketplace exploration (Products & Requirements) |
| `/how-it-works` | Public | Visual 4-step workflow explainer |
| `/customer/dashboard` | Customer | Active Requirements, Received Offers, Quick Stats |
| `/customer/requirements/new` | Customer | 4-Step Requirement Builder with Live Summary Sidebar |
| `/customer/requirements/:id` | Customer | Requirement Specs + List of Received Vendor Quotations |
| `/customer/requirements/:id/offers` | Customer | Dedicated Filterable Offers Feed |
| `/customer/requirements/:id/compare` | Customer | Multi-vendor Side-by-Side Comparison Matrix |
| `/customer/orders` | Customer | Customer Order History |
| `/orders/:id` | Protected | Visual 6-Stage Timeline Order Tracking |
| `/vendor/dashboard` | Vendor | Opportunities Feed, Submitted Quotations, Revenue Stats |
| `/vendor/opportunities` | Vendor | Opportunity Marketplace with Category/Budget Filters |
| `/vendor/opportunities/:id` | Vendor | Opportunity Specifications View |
| `/vendor/opportunities/:id/offer` | Vendor | Interactive Quotation Builder with Budget Difference Feedback |
| `/vendor/products` | Vendor | Vendor Product Management |
| `/vendor/orders` | Vendor | Vendor Order Management |
| `/admin/dashboard` | Admin | Executive Overview & Platform KPIs |
| `/admin/users` | Admin | Customer & Vendor User Administration |
| `/admin/requirements` | Admin | Global Requirements Moderation |
| `/admin/orders` | Admin | Platform-wide Order Auditing |

---

## 5. UI Design Tokens & Theme Specification

- **Background**: `#f8fafc` (slate-50)
- **Card/Surface**: `#ffffff` (pure white with soft `0 1px 3px rgba(0,0,0,0.05)` shadow)
- **Primary Accent**: Deep Indigo / Violet (`#4f46e5` / `#6366f1`)
- **Success**: Emerald (`#10b981`)
- **Warning**: Amber (`#f59e0b`)
- **Danger**: Rose (`#f43f5e`)
- **Typography**: Inter / System Sans-Serif with strict font hierarchy.

---

## 6. Self-Review Verification
- [x] **Placeholder Scan**: No TBD/TODOs present.
- [x] **Consistency**: Data models align across Requirement, Offer, and Order transitions.
- [x] **Scope Boundary**: 100% focused on complete frontend application with abstracted API layer for future REST connection.
- [x] **Ambiguity Check**: Role routing and demo mode credentials explicitly defined.

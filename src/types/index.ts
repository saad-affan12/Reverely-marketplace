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

export type RequirementStatus = 'open' | 'closed' | 'fulfilled' | 'cancelled';

export interface Requirement {
  id: string; // e.g. REQ-1024
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
  deadline: string; // ISO date string or formatted string
  status: RequirementStatus;
  offersCount: number;
  specifications: string[];
  attachments?: string[];
  createdAt: string;
}

export type OfferBadge = 'BEST VALUE' | 'FASTEST DELIVERY' | 'TOP RATED';
export type OfferStatus = 'pending' | 'accepted' | 'rejected';

export interface Offer {
  id: string; // e.g. OFF-501
  requirementId: string;
  vendorId: string;
  vendorName: string;
  vendorRating: number;
  vendorTrustScore: number; // 0 - 100
  price: number; // in INR ₹
  deliveryDays: number;
  warranty: string;
  includedServices: string[];
  notes: string;
  matchScore: number; // percentage e.g. 94
  badges?: OfferBadge[];
  status: OfferStatus;
  createdAt: string;
}

export type OrderStatus =
  | 'requirement_accepted'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'delivered';

export interface OrderTimelineItem {
  status: OrderStatus;
  label: string;
  timestamp: string;
  completed: boolean;
}

export interface Order {
  id: string; // e.g. ORD-1045
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

export interface Product {
  id: string;
  vendorId: string;
  vendorName: string;
  title: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  imageUrl: string;
  description: string;
}

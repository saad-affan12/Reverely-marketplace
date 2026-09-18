import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedLayout } from './components/layout/ProtectedLayout';
import { AnimatePresence, motion } from 'motion/react';

// Public pages
import { LandingPage } from './pages/public/LandingPage';
import { ExplorePage } from './pages/public/ExplorePage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { ProductDetailsPage } from './pages/public/ProductDetailsPage';
import { AboutPage } from './pages/public/AboutPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Auth pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// Customer pages
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { PostRequirementPage } from './pages/customer/PostRequirementPage';
import { RequirementDetailsPage } from './pages/customer/RequirementDetailsPage';
import { OffersPage } from './pages/customer/OffersPage';
import { CompareOffersPage } from './pages/customer/CompareOffersPage';
import { CustomerRequirementsPage } from './pages/customer/CustomerRequirementsPage';
import { CustomerOrdersPage } from './pages/customer/CustomerOrdersPage';

// Vendor pages
import { VendorDashboard } from './pages/vendor/VendorDashboard';
import { OpportunitiesPage } from './pages/vendor/OpportunitiesPage';
import { OpportunityDetailsPage } from './pages/vendor/OpportunityDetailsPage';
import { SubmitOfferPage } from './pages/vendor/SubmitOfferPage';
import { VendorOffersPage } from './pages/vendor/VendorOffersPage';
import { VendorProductsPage } from './pages/vendor/VendorProductsPage';
import { VendorProductEditPage } from './pages/vendor/VendorProductEditPage';
import { VendorOrdersPage } from './pages/vendor/VendorOrdersPage';

// Order tracking
import { OrderTrackingPage } from './pages/orders/OrderTrackingPage';

// Admin pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminRequirementsPage } from './pages/admin/AdminRequirementsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminVendorsPage } from './pages/admin/AdminVendorsPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOffersPage } from './pages/admin/AdminOffersPage';

// Shared pages
import { ProfilePage } from './pages/shared/ProfilePage';
import { NotificationsPage } from './pages/shared/NotificationsPage';

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 w-full"
      >
        <Routes location={location}>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Protected Customer Routes */}
          <Route element={<ProtectedLayout allowedRoles={['customer']} />}>
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/requirements" element={<CustomerRequirementsPage />} />
            <Route path="/customer/requirements/new" element={<PostRequirementPage />} />
            <Route path="/customer/requirements/:id" element={<RequirementDetailsPage />} />
            <Route path="/customer/requirements/:id/offers" element={<OffersPage />} />
            <Route path="/customer/requirements/:id/compare" element={<CompareOffersPage />} />
            <Route path="/customer/orders" element={<CustomerOrdersPage />} />
          </Route>

          {/* Protected Vendor Routes */}
          <Route element={<ProtectedLayout allowedRoles={['vendor']} />}>
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
            <Route path="/vendor/opportunities" element={<OpportunitiesPage />} />
            <Route path="/vendor/opportunities/:id" element={<OpportunityDetailsPage />} />
            <Route path="/vendor/opportunities/:id/offer" element={<SubmitOfferPage />} />
            <Route path="/vendor/offers" element={<VendorOffersPage />} />
            <Route path="/vendor/products" element={<VendorProductsPage />} />
            <Route path="/vendor/products/new" element={<VendorProductEditPage />} />
            <Route path="/vendor/products/:id/edit" element={<VendorProductEditPage />} />
            <Route path="/vendor/orders" element={<VendorOrdersPage />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<ProtectedLayout allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/requirements" element={<AdminRequirementsPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/vendors" element={<AdminVendorsPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/offers" element={<AdminOffersPage />} />
          </Route>

          {/* Shared Protected Routes */}
          <Route element={<ProtectedLayout />}>
            <Route path="/orders/:id" element={<OrderTrackingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>

          {/* 404 & Redirects */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#050816] text-[#F5F7FF] font-sans antialiased selection:bg-[#5B37F5] selection:text-white">
        <Navbar />
        <main className="flex-1 flex flex-col">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;

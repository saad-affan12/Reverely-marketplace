import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  PlusCircle,
  Bell,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { useAuthStore } from '../../stores/useAuthStore';
import { UserRole } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, switchDemoRole } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  // Top scroll progress indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 400, damping: 30, restDelta: 0.001 });

  const isActive = (path: string) => location.pathname === path;

  const handleRoleSwitch = (role: UserRole) => {
    switchDemoRole(role);
    setDemoMenuOpen(false);
    setMobileMenuOpen(false);
    if (role === 'customer') navigate('/customer/dashboard');
    else if (role === 'vendor') navigate('/vendor/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const navLinkClass = (path: string) =>
    `px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider font-mono-tech transition-all duration-200 ${
      isActive(path)
        ? 'text-[#F5F7FF] bg-[#5B37F5]/20 border border-[#5B37F5]/40 shadow-sm'
        : 'text-[#9DA9C6] hover:text-[#F5F7FF] hover:bg-white/5'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-[#050816]/90 backdrop-blur-xl border-b border-white/8 shadow-2xl transition-all">
      {/* Scroll progress bar */}
      <motion.div
        className="h-0.5 bg-gradient-to-r from-[#5B37F5] via-[#48CBFF] to-[#2BD696] origin-left"
        style={{ scaleX }}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: -3 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-xl bg-[#5B37F5] flex items-center justify-center text-white font-serif-editorial italic text-2xl shadow-lg shadow-[#5B37F5]/30 border border-white/20"
              >
                R
              </motion.div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-[#F5F7FF] flex items-center gap-1.5 font-mono-tech">
                  REVERSELY
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2BD696] inline-block animate-pulse" />
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#6B8CFF] -mt-1 font-mono-tech">
                  Marketplace System
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              {!isAuthenticated && (
                <>
                  <Link to="/explore" className={navLinkClass('/explore')}>
                    Explore
                  </Link>
                  <Link to="/how-it-works" className={navLinkClass('/how-it-works')}>
                    How It Works
                  </Link>
                </>
              )}

              {isAuthenticated && user?.role === 'customer' && (
                <>
                  <Link to="/explore" className={navLinkClass('/explore')}>
                    Explore
                  </Link>
                  <Link to="/customer/dashboard" className={navLinkClass('/customer/dashboard')}>
                    Dashboard
                  </Link>
                  <Link to="/customer/requirements" className={navLinkClass('/customer/requirements')}>
                    Requirements
                  </Link>
                  <Link to="/customer/orders" className={navLinkClass('/customer/orders')}>
                    Orders
                  </Link>
                </>
              )}

              {isAuthenticated && user?.role === 'vendor' && (
                <>
                  <Link to="/vendor/dashboard" className={navLinkClass('/vendor/dashboard')}>
                    Dashboard
                  </Link>
                  <Link to="/vendor/opportunities" className={navLinkClass('/vendor/opportunities')}>
                    Opportunities
                  </Link>
                  <Link to="/vendor/offers" className={navLinkClass('/vendor/offers')}>
                    Offers
                  </Link>
                  <Link to="/vendor/products" className={navLinkClass('/vendor/products')}>
                    Products
                  </Link>
                  <Link to="/vendor/orders" className={navLinkClass('/vendor/orders')}>
                    Orders
                  </Link>
                </>
              )}

              {isAuthenticated && user?.role === 'admin' && (
                <>
                  <Link to="/admin/dashboard" className={navLinkClass('/admin/dashboard')}>
                    Overview
                  </Link>
                  <Link to="/admin/users" className={navLinkClass('/admin/users')}>
                    Users
                  </Link>
                  <Link to="/admin/requirements" className={navLinkClass('/admin/requirements')}>
                    Requirements
                  </Link>
                  <Link to="/admin/orders" className={navLinkClass('/admin/orders')}>
                    Orders
                  </Link>
                  <Link to="/admin/vendors" className={navLinkClass('/admin/vendors')}>
                    Vendors
                  </Link>
                  <Link to="/admin/products" className={navLinkClass('/admin/products')}>
                    Products
                  </Link>
                  <Link to="/admin/offers" className={navLinkClass('/admin/offers')}>
                    Offers
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Right Action Area */}
          <div className="flex items-center space-x-3">
            {/* Demo Role Switcher Dropdown */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full border border-[#5B37F5]/40 bg-[#5B37F5]/15 text-[#6B8CFF] text-xs font-mono-tech hover:bg-[#5B37F5]/25 transition-all shadow-md cursor-pointer"
                title="Switch demo role instantly"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#48CBFF]" />
                <span className="capitalize font-semibold">Demo: {user?.role || 'Guest'}</span>
                <ChevronDown className="w-3 h-3 text-[#6B8CFF]" />
              </motion.button>

              <AnimatePresence>
                {demoMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 bg-[#0F1428] rounded-2xl shadow-2xl border border-white/12 py-2 z-50 overflow-hidden backdrop-blur-xl"
                  >
                    <div className="px-3.5 py-1.5 text-[10px] font-mono-tech font-bold text-[#6F7D9C] uppercase tracking-widest border-b border-white/8">
                      Switch Role
                    </div>
                    <button
                      onClick={() => handleRoleSwitch('customer')}
                      className={`w-full text-left px-3.5 py-2.5 text-xs font-medium flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer ${
                        user?.role === 'customer' ? 'text-[#6B8CFF] bg-[#5B37F5]/20 font-bold' : 'text-[#9DA9C6]'
                      }`}
                    >
                      <span>Customer (Saad)</span>
                      {user?.role === 'customer' && <span className="w-1.5 h-1.5 rounded-full bg-[#2BD696]" />}
                    </button>
                    <button
                      onClick={() => handleRoleSwitch('vendor')}
                      className={`w-full text-left px-3.5 py-2.5 text-xs font-medium flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer ${
                        user?.role === 'vendor' ? 'text-[#6B8CFF] bg-[#5B37F5]/20 font-bold' : 'text-[#9DA9C6]'
                      }`}
                    >
                      <span>Vendor (PrintHub)</span>
                      {user?.role === 'vendor' && <span className="w-1.5 h-1.5 rounded-full bg-[#2BD696]" />}
                    </button>
                    <button
                      onClick={() => handleRoleSwitch('admin')}
                      className={`w-full text-left px-3.5 py-2.5 text-xs font-medium flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer ${
                        user?.role === 'admin' ? 'text-[#6B8CFF] bg-[#5B37F5]/20 font-bold' : 'text-[#9DA9C6]'
                      }`}
                    >
                      <span>Admin</span>
                      {user?.role === 'admin' && <span className="w-1.5 h-1.5 rounded-full bg-[#2BD696]" />}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Post Requirement CTA for Customers & Guests */}
            {(!isAuthenticated || user?.role === 'customer') && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<PlusCircle className="w-4 h-4" />}
                onClick={() => navigate('/customer/requirements/new')}
                className="hidden sm:inline-flex"
              >
                Post Requirement
              </Button>
            )}

            {/* Logged Out Buttons */}
            {!isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Get Started
                </Button>
              </div>
            ) : (
              /* Logged In Utilities */
              <div className="flex items-center space-x-2">
                <Link
                  to="/notifications"
                  className="p-2 text-[#9DA9C6] hover:text-[#F5F7FF] rounded-xl hover:bg-white/5 transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#2BD696] rounded-full ring-2 ring-[#050816] animate-pulse" />
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-white/5 transition-colors border border-white/10 cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#5B37F5] text-white flex items-center justify-center font-bold text-xs">
                      {user?.name.charAt(0)}
                    </div>
                    <span className="hidden lg:block text-xs font-semibold text-[#F5F7FF]">
                      {user?.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#9DA9C6] hidden lg:block" />
                  </button>

                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-[#0F1428] rounded-2xl shadow-2xl border border-white/12 py-2 z-50 overflow-hidden"
                      >
                        <div className="px-4 py-2.5 border-b border-white/8">
                          <p className="text-sm font-bold text-[#F5F7FF]">{user?.name}</p>
                          <p className="text-xs text-[#9DA9C6] truncate">{user?.email}</p>
                          <div className="mt-1.5">
                            <Badge
                              variant={
                                user?.role === 'admin'
                                  ? 'danger'
                                  : user?.role === 'vendor'
                                  ? 'info'
                                  : 'success'
                              }
                              size="sm"
                            >
                              {user?.role.toUpperCase()}
                            </Badge>
                          </div>
                        </div>

                        <div className="py-1">
                          <Link
                            to="/profile"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-xs text-[#9DA9C6] hover:text-[#F5F7FF] hover:bg-white/5 transition-colors"
                          >
                            <UserIcon className="w-4 h-4 text-[#6F7D9C]" />
                            <span>Profile Settings</span>
                          </Link>
                        </div>

                        <div className="border-t border-white/8 pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left flex items-center space-x-2 px-4 py-2 text-xs text-[#FF5677] hover:bg-[#FF5677]/10 font-semibold transition-colors cursor-pointer"
                          >
                            <LogOut className="w-4 h-4 text-[#FF5677]" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#9DA9C6] hover:text-[#F5F7FF] rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t border-white/8 bg-[#050816] px-4 pt-3 pb-6 space-y-3 overflow-hidden"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/8">
              <span className="text-xs font-mono-tech uppercase text-[#6F7D9C]">
                Persona
              </span>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleRoleSwitch('customer')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    user?.role === 'customer' ? 'bg-[#5B37F5] text-white' : 'bg-[#0F1428] text-[#9DA9C6]'
                  }`}
                >
                  Customer
                </button>
                <button
                  onClick={() => handleRoleSwitch('vendor')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    user?.role === 'vendor' ? 'bg-[#5B37F5] text-white' : 'bg-[#0F1428] text-[#9DA9C6]'
                  }`}
                >
                  Vendor
                </button>
                <button
                  onClick={() => handleRoleSwitch('admin')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    user?.role === 'admin' ? 'bg-[#5B37F5] text-white' : 'bg-[#0F1428] text-[#9DA9C6]'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            <div className="space-y-1">
              {!isAuthenticated && (
                <>
                  <Link
                    to="/explore"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#F5F7FF] hover:bg-white/5"
                  >
                    Explore Marketplace
                  </Link>
                  <Link
                    to="/how-it-works"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#F5F7FF] hover:bg-white/5"
                  >
                    How It Works
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#6B8CFF] hover:bg-white/5"
                  >
                    Login / Demo Accounts
                  </Link>
                </>
              )}

              {isAuthenticated && user?.role === 'customer' && (
                <>
                  <Link
                    to="/customer/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#F5F7FF] hover:bg-white/5"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/customer/requirements/new"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-bold bg-[#5B37F5] text-white"
                  >
                    + Post New Requirement
                  </Link>
                  <Link
                    to="/customer/requirements"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#F5F7FF] hover:bg-white/5"
                  >
                    My Requirements
                  </Link>
                  <Link
                    to="/customer/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#F5F7FF] hover:bg-white/5"
                  >
                    My Orders
                  </Link>
                </>
              )}

              {isAuthenticated && user?.role === 'vendor' && (
                <>
                  <Link
                    to="/vendor/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#F5F7FF] hover:bg-white/5"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/vendor/opportunities"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#F5F7FF] hover:bg-white/5"
                  >
                    Opportunities
                  </Link>
                  <Link
                    to="/vendor/offers"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#F5F7FF] hover:bg-white/5"
                  >
                    My Offers
                  </Link>
                  <Link
                    to="/vendor/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#F5F7FF] hover:bg-white/5"
                  >
                    My Products
                  </Link>
                  <Link
                    to="/vendor/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#F5F7FF] hover:bg-white/5"
                  >
                    Orders
                  </Link>
                </>
              )}

              {isAuthenticated && user?.role === 'admin' && (
                <>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#F5F7FF] hover:bg-white/5"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/users"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#F5F7FF] hover:bg-white/5"
                  >
                    Users
                  </Link>
                  <Link
                    to="/admin/requirements"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#F5F7FF] hover:bg-white/5"
                  >
                    Requirements
                  </Link>
                  <Link
                    to="/admin/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#F5F7FF] hover:bg-white/5"
                  >
                    Orders
                  </Link>
                  <Link
                    to="/admin/vendors"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#F5F7FF] hover:bg-white/5"
                  >
                    Vendors
                  </Link>
                  <Link
                    to="/admin/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#F5F7FF] hover:bg-white/5"
                  >
                    Products
                  </Link>
                  <Link
                    to="/admin/offers"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#F5F7FF] hover:bg-white/5"
                  >
                    Offers
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;

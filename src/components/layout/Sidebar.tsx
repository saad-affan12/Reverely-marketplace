import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Tag,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
} from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const { user } = useAuthStore();
  const role = user?.role || 'customer';

  const customerLinks = [
    { to: '/customer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/customer/requirements', label: 'My Requirements', icon: FileText },
    { to: '/customer/requirements/new', label: 'Post Requirement', icon: Tag },
    { to: '/customer/orders', label: 'My Orders', icon: Package },
  ];

  const vendorLinks = [
    { to: '/vendor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/vendor/opportunities', label: 'Opportunities', icon: Tag },
    { to: '/vendor/offers', label: 'My Offers', icon: TrendingUp },
    { to: '/vendor/products', label: 'My Products', icon: ShoppingBag },
    { to: '/vendor/orders', label: 'Orders', icon: Package },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/requirements', label: 'Requirements', icon: FileText },
    { to: '/admin/orders', label: 'Orders', icon: Package },
  ];

  const links =
    role === 'admin' ? adminLinks : role === 'vendor' ? vendorLinks : customerLinks;

  return (
    <aside
      className={`w-64 bg-[#0F1428]/90 backdrop-blur-xl border-r border-white/8 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between ${className}`}
    >
      <div className="space-y-6">
        {/* User Info Header */}
        <div className="px-3.5 py-3 rounded-2xl bg-[#131A32] border border-white/10 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#5B37F5] text-white flex items-center justify-center font-bold text-sm shadow-md">
            {user?.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#F5F7FF] truncate">{user?.name}</p>
            <p className="text-xs text-[#6B8CFF] font-medium capitalize font-mono-tech">{role} Portal</p>
          </div>
        </div>

        {/* Nav list */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#5B37F5]/20 text-[#F5F7FF] font-semibold border-l-2 border-[#5B37F5] shadow-xs'
                      : 'text-[#9DA9C6] hover:bg-white/5 hover:text-[#F5F7FF]'
                  }`
                }
              >
                <Icon className="w-4.5 h-4.5 text-[#6B8CFF]" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / Info */}
      <div className="pt-4 border-t border-white/8 text-xs text-[#6F7D9C] px-3 font-mono-tech">
        <p className="font-semibold text-[#9DA9C6]">REVERSELY Platform</p>
        <p>Version 1.0.0 (Demo Mode)</p>
      </div>
    </aside>
  );
};

export default Sidebar;

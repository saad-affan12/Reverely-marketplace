import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050816] text-[#9DA9C6] border-t border-white/8 pt-20 pb-12 relative overflow-hidden font-sans">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#5B37F5]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#5B37F5] flex items-center justify-center text-white font-serif-editorial italic text-2xl shadow-lg shadow-[#5B37F5]/30 border border-white/20">
                R
              </div>
              <span className="font-extrabold text-2xl text-[#F5F7FF] tracking-tight font-mono-tech">
                REVERSELY
              </span>
            </div>
            <p className="text-[#F5F7FF] font-serif-editorial italic text-xl max-w-sm leading-snug">
              "Don't search. Let vendors come to you."
            </p>
            <p className="text-[#9DA9C6] text-xs leading-relaxed max-w-sm">
              Post what you need. Compare competitive quotes from verified suppliers across India. Pick the best proposal with confidence.
            </p>

            <div className="flex items-center space-x-6 pt-2">
              <div className="flex items-center space-x-2 text-xs font-mono-tech text-[#F5F7FF]">
                <ShieldCheck className="w-4 h-4 text-[#2BD696]" />
                <span>Verified Suppliers</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-mono-tech text-[#F5F7FF]">
                <Zap className="w-4 h-4 text-[#FAB505]" />
                <span>Fast Proposals</span>
              </div>
            </div>
          </div>

          {/* Col 2: Customers */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono-tech font-bold text-[#F5F7FF] uppercase tracking-widest">
              For Customers
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9DA9C6]">
              <li>
                <Link to="/customer/requirements/new" className="hover:text-[#6B8CFF] transition-colors">
                  Post a Requirement
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-[#6B8CFF] transition-colors">
                  Browse Marketplace
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-[#6B8CFF] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/customer/dashboard" className="hover:text-[#6B8CFF] transition-colors">
                  Customer Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Vendors */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono-tech font-bold text-[#F5F7FF] uppercase tracking-widest">
              For Vendors
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9DA9C6]">
              <li>
                <Link to="/vendor/opportunities" className="hover:text-[#6B8CFF] transition-colors">
                  Find Opportunities
                </Link>
              </li>
              <li>
                <Link to="/vendor/dashboard" className="hover:text-[#6B8CFF] transition-colors">
                  Vendor Dashboard
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#6B8CFF] transition-colors">
                  Register as Vendor
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono-tech font-bold text-[#F5F7FF] uppercase tracking-widest">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9DA9C6]">
              <li>
                <Link to="/about" className="hover:text-[#6B8CFF] transition-colors">
                  About Reversely
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-[#6B8CFF] transition-colors">
                  Admin Demo Panel
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#6F7D9C] space-y-4 md:space-y-0 font-mono-tech">
          <p>© 2026 REVERSELY Inc. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-[#F5F7FF] cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-[#F5F7FF] cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-[#F5F7FF] cursor-pointer transition-colors">Escrow Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

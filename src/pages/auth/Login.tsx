import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { UserRole } from '../../types';
import { Button, Input, Card, Badge } from '../../components/ui';
import {
  Building2,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');
  const { login, switchDemoRole } = useAuthStore();

  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleRedirect = (role: UserRole) => {
    if (returnUrl) {
      navigate(returnUrl);
      return;
    }
    if (role === 'customer') navigate('/customer/dashboard');
    else if (role === 'vendor') navigate('/vendor/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, selectedRole);
      if (success) {
        handleRoleRedirect(selectedRole);
      } else {
        setError('Invalid credentials for selected role');
      }
    } catch {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role: UserRole) => {
    switchDemoRole(role);
    handleRoleRedirect(role);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#050816] text-[#F5F7FF] font-sans">
      {/* Left Visual Panel - Editorial Brand & Value Prop */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#131A32] via-[#0F1428] to-[#050816] border-r border-white/8 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Radial Glow */}
        <div className="absolute top-1/4 -left-24 w-96 h-96 rounded-full bg-[#5B37F5]/15 blur-[120px] pointer-events-none" />

        {/* Top Brand Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5B37F5] flex items-center justify-center shadow-lg shadow-[#5B37F5]/30 text-white font-serif-editorial italic text-2xl font-bold border border-white/20">
              R
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white font-mono-tech">REVERSELY</span>
          </Link>
        </div>

        {/* Middle Value Proposition */}
        <div className="relative z-10 my-auto py-12 space-y-6">
          <Badge variant="primary" size="md" className="mb-2">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-[#48CBFF]" />
            Reverse Marketplace Engine
          </Badge>

          <h1 className="text-4xl font-extrabold text-white leading-tight">
            <span className="font-serif-editorial italic text-gradient-indigo font-normal text-5xl block mb-1">Don't search.</span>
            <span className="text-gradient-silver">Let vendors come to you.</span>
          </h1>

          <p className="text-[#9DA9C6] text-sm leading-relaxed max-w-md">
            Post what you need, receive competitive proposals from verified suppliers across India, compare side-by-side, and track orders.
          </p>

          <div className="space-y-3.5 pt-4">
            <div className="flex items-center gap-3 text-xs font-mono-tech text-[#F5F7FF]">
              <CheckCircle2 className="w-4 h-4 text-[#2BD696] shrink-0" />
              <span>Competitive offers matching your exact budget</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono-tech text-[#F5F7FF]">
              <CheckCircle2 className="w-4 h-4 text-[#2BD696] shrink-0" />
              <span>Compare price, warranty, delivery & trust score</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono-tech text-[#F5F7FF]">
              <CheckCircle2 className="w-4 h-4 text-[#2BD696] shrink-0" />
              <span>Full end-to-end 6-stage order tracking stepper</span>
            </div>
          </div>
        </div>

        {/* Bottom Metrics */}
        <div className="relative z-10 pt-6 border-t border-white/8 flex items-center justify-between text-xs font-mono-tech text-[#6F7D9C]">
          <span>10K+ Active Buyers</span>
          <span>2.5K+ Verified Vendors</span>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-7">
          {/* Mobile Logo & Header */}
          <div className="text-center sm:text-left space-y-2">
            <div className="flex items-center justify-center sm:justify-start lg:hidden mb-4">
              <Link to="/" className="inline-flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#5B37F5] flex items-center justify-center text-white font-serif-editorial italic text-2xl font-bold">
                  R
                </div>
                <span className="text-xl font-bold tracking-tight text-white font-mono-tech">REVERSELY</span>
              </Link>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FF]">Welcome Back</h2>
            <p className="text-xs text-[#9DA9C6]">
              Sign in to manage your requirements, proposals, or store
            </p>
          </div>

          {/* Quick Demo Access Card */}
          <Card variant="feature" className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-tech font-bold text-[#6B8CFF] uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#48CBFF]" />
                1-Click Demo Accounts
              </span>
              <Badge variant="success" size="sm">
                INSTANT ACCESS
              </Badge>
            </div>
            <p className="text-xs text-[#9DA9C6]">
              Select a persona to test the complete workflow immediately:
            </p>

            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => handleDemoLogin('customer')}
                className="flex flex-col items-center justify-center p-3 bg-[#131A32] border border-white/10 hover:border-[#5B37F5] rounded-xl transition-all text-center group cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-[#6B8CFF] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-[#F5F7FF]">Customer</span>
                <span className="text-[10px] text-[#9DA9C6] font-mono-tech">Saad</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('vendor')}
                className="flex flex-col items-center justify-center p-3 bg-[#131A32] border border-white/10 hover:border-[#5B37F5] rounded-xl transition-all text-center group cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-[#2BD696] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-[#F5F7FF]">Vendor</span>
                <span className="text-[10px] text-[#9DA9C6] font-mono-tech">PrintHub</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="flex flex-col items-center justify-center p-3 bg-[#131A32] border border-white/10 hover:border-[#5B37F5] rounded-xl transition-all text-center group cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#FAB505] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-[#F5F7FF]">Admin</span>
                <span className="text-[10px] text-[#9DA9C6] font-mono-tech">System</span>
              </button>
            </div>
          </Card>

          {/* Role Selection Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-mono-tech text-[#9DA9C6] uppercase tracking-wider block">Login Role</label>
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#0B1020] rounded-xl border border-white/10 font-mono-tech">
              <button
                type="button"
                onClick={() => setSelectedRole('customer')}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  selectedRole === 'customer'
                    ? 'bg-[#5B37F5] text-white shadow-md'
                    : 'text-[#9DA9C6] hover:text-[#F5F7FF]'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Customer
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('vendor')}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  selectedRole === 'vendor'
                    ? 'bg-[#5B37F5] text-white shadow-md'
                    : 'text-[#9DA9C6] hover:text-[#F5F7FF]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                Vendor
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-[#FF5677]/15 border border-[#FF5677]/30 text-xs text-[#FF5677] font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5677] shrink-0" />
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder={selectedRole === 'customer' ? 'customer@example.com' : 'vendor@example.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-xs font-mono-tech">
              <label className="flex items-center gap-2 text-[#9DA9C6] cursor-pointer">
                <input type="checkbox" className="rounded border-white/10 bg-[#131A32] text-[#5B37F5] focus:ring-[#5B37F5]" />
                <span>Remember me</span>
              </label>
              <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[#6B8CFF] hover:underline">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              size="lg"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to REVERSELY
            </Button>
          </form>

          {/* Footer Navigation */}
          <p className="text-center text-xs text-[#9DA9C6]">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-[#6B8CFF] font-bold hover:underline font-mono-tech">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

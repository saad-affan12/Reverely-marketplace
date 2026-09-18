import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { UserRole } from '../../types';
import { Button, Input, Card } from '../../components/ui';
import {
  Building2,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { EditorialBackgroundText } from '../../components/layout/EditorialBackgroundText';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [role, setRole] = useState<UserRole>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (role === 'vendor' && !companyName) {
      setError('Please enter your business or company name');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, role);
      if (role === 'customer') {
        navigate('/customer/dashboard');
      } else {
        navigate('/vendor/dashboard');
      }
    } catch {
      setError('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-[#F5F7FF] font-sans flex flex-col justify-center py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <EditorialBackgroundText text="REGISTER" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link to="/" className="inline-flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#5B37F5] flex items-center justify-center text-white font-serif-editorial italic text-2xl font-bold shadow-lg shadow-[#5B37F5]/30 border border-white/20">
            R
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white font-mono-tech">REVERSELY</span>
        </Link>
        <h2 className="text-3xl font-extrabold text-[#F5F7FF]">Create your account</h2>
        <p className="mt-2 text-xs sm:text-sm text-[#9DA9C6]">
          Join thousands of buyers & vendors on India's premier reverse marketplace platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Card variant="elevated" className="space-y-6 p-8">
          {/* Role Choice Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-mono-tech text-[#9DA9C6] uppercase tracking-wider block">Account Type</label>
            <div className="grid grid-cols-2 gap-2.5 p-1.5 bg-[#0B1020] rounded-2xl border border-white/10 font-mono-tech">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`py-3 text-xs font-bold rounded-xl transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  role === 'customer'
                    ? 'bg-[#5B37F5] text-white shadow-md'
                    : 'text-[#9DA9C6] hover:text-[#F5F7FF]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>I want to Buy</span>
                </div>
                <span className="text-[10px] opacity-80 font-normal">Post requirements & get offers</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('vendor')}
                className={`py-3 text-xs font-bold rounded-xl transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  role === 'vendor'
                    ? 'bg-[#5B37F5] text-white shadow-md'
                    : 'text-[#9DA9C6] hover:text-[#F5F7FF]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>I want to Sell</span>
                </div>
                <span className="text-[10px] opacity-80 font-normal">Discover leads & submit quotes</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-[#FF5677]/15 border border-[#FF5677]/30 text-xs text-[#FF5677] font-medium">
                {error}
              </div>
            )}

            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. Saad Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            {role === 'vendor' && (
              <Input
                label="Company / Business Name"
                type="text"
                placeholder="e.g. PrintHub Solutions"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            )}

            <Input
              label="Work Email Address"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="text-xs text-[#9DA9C6] leading-relaxed">
              By creating an account, you agree to Reversely's{' '}
              <a href="#terms" onClick={(e) => e.preventDefault()} className="text-[#6B8CFF] hover:underline font-mono-tech">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-[#6B8CFF] hover:underline font-mono-tech">
                Privacy Policy
              </a>.
            </div>

            <Button
              type="submit"
              size="lg"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {role === 'customer' ? 'Create Customer Account' : 'Register as Vendor'}
            </Button>
          </form>

          <p className="text-center text-xs text-[#9DA9C6]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#6B8CFF] font-bold hover:underline font-mono-tech">
              Sign in instead
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Register;

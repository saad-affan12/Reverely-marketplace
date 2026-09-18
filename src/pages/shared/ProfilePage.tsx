import React from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { Card, Button, Badge } from '../../components/ui';
import { PageContainer, PageHero } from '../../components/layout';
import { User, Mail, Building, ShieldCheck, LogOut } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  return (
    <PageContainer bgText="PROFILE">
      <div className="max-w-3xl mx-auto space-y-6">
        <PageHero
          eyebrow="REVERSELY ACCOUNT MATRIX"
          title="User Profile Settings"
          description="Manage your account profile, verified badge statuses, and security preferences."
          bgText="PROFILE"
        />

        <Card variant="default" className="p-8 space-y-6 border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-950/80 text-indigo-400 border border-indigo-800/50 flex items-center justify-center font-serif-editorial italic font-bold text-3xl">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              <div className="flex items-center gap-2 mt-1 font-mono-tech">
                <Badge variant="info">{user.role.toUpperCase()}</Badge>
                {user.verified && (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Account
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800 text-xs font-mono-tech">
            <div className="flex items-center gap-3 text-slate-300">
              <Mail className="w-4 h-4 text-indigo-400" /> {user.email}
            </div>
            {user.companyName && (
              <div className="flex items-center gap-3 text-slate-300">
                <Building className="w-4 h-4 text-indigo-400" /> {user.companyName}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800">
            <Button variant="danger" size="sm" onClick={logout} className="font-mono-tech font-bold">
              <LogOut className="w-4 h-4 mr-2" /> Log Out Account
            </Button>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default ProfilePage;


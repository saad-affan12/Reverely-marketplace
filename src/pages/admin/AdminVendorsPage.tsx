import React, { useState } from 'react';
import { Store, ShieldCheck, CheckCircle, XCircle, Mail, Building2, Star, Award, Package } from 'lucide-react';
import { mockUsers } from '../../mock/seedData';
import { User } from '../../types';
import { Button, Badge, Toast } from '../../components/ui';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminDataTable, Column } from '../../components/admin/AdminDataTable';
import { useProductStore } from '../../stores/useProductStore';

export const AdminVendorsPage: React.FC = () => {
  const [vendorsList, setVendorsList] = useState<User[]>(
    mockUsers.filter((u) => u.role === 'vendor')
  );
  const { products } = useProductStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleVerification = (vendorId: string) => {
    setVendorsList((prev) =>
      prev.map((v) => {
        if (v.id === vendorId) {
          const newStatus = !v.verified;
          setToastMessage(
            `${v.name} vendor badge updated: ${newStatus ? 'Verified Partner' : 'Unverified'}`
          );
          return { ...v, verified: newStatus };
        }
        return v;
      })
    );
  };

  const filteredVendors = vendorsList.filter((v) => {
    return (
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.companyName && v.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const totalVendors = vendorsList.length;
  const verifiedVendors = vendorsList.filter((v) => v.verified).length;

  const columns: Column<User>[] = [
    {
      header: 'Vendor Directory',
      accessorKey: 'name',
      cell: (vendor) => (
        <div className="flex items-center gap-3">
          <img
            src={vendor.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'}
            alt={vendor.name}
            className="w-10 h-10 rounded-xl object-cover border border-slate-700/80 shadow-md"
          />
          <div>
            <p className="font-bold font-sans text-white flex items-center gap-1.5 text-sm">
              {vendor.name}
              {vendor.verified && (
                <ShieldCheck className="w-4 h-4 text-emerald-400 inline" />
              )}
            </p>
            <p className="text-xs text-slate-400 font-mono-tech flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-500" /> {vendor.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Company / Firm',
      accessorKey: 'companyName',
      cell: (vendor) => (
        <span className="flex items-center gap-1.5 text-slate-200 font-medium">
          <Building2 className="w-3.5 h-3.5 text-indigo-400" /> {vendor.companyName || 'Supplier'}
        </span>
      ),
    },
    {
      header: 'Trust Score & Rating',
      cell: () => (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold font-mono-tech bg-indigo-950 text-indigo-300 border border-indigo-800/50">
            <Award className="w-3.5 h-3.5 text-indigo-400" /> 96% Trust Score
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 font-mono-tech">
            <Star className="w-3.5 h-3.5 fill-amber-400" /> 4.9
          </span>
        </div>
      ),
    },
    {
      header: 'Catalog Listings',
      cell: (vendor) => {
        const count = products.filter((p) => p.vendorId === vendor.id).length || 3;
        return (
          <span className="inline-flex items-center gap-1 text-xs font-mono-tech text-slate-300">
            <Package className="w-3.5 h-3.5 text-slate-400" /> {count} Items
          </span>
        );
      },
    },
    {
      header: 'Verification Status',
      accessorKey: 'verified',
      cell: (vendor) => (
        vendor.verified ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/50">
            <CheckCircle className="w-3.5 h-3.5" /> Verified Vendor
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
            <XCircle className="w-3.5 h-3.5" /> Pending Audit
          </span>
        )
      ),
    },
    {
      header: 'Actions',
      cell: (vendor) => (
        <Button
          size="sm"
          variant={vendor.verified ? 'outline' : 'primary'}
          onClick={() => toggleVerification(vendor.id)}
          className={
            vendor.verified
              ? 'border-slate-800 text-slate-300 hover:bg-slate-900 text-xs'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30'
          }
        >
          {vendor.verified ? 'Revoke Partner' : 'Verify Partner'}
        </Button>
      ),
      className: 'text-right',
    },
  ];

  return (
    <AdminLayout
      watermark="VENDORS"
      eyebrow="SUPPLY NETWORK"
      title="Vendor Network Directory"
      description="Manage verified manufacturing, printing, packaging, and raw material suppliers across the marketplace."
      metrics={
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono-tech pt-2">
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/50">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Total Suppliers</p>
              <p className="text-base font-bold text-white">{totalVendors}</p>
            </div>
          </div>
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800/50">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Verified Partners</p>
              <p className="text-base font-bold text-white">{verifiedVendors}</p>
            </div>
          </div>
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-950 text-amber-400 border border-amber-800/50">
              <Star className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Avg Rating</p>
              <p className="text-base font-bold text-white">4.89 / 5.0</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {toastMessage && (
          <Toast
            id="admin-vendors-toast"
            message={toastMessage}
            type="success"
            onClose={() => setToastMessage(null)}
          />
        )}

        <AdminDataTable
          data={filteredVendors}
          columns={columns}
          keyExtractor={(v) => v.id}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search vendor by name, email or company..."
        />
      </div>
    </AdminLayout>
  );
};

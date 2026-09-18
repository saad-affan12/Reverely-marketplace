import React, { useState } from 'react';
import { ShieldCheck, CheckCircle, XCircle, Mail, Building2, Users, Store, User as UserIcon } from 'lucide-react';
import { mockUsers } from '../../mock/seedData';
import { User } from '../../types';
import { Button, Badge, Toast } from '../../components/ui';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminDataTable, Column } from '../../components/admin/AdminDataTable';

export const AdminUsersPage: React.FC = () => {
  const [usersList, setUsersList] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleVerification = (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = !u.verified;
          setToastMessage(
            `${u.name} status updated: ${newStatus ? 'Verified Badge Granted' : 'Verification Revoked'}`
          );
          return { ...u, verified: newStatus };
        }
        return u;
      })
    );
  };

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.companyName && u.companyName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const totalUsers = usersList.length;
  const customersCount = usersList.filter((u) => u.role === 'customer').length;
  const vendorsCount = usersList.filter((u) => u.role === 'vendor').length;
  const verifiedCount = usersList.filter((u) => u.verified).length;

  const columns: Column<User>[] = [
    {
      header: 'User Profile',
      accessorKey: 'name',
      cell: (user) => (
        <div className="flex items-center gap-3">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={user.name}
            className="w-10 h-10 rounded-xl object-cover border border-slate-700/80 shadow-md"
          />
          <div>
            <p className="font-bold font-sans text-white flex items-center gap-1.5 text-sm">
              {user.name}
              {user.verified && (
                <ShieldCheck className="w-4 h-4 text-indigo-400 inline" />
              )}
            </p>
            <p className="text-xs text-slate-400 font-mono-tech flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-500" /> {user.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessorKey: 'role',
      cell: (user) => (
        <Badge
          variant={
            user.role === 'admin'
              ? 'danger'
              : user.role === 'vendor'
              ? 'info'
              : 'neutral'
          }
        >
          {user.role.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Company / Brand',
      accessorKey: 'companyName',
      cell: (user) => (
        user.companyName ? (
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" /> {user.companyName}
          </span>
        ) : (
          <span className="text-slate-500 font-mono-tech">—</span>
        )
      ),
    },
    {
      header: 'Verification Status',
      accessorKey: 'verified',
      cell: (user) => (
        user.verified ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/50">
            <CheckCircle className="w-3.5 h-3.5" /> Verified
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
            <XCircle className="w-3.5 h-3.5" /> Unverified
          </span>
        )
      ),
    },
    {
      header: 'Actions',
      cell: (user) => (
        <Button
          size="sm"
          variant={user.verified ? 'outline' : 'primary'}
          onClick={() => toggleVerification(user.id)}
          className={
            user.verified
              ? 'border-slate-800 text-slate-300 hover:bg-slate-900 text-xs'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30'
          }
        >
          {user.verified ? 'Revoke Badge' : 'Verify User'}
        </Button>
      ),
      className: 'text-right',
    },
  ];

  return (
    <AdminLayout
      watermark="USERS"
      eyebrow="PEOPLE ON REVERSELY"
      title="Users Administration"
      description="Audit and manage marketplace customers, vendors, and platform verification badges."
      metrics={
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-tech pt-2">
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800/50">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Total Accounts</p>
              <p className="text-base font-bold text-white">{totalUsers}</p>
            </div>
          </div>
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-950 text-blue-400 border border-blue-800/50">
              <UserIcon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Customers</p>
              <p className="text-base font-bold text-white">{customersCount}</p>
            </div>
          </div>
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/50">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Vendors</p>
              <p className="text-base font-bold text-white">{vendorsCount}</p>
            </div>
          </div>
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-950 text-purple-400 border border-purple-800/50">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Verified</p>
              <p className="text-base font-bold text-white">{verifiedCount}</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {toastMessage && (
          <Toast
            id="admin-users-toast"
            message={toastMessage}
            type="success"
            onClose={() => setToastMessage(null)}
          />
        )}

        <AdminDataTable
          data={filteredUsers}
          columns={columns}
          keyExtractor={(u) => u.id}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search user by name, email or company..."
          filters={[
            {
              id: 'role',
              label: 'Role',
              value: roleFilter,
              options: [
                { value: 'all', label: 'All Roles' },
                { value: 'customer', label: 'Customers' },
                { value: 'vendor', label: 'Vendors' },
                { value: 'admin', label: 'Admins' },
              ],
              onChange: setRoleFilter,
            },
          ]}
        />
      </div>
    </AdminLayout>
  );
};

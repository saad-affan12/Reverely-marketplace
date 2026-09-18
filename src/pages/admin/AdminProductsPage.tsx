import React, { useState } from 'react';
import { Package, Tag, Star, Store, TrendingUp } from 'lucide-react';
import { useProductStore } from '../../stores/useProductStore';
import { Product } from '../../types';
import { Badge } from '../../components/ui';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminDataTable, Column } from '../../components/admin/AdminDataTable';

export const AdminProductsPage: React.FC = () => {
  const { products } = useProductStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const totalProducts = products.length;
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);

  const columns: Column<Product>[] = [
    {
      header: 'Product Catalog Item',
      accessorKey: 'title',
      cell: (product) => (
        <div className="flex items-center gap-3">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-11 h-11 rounded-xl object-cover border border-slate-700/80 shadow-md shrink-0"
          />
          <div className="max-w-xs space-y-0.5">
            <p className="font-bold font-sans text-white text-sm truncate">{product.title}</p>
            <p className="text-[10px] text-indigo-400 font-mono-tech">ID: {product.id}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Vendor Supplier',
      accessorKey: 'vendorName',
      cell: (product) => (
        <span className="flex items-center gap-1.5 text-slate-300 font-medium">
          <Store className="w-3.5 h-3.5 text-emerald-400" /> {product.vendorName}
        </span>
      ),
    },
    {
      header: 'Category',
      accessorKey: 'category',
      cell: (product) => (
        <span className="inline-flex items-center gap-1 text-xs font-mono-tech text-slate-300 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
          <Tag className="w-3 h-3 text-indigo-400" /> {product.category}
        </span>
      ),
    },
    {
      header: 'Unit Price',
      accessorKey: 'price',
      cell: (product) => (
        <span className="font-bold text-white font-mono-tech text-sm">
          {formatCurrency(product.price)}
        </span>
      ),
    },
    {
      header: 'Inventory Stock',
      accessorKey: 'stock',
      cell: (product) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-mono-tech ${
            product.stock > 50
              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
              : 'bg-amber-950/80 text-amber-400 border border-amber-800/50'
          }`}
        >
          {product.stock} units
        </span>
      ),
    },
    {
      header: 'Rating',
      accessorKey: 'rating',
      cell: (product) => (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 font-mono-tech">
          <Star className="w-3.5 h-3.5 fill-amber-400" /> {product.rating.toFixed(1)}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout
      watermark="PRODUCTS"
      eyebrow="MARKETPLACE CATALOG"
      title="Direct Store Catalog"
      description="Audit marketplace products, category classifications, inventory levels, and vendor pricing."
      metrics={
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono-tech pt-2">
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800/50">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Catalog Items</p>
              <p className="text-base font-bold text-white">{totalProducts}</p>
            </div>
          </div>
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/50">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Total Unit Stock</p>
              <p className="text-base font-bold text-white">{totalStock.toLocaleString('en-IN')}</p>
            </div>
          </div>
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-950 text-purple-400 border border-purple-800/50">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Categories</p>
              <p className="text-base font-bold text-white">{categories.length}</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <AdminDataTable
          data={filteredProducts}
          columns={columns}
          keyExtractor={(p) => p.id}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search product by title, vendor or ID..."
          filters={[
            {
              id: 'category',
              label: 'Category',
              value: categoryFilter,
              options: [
                { value: 'all', label: 'All Categories' },
                ...categories.map((c) => ({ value: c, label: c })),
              ],
              onChange: setCategoryFilter,
            },
          ]}
        />
      </div>
    </AdminLayout>
  );
};

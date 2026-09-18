import React from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../../stores/useProductStore';
import { Card, Button, Badge } from '../../components/ui';
import { PageContainer, PageHero } from '../../components/layout';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';

export const VendorProductsPage: React.FC = () => {
  const { products, deleteProduct } = useProductStore();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <PageContainer bgText="CATALOG">
      <div className="space-y-8">
        <PageHero
          eyebrow="SUPPLIER STORE MANAGEMENT"
          title="Product Catalog"
          titleHighlight="Listings"
          description="Manage direct marketplace catalog items, inventory levels, pricing, and product specifications."
          bgText="CATALOG"
          action={
            <Link to="/vendor/products/new">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 shadow-lg shadow-indigo-600/30">
                <Plus className="w-4 h-4 mr-2" /> Add Product Listing
              </Button>
            </Link>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} variant="interactive" className="p-4 flex flex-col justify-between space-y-4 border-slate-800">
              <div className="space-y-3">
                <img src={product.imageUrl} alt={product.title} className="w-full h-44 object-cover rounded-2xl border border-slate-800" />
                <Badge variant="info">{product.category}</Badge>
                <h3 className="font-bold text-white line-clamp-1">{product.title}</h3>
                <div className="flex items-center justify-between text-xs font-mono-tech">
                  <span className="font-bold text-indigo-400 text-lg">{formatCurrency(product.price)}</span>
                  <span className="flex items-center gap-1 text-xs text-amber-400 font-medium">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {product.rating}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                <Link to={`/vendor/products/${product.id}/edit`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full border-slate-800 text-slate-300 hover:bg-slate-900 text-xs">
                    <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit Specs
                  </Button>
                </Link>
                <Button variant="danger" size="sm" onClick={() => deleteProduct(product.id)} className="text-xs">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

export default VendorProductsPage;


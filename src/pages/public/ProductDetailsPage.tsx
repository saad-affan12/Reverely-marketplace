import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductStore } from '../../stores/useProductStore';
import { Star, ShieldCheck, Truck, ShoppingCart, ArrowLeft, Store } from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui';
import { PageContainer } from '../../components/layout/PageContainer';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const products = useProductStore((state) => state.products);
  const product = products.find((p) => p.id === id) || products[0];

  if (!product) {
    return (
      <PageContainer className="text-center py-20">
        <h2 className="text-2xl font-bold text-[#F5F7FF]">Product Not Found</h2>
        <Link to="/explore" className="text-[#6B8CFF] hover:underline mt-4 inline-block font-mono-tech">Back to Marketplace</Link>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Link to="/explore" className="inline-flex items-center gap-2 text-xs font-mono-tech text-[#9DA9C6] hover:text-[#F5F7FF] uppercase tracking-wider transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-[#0F1428] rounded-3xl border border-white/10 p-8 flex items-center justify-center min-h-[420px] relative shadow-2xl">
          <img src={product.imageUrl} alt={product.title} className="max-h-96 object-contain rounded-xl shadow-lg" />
        </div>

        <div className="space-y-6">
          <div>
            <Badge variant="info" size="md" className="mb-3">
              {product.category}
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F5F7FF] mt-1 leading-tight">{product.title}</h1>
            <div className="flex items-center gap-4 mt-3 font-mono-tech">
              <span className="flex items-center gap-1.5 text-[#FAB505] font-bold text-sm bg-[#131A32] px-3 py-1 rounded-full border border-white/10">
                <Star className="w-4 h-4 fill-[#FAB505]" /> {product.rating}
              </span>
              <span className="text-[#6F7D9C]">•</span>
              <span className="text-[#9DA9C6] text-xs flex items-center gap-1.5">
                <Store className="w-4 h-4 text-[#6B8CFF]" /> {product.vendorName}
              </span>
            </div>
          </div>

          <Card variant="elevated" className="space-y-1">
            <span className="text-xs font-mono-tech uppercase text-[#6F7D9C] tracking-wider">Catalog Direct Price</span>
            <div className="text-4xl font-extrabold text-[#2BD696]">₹{product.price.toLocaleString('en-IN')}</div>
            <p className="text-xs text-[#9DA9C6] font-mono-tech pt-1">In stock ({product.stock} units available)</p>
          </Card>

          <p className="text-[#9DA9C6] leading-relaxed text-sm sm:text-base">{product.description}</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-[#0F1428] rounded-xl border border-white/8 text-xs text-[#9DA9C6] font-mono-tech">
              <ShieldCheck className="w-5 h-5 text-[#2BD696] shrink-0" />
              <span>Verified Vendor Guarantee</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-[#0F1428] rounded-xl border border-white/8 text-xs text-[#9DA9C6] font-mono-tech">
              <Truck className="w-5 h-5 text-[#6B8CFF] shrink-0" />
              <span>Express Escrow Delivery</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/8">
            <Button size="lg" variant="primary" className="flex-1" leftIcon={<ShoppingCart className="w-4 h-4" />}>
              Direct Order
            </Button>
            <Link to="/customer/requirements/new" className="flex-1">
              <Button variant="outline" size="lg" className="w-full">
                Post Requirement
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ProductDetailsPage;

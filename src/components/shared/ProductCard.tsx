import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { Card, Button } from '../ui';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card variant="interactive" className="flex flex-col justify-between h-full overflow-hidden p-0 group">
      <div className="relative h-48 bg-[#131A32] overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60';
          }}
        />
        <span className="absolute top-3 left-3 text-[10px] font-bold text-[#6B8CFF] bg-[#0F1428]/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/12 font-mono-tech uppercase tracking-wider">
          {product.category}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-[#9DA9C6] mb-1.5 font-mono-tech">
            <span className="truncate">By {product.vendorName}</span>
            <div className="flex items-center gap-1 text-[#FAB505] font-semibold shrink-0">
              <Star className="w-3.5 h-3.5 fill-[#FAB505]" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          </div>

          <h3 className="text-base font-bold text-[#F5F7FF] line-clamp-1 mb-1.5 group-hover:text-[#6B8CFF] transition-colors">
            {product.title}
          </h3>

          <p className="text-xs text-[#9DA9C6] line-clamp-2 mb-3 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="border-t border-white/8 pt-3.5 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[10px] uppercase font-mono-tech text-[#6F7D9C] block">Fixed Price</span>
            <span className="text-lg font-extrabold text-[#2BD696]">
              {formatCurrency(product.price)}
            </span>
          </div>

          <Button
            size="sm"
            variant="secondary"
            className="gap-1.5"
            onClick={() => navigate(`/products/${product.id}`)}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#6B8CFF]" />
            <span>View</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

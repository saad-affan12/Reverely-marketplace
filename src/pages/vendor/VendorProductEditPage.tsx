import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProductStore } from '../../stores/useProductStore';
import { Card, Input, Select, Textarea, Button } from '../../components/ui';
import { PageContainer } from '../../components/layout';

export const VendorProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct } = useProductStore();
  const existing = products.find((p) => p.id === id);

  const [title, setTitle] = useState(existing?.title || '');
  const [category, setCategory] = useState(existing?.category || 'Apparel & Merch');
  const [price, setPrice] = useState(existing?.price?.toString() || '');
  const [stock, setStock] = useState(existing?.stock?.toString() || '100');
  const [imageUrl, setImageUrl] = useState(
    existing?.imageUrl ||
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60'
  );
  const [description, setDescription] = useState(existing?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (existing) {
      updateProduct(existing.id, {
        title,
        category,
        price: Number(price),
        stock: Number(stock),
        imageUrl,
        description,
      });
    } else {
      addProduct({
        title,
        category,
        price: Number(price),
        stock: Number(stock),
        imageUrl,
        description,
        vendorId: 'v1',
        vendorName: 'PrintHub Supplies',
        rating: 4.8,
      });
    }
    navigate('/vendor/products');
  };

  return (
    <PageContainer bgText="PRODUCT">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card variant="default" className="p-8 space-y-6 border-slate-800">
          <h1 className="text-2xl font-bold text-white">
            {existing ? 'Edit Catalog Product' : 'Add New Catalog Product'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4 font-mono-tech">
            <Input
              label="Product Title"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              required
            />
            <Select
              label="Category"
              value={category}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
              options={[
                { value: 'Apparel & Merch', label: 'Apparel & Merch' },
                { value: 'Office Supplies', label: 'Office Supplies' },
                { value: 'Electronics', label: 'Electronics' },
                { value: 'Printing & Packaging', label: 'Printing & Packaging' },
              ]}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price (₹ INR)"
                type="number"
                value={price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
                required
              />
              <Input
                label="Available Stock"
                type="number"
                value={stock}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStock(e.target.value)}
                required
              />
            </div>
            <Input
              label="Image URL"
              value={imageUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImageUrl(e.target.value)}
            />
            <Textarea
              label="Description & Specifications"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              rows={4}
            />

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="border-slate-800 text-slate-300 hover:bg-slate-900"
                onClick={() => navigate('/vendor/products')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
              >
                {existing ? 'Save Product Changes' : 'Create Product Listing'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </PageContainer>
  );
};

export default VendorProductEditPage;


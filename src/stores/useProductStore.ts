import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';
import { mockProducts } from '../mock/seedData';

interface ProductState {
  products: Product[];
  addProduct: (productData: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, productData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: mockProducts,

      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: `PRD-${Math.floor(100 + Math.random() * 900)}`,
        };
        set((state) => ({
          products: [newProduct, ...state.products],
        }));
        return newProduct;
      },

      updateProduct: (id, productData) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...productData } : p
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      getProductById: (id) => {
        return get().products.find((p) => p.id === id);
      },
    }),
    {
      name: 'reversely_product_store',
    }
  )
);

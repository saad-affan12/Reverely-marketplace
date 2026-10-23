import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';
import { mockProducts } from '../mock/seedData';
import { productsApi } from '../services/api/productsApi';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (productData: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: mockProducts,
      isLoading: false,

      fetchProducts: async () => {
        set({ isLoading: true });
        try {
          const res = await productsApi.getProducts();
          if (res.data && res.data.length > 0) {
            set({ products: res.data, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch {
          set({ isLoading: false });
        }
      },

      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: `PRD-${Math.floor(100 + Math.random() * 900)}`,
        };
        set((state) => ({
          products: [newProduct, ...state.products],
        }));

        productsApi.createProduct(productData).then((res) => {
          if (res.data?.id && res.data.id !== newProduct.id) {
            set((state) => ({
              products: state.products.map((p) =>
                p.id === newProduct.id ? res.data : p
              ),
            }));
          }
        }).catch(() => {
          // Keep local optimistic product
        });

        return newProduct;
      },

      updateProduct: async (id, productData) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...productData } : p
          ),
        }));

        try {
          await productsApi.updateProduct(id, productData);
        } catch {
          // Keep local state
        }
      },

      deleteProduct: async (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));

        try {
          await productsApi.deleteProduct(id);
        } catch {
          // Keep local state
        }
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

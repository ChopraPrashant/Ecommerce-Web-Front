import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import authReducer from './slices/authSlice';
import cartReducer from './slices/simpleCartSlice';
import productReducer from './slices/productSlice';

// Auth state
export interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

// Cart item
export interface CartItem {
  _id: string;
  product: string | any; // Should be string | IProduct, but avoiding circular dependency
  variant?: string;
  quantity: number;
  price: number;
  discount?: number;
  attributes?: Record<string, string>;
  name: string;
  image?: string;
  stock: number;
  sku: string;
  weight?: number;
  id?: string; // For backward compatibility
}

// Cart state
export interface CartState {
  cart: {
    _id: string;
    user: string;
    items: CartItem[];
    totals: {
      subtotal: number;
      discount: number;
      shipping: number;
      tax: number;
      total: number;
      currency: string;
    };
    coupon?: any;
    createdAt: string;
    updatedAt: string;
  } | null;
  isLoading: boolean;
  error: string | null;
  isUpdating: boolean;
}

// Product state
export interface ProductState {
  products: any[];
  featuredProducts: any[];
  relatedProducts: any[];
  product: any | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: any;
  searchQuery: string;
}

// Root state
export interface RootState {
  auth: AuthState;
  cart: CartState;
  products: ProductState;
  // Add other state slices as needed
}

export type AppDispatch = typeof store.dispatch;

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
        ignoredActionPaths: [],
        ignoredPaths: [],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Export the typed hooks for use throughout the app
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;

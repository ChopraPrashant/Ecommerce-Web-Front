import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IProduct, IProductFilter, IPagination } from '../../types/product';

interface ProductState {
  products: IProduct[];
  featuredProducts: IProduct[];
  relatedProducts: IProduct[];
  product: IProduct | null;
  loading: boolean;
  error: string | null;
  pagination: IPagination;
  filters: IProductFilter;
  searchQuery: string;
}

const initialState: ProductState = {
  products: [],
  featuredProducts: [],
  relatedProducts: [],
  product: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  },
  filters: {
    categories: [],
    priceRange: { min: 0, max: 10000 },
    ratings: [],
    attributes: {},
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  searchQuery: '',
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Fetch products
    fetchProductsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProductsSuccess: (
      state,
      action: PayloadAction<{ products: IProduct[]; pagination: IPagination }>
    ) => {
      state.loading = false;
      state.products = action.payload.products;
      state.pagination = action.payload.pagination;
      state.error = null;
    },
    fetchProductsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch featured products
    fetchFeaturedProductsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchFeaturedProductsSuccess: (state, action: PayloadAction<IProduct[]>) => {
      state.loading = false;
      state.featuredProducts = action.payload;
      state.error = null;
    },
    fetchFeaturedProductsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch single product
    fetchProductStart: (state) => {
      state.loading = true;
      state.error = null;
      state.product = null;
    },
    fetchProductSuccess: (state, action: PayloadAction<IProduct>) => {
      state.loading = false;
      state.product = action.payload;
      state.error = null;
    },
    fetchProductFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch related products
    fetchRelatedProductsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchRelatedProductsSuccess: (state, action: PayloadAction<IProduct[]>) => {
      state.loading = false;
      state.relatedProducts = action.payload;
      state.error = null;
    },
    fetchRelatedProductsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Search products
    searchProducts: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    // Update filters
    updateFilters: (state, action: PayloadAction<Partial<IProductFilter>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page when filters change
    },

    // Reset filters
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.searchQuery = '';
      state.pagination.page = 1;
    },

    // Update pagination
    updatePagination: (state, action: PayloadAction<Partial<IPagination>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    // Clear product state
    clearProductState: (state) => {
      state.product = null;
      state.relatedProducts = [];
      state.error = null;
    },

    // Clear products state
    clearProductsState: (state) => {
      state.products = [];
      state.pagination = initialState.pagination;
      state.error = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  fetchFeaturedProductsStart,
  fetchFeaturedProductsSuccess,
  fetchFeaturedProductsFailure,
  fetchProductStart,
  fetchProductSuccess,
  fetchProductFailure,
  fetchRelatedProductsStart,
  fetchRelatedProductsSuccess,
  fetchRelatedProductsFailure,
  searchProducts,
  updateFilters,
  resetFilters,
  updatePagination,
  clearProductState,
  clearProductsState,
  clearError,
} = productSlice.actions;

export default productSlice.reducer;

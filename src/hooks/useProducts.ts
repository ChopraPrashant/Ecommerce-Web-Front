import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { 
  fetchProductsStart, 
  fetchProductsSuccess, 
  fetchProductsFailure,
  fetchProductStart,
  fetchProductSuccess,
  fetchProductFailure,
  fetchFeaturedProductsStart,
  fetchFeaturedProductsSuccess,
  fetchFeaturedProductsFailure,
  fetchRelatedProductsStart,
  fetchRelatedProductsSuccess,
  fetchRelatedProductsFailure,
  searchProducts,
  updateFilters,
  resetFilters,
  updatePagination,
  clearProductState,
  clearProductsState,
} from '../store/slices/productSlice';
import { IProduct, IProductFilter, IProductQueryParams } from '../types/product';
import http from '../utils/api';

/**
 * Hook to handle product operations
 * @returns Product state and methods for product operations
 */
export const useProducts = () => {
  const dispatch = useDispatch();
  const { 
    products, 
    featuredProducts, 
    relatedProducts, 
    product, 
    loading, 
    error, 
    pagination, 
    filters, 
    searchQuery 
  } = useSelector((state: RootState) => ({
    products: state.products.products,
    featuredProducts: state.products.featuredProducts,
    relatedProducts: state.products.relatedProducts,
    product: state.products.product,
    loading: state.products.loading,
    error: state.products.error,
    pagination: state.products.pagination,
    filters: state.products.filters,
    searchQuery: state.products.searchQuery,
  }));

  // Fetch products with filters and pagination
  const fetchProducts = useCallback(async (params: IProductQueryParams = {}) => {
    try {
      dispatch(fetchProductsStart());
      
      // Merge default params with provided params
      const queryParams: IProductQueryParams = {
        page: pagination.page,
        limit: pagination.limit,
        ...params,
      };
      
      // Add filters to query params
      if (filters.categories?.length) {
        queryParams.categories = filters.categories.join(',');
      }
      
      if (filters.priceRange) {
        queryParams.minPrice = filters.priceRange.min;
        queryParams.maxPrice = filters.priceRange.max;
      }
      
      if (filters.ratings?.length) {
        // Use the first rating from the array since the API expects a single number
        queryParams.rating = filters.ratings[0];
      }
      
      if (filters.sortBy) {
        queryParams.sortBy = filters.sortBy;
        queryParams.sortOrder = filters.sortOrder || 'desc';
      }
      
      const response = await http.get<{
        products: IProduct[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>('/products', { params: queryParams });
      
      dispatch(fetchProductsSuccess({
        products: response.products,
        pagination: response.pagination,
      }));
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
      dispatch(fetchProductsFailure(errorMessage));
      throw error;
    }
  }, [dispatch, filters, pagination.page, pagination.limit]);

  // Fetch a single product by ID or slug
  const fetchProduct = useCallback(async (idOrSlug: string) => {
    try {
      dispatch(fetchProductStart());
      const productData = await http.get<IProduct>(`/products/${idOrSlug}`);
      dispatch(fetchProductSuccess(productData));
      return productData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch product';
      dispatch(fetchProductFailure(errorMessage));
      throw error;
    }
  }, [dispatch]);

  // Fetch featured products
  const fetchFeaturedProducts = useCallback(async (limit: number = 8) => {
    try {
      dispatch(fetchFeaturedProductsStart());
      const featured = await http.get<IProduct[]>('/products/featured', {
        params: { limit },
      });
      dispatch(fetchFeaturedProductsSuccess(featured));
      return featured;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch featured products';
      dispatch(fetchFeaturedProductsFailure(errorMessage));
      throw error;
    }
  }, [dispatch]);

  // Fetch related products
  const fetchRelatedProducts = useCallback(async (productId: string, limit: number = 4) => {
    try {
      dispatch(fetchRelatedProductsStart());
      const related = await http.get<IProduct[]>(`/products/${productId}/related`, {
        params: { limit },
      });
      dispatch(fetchRelatedProductsSuccess(related));
      return related;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch related products';
      dispatch(fetchRelatedProductsFailure(errorMessage));
      throw error;
    }
  }, [dispatch]);

  // Search products
  const search = useCallback((query: string) => {
    dispatch(searchProducts(query));
  }, [dispatch]);

  // Update filters
  const updateProductFilters = useCallback((newFilters: Partial<IProductFilter>) => {
    dispatch(updateFilters(newFilters));
  }, [dispatch]);

  // Reset filters
  const resetProductFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  // Update pagination
  const updateProductPagination = useCallback((newPagination: Partial<typeof pagination>) => {
    dispatch(updatePagination(newPagination));
  }, [dispatch]);

  // Clear product state
  const clearCurrentProduct = useCallback(() => {
    dispatch(clearProductState());
  }, [dispatch]);

  // Clear products state
  const clearProducts = useCallback(() => {
    dispatch(clearProductsState());
  }, [dispatch]);

  // Format price with currency
  const formatPrice = useCallback((price: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }, []);

  // Calculate discount percentage
  const calculateDiscount = useCallback((originalPrice: number, salePrice: number): number => {
    if (originalPrice <= 0 || salePrice >= originalPrice) return 0;
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  }, []);

  // Get product rating summary
  const getRatingSummary = useCallback((product: IProduct) => {
    const totalRatings = product.reviews?.length || 0;
    if (totalRatings === 0) return { average: 0, total: 0, distribution: [0, 0, 0, 0, 0] };
    
    const sum = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = sum / totalRatings;
    
    // Calculate rating distribution (5 stars to 1 star)
    const distribution = [5, 4, 3, 2, 1].map(star => {
      const count = product.reviews.filter(r => Math.round(r.rating) === star).length;
      return Math.round((count / totalRatings) * 100);
    });
    
    return {
      average: parseFloat(average.toFixed(1)),
      total: totalRatings,
      distribution,
    };
  }, []);

  // Check if product is in stock
  const isInStock = useCallback((product: IProduct): boolean => {
    if (product.stock > 0) return true;
    if (product.variants?.some(v => v.stock > 0)) return true;
    return false;
  }, []);

  // Get product stock status
  const getStockStatus = useCallback((product: IProduct): { status: 'in-stock' | 'low-stock' | 'out-of-stock', text: string } => {
    const stock = product.stock;
    
    if (stock > 10) {
      return { status: 'in-stock', text: 'In Stock' };
    } else if (stock > 0) {
      return { status: 'low-stock', text: `Only ${stock} left` };
    } else if (product.variants?.some(v => v.stock > 0)) {
      return { status: 'in-stock', text: 'In Stock (Select Variant)' };
    } else {
      return { status: 'out-of-stock', text: 'Out of Stock' };
    }
  }, []);

  return {
    // State
    products,
    featuredProducts,
    relatedProducts,
    product,
    loading,
    error,
    pagination,
    filters,
    searchQuery,
    
    // Actions
    fetchProducts,
    fetchProduct,
    fetchFeaturedProducts,
    fetchRelatedProducts,
    searchProducts: search,
    updateFilters: updateProductFilters,
    resetFilters: resetProductFilters,
    updatePagination: updateProductPagination,
    clearCurrentProduct,
    clearProducts,
    
    // Helpers
    formatPrice,
    calculateDiscount,
    getRatingSummary,
    isInStock,
    getStockStatus,
  };
};

export default useProducts;

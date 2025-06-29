import http from '../utils/api';
import { IProduct } from '../types/product';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const productService = {
  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<IProduct> {
    try {
      const response = await http.get<ApiResponse<IProduct>>(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  /**
   * Get related products
   */
  async getRelatedProducts(productId: string): Promise<IProduct[]> {
    try {
      const response = await http.get<ApiResponse<IProduct[]>>(
        `/products/${productId}/related`
      );
      return response.data || [];
    } catch (error) {
      console.error('Error fetching related products:', error);
      return [];
    }
  },
};

export default productService;

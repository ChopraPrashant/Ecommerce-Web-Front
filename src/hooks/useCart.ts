import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { 
  fetchCartStart, 
  fetchCartSuccess, 
  fetchCartFailure,
  addToCartStart,
  addToCartSuccess,
  addToCartFailure,
  updateCartItemStart,
  updateCartItemSuccess,
  updateCartItemFailure,
  removeFromCartStart,
  removeFromCartSuccess,
  removeFromCartFailure,
  clearCartStart,
  clearCartSuccess,
  clearCartFailure,
  applyCouponStart,
  applyCouponSuccess,
  applyCouponFailure,
  removeCouponStart,
  removeCouponSuccess,
  removeCouponFailure,
} from '../store/slices/cartSlice';
import { ICart, ICartItem, IApplyCouponData } from '../types/cart';
import http from '../utils/api';

/**
 * Hook to handle cart operations
 * @returns Cart state and methods for cart operations
 */
export const useCart = () => {
  const dispatch = useDispatch();
  const { cart, isLoading, error, isUpdating } = useSelector((state: RootState) => ({
    cart: state.cart.cart,
    isLoading: state.cart.isLoading,
    error: state.cart.error,
    isUpdating: state.cart.isUpdating,
  }));

  // Fetch cart from API
  const fetchCart = useCallback(async () => {
    try {
      dispatch(fetchCartStart());
      const cartData = await http.get<ICart>('/cart');
      dispatch(fetchCartSuccess(cartData));
      return cartData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch cart';
      dispatch(fetchCartFailure(errorMessage));
      throw error;
    }
  }, [dispatch]);

  // Add item to cart
  const addToCart = useCallback(async (productId: string, quantity: number = 1, variantId?: string) => {
    try {
      dispatch(addToCartStart());
      const cartData = await http.post<ICart>('/cart/items', { 
        productId, 
        quantity,
        variantId
      });
      dispatch(addToCartSuccess(cartData));
      return cartData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add item to cart';
      dispatch(addToCartFailure(errorMessage));
      throw error;
    }
  }, [dispatch]);

  // Update cart item quantity
  const updateCartItem = useCallback(async (itemId: string, quantity: number) => {
    if (quantity < 1) {
      return removeFromCart(itemId);
    }
    
    try {
      dispatch(updateCartItemStart());
      const cartData = await http.put<ICart>(`/cart/items/${itemId}`, { quantity });
      dispatch(updateCartItemSuccess(cartData));
      return cartData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update cart item';
      dispatch(updateCartItemFailure(errorMessage));
      throw error;
    }
  }, [dispatch]);

  // Remove item from cart
  const removeFromCart = useCallback(async (itemId: string) => {
    try {
      dispatch(removeFromCartStart());
      const cartData = await http.delete<ICart>(`/cart/items/${itemId}`);
      dispatch(removeFromCartSuccess(cartData));
      return cartData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove item from cart';
      dispatch(removeFromCartFailure(errorMessage));
      throw error;
    }
  }, [dispatch]);

  // Clear cart
  const clearCart = useCallback(async () => {
    try {
      dispatch(clearCartStart());
      await http.delete('/cart/clear');
      dispatch(clearCartSuccess());
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clear cart';
      dispatch(clearCartFailure(errorMessage));
      throw error;
    }
  }, [dispatch]);

  // Apply coupon code
  const applyCoupon = useCallback(async (couponCode: string) => {
    try {
      dispatch(applyCouponStart());
      const cartData = await http.post<ICart>('/cart/coupon', { code: couponCode });
      dispatch(applyCouponSuccess(cartData));
      return cartData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to apply coupon';
      dispatch(applyCouponFailure(errorMessage));
      throw error;
    }
  }, [dispatch]);

  // Remove coupon
  const removeCoupon = useCallback(async () => {
    try {
      dispatch(removeCouponStart());
      const cartData = await http.delete<ICart>('/cart/coupon');
      dispatch(removeCouponSuccess(cartData));
      return cartData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove coupon';
      dispatch(removeCouponFailure(errorMessage));
      throw error;
    }
  }, [dispatch]);

  // Get cart item by product ID
  const getCartItem = useCallback((productId: string, variantId?: string): ICartItem | undefined => {
    if (!cart?.items) return undefined;
    
    return cart.items.find(item => 
      item.product === productId && 
      (!variantId || item.variant === variantId)
    );
  }, [cart]);

  // Check if product is in cart
  const isInCart = useCallback((productId: string, variantId?: string): boolean => {
    return Boolean(getCartItem(productId, variantId));
  }, [getCartItem]);

  // Get item quantity in cart
  const getItemQuantity = useCallback((productId: string, variantId?: string): number => {
    const item = getCartItem(productId, variantId);
    return item ? item.quantity : 0;
  }, [getCartItem]);

  // Calculate cart summary
  const getCartSummary = useCallback(() => {
    if (!cart) return null;
    
    return {
      itemsCount: cart.items.reduce((total, item) => total + item.quantity, 0),
      subtotal: cart.totals.subtotal,
      discount: cart.totals.discount,
      shipping: cart.totals.shipping,
      tax: cart.totals.tax,
      total: cart.totals.total,
      currency: cart.totals.currency,
      hasCoupon: !!cart.coupon,
    };
  }, [cart]);

  // Fetch cart on mount if not already loaded
  useEffect(() => {
    if (!cart && !isLoading) {
      fetchCart().catch(console.error);
    }
  }, [cart, fetchCart, isLoading]);

  return {
    cart,
    isLoading,
    isUpdating,
    error,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    getCartItem,
    isInCart,
    getItemQuantity,
    getCartSummary,
  };
};

export default useCart;

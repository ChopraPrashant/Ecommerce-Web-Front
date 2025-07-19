import { CartState } from '../store/store';

const CART_STORAGE_KEY = 'ecommerce_cart';

export const saveCartToStorage = (cart: CartState['cart']) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage', error);
  }
};

export const getCartFromStorage = (): CartState['cart'] | null => {
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    return cartData ? JSON.parse(cartData) : null;
  } catch (error) {
    console.error('Error getting cart from localStorage', error);
    return null;
  }
};

export const clearCartFromStorage = () => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing cart from localStorage', error);
  }
};

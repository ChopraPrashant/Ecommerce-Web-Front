import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICart, ICartItem } from '../../types/cart';

interface CartState {
  cart: ICart | null;
  isLoading: boolean;
  error: string | null;
  isUpdating: boolean;
}

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
  isUpdating: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Fetch cart
    fetchCartStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchCartSuccess: (state, action: PayloadAction<ICart>) => {
      state.isLoading = false;
      state.cart = action.payload;
      state.error = null;
    },
    fetchCartFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    
    // Add to cart
    addToCartStart: (state) => {
      state.isUpdating = true;
      state.error = null;
    },
    addToCartSuccess: (state, action: PayloadAction<ICart>) => {
      state.isUpdating = false;
      state.cart = action.payload;
      state.error = null;
    },
    addToCartFailure: (state, action: PayloadAction<string>) => {
      state.isUpdating = false;
      state.error = action.payload;
    },
    
    // Update cart item
    updateCartItemStart: (state) => {
      state.isUpdating = true;
      state.error = null;
    },
    updateCartItemSuccess: (state, action: PayloadAction<ICart>) => {
      state.isUpdating = false;
      state.cart = action.payload;
      state.error = null;
    },
    updateCartItemFailure: (state, action: PayloadAction<string>) => {
      state.isUpdating = false;
      state.error = action.payload;
    },
    
    // Remove from cart
    removeFromCartStart: (state) => {
      state.isUpdating = true;
      state.error = null;
    },
    removeFromCartSuccess: (state, action: PayloadAction<ICart>) => {
      state.isUpdating = false;
      state.cart = action.payload;
      state.error = null;
    },
    removeFromCartFailure: (state, action: PayloadAction<string>) => {
      state.isUpdating = false;
      state.error = action.payload;
    },
    
    // Clear cart
    clearCartStart: (state) => {
      state.isUpdating = true;
      state.error = null;
    },
    clearCartSuccess: (state) => {
      state.isUpdating = false;
      state.cart = null;
      state.error = null;
    },
    clearCartFailure: (state, action: PayloadAction<string>) => {
      state.isUpdating = false;
      state.error = action.payload;
    },
    
    // Apply coupon
    applyCouponStart: (state) => {
      state.isUpdating = true;
      state.error = null;
    },
    applyCouponSuccess: (state, action: PayloadAction<ICart>) => {
      state.isUpdating = false;
      state.cart = action.payload;
      state.error = null;
    },
    applyCouponFailure: (state, action: PayloadAction<string>) => {
      state.isUpdating = false;
      state.error = action.payload;
    },
    
    // Remove coupon
    removeCouponStart: (state) => {
      state.isUpdating = true;
      state.error = null;
    },
    removeCouponSuccess: (state, action: PayloadAction<ICart>) => {
      state.isUpdating = false;
      state.cart = action.payload;
      state.error = null;
    },
    removeCouponFailure: (state, action: PayloadAction<string>) => {
      state.isUpdating = false;
      state.error = action.payload;
    },
    
    // Clear cart errors
    clearCartErrors: (state) => {
      state.error = null;
    },
  },
});

export const {
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
  clearCartErrors,
} = cartSlice.actions;

export default cartSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, CartState } from '../store';

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
    fetchCartSuccess: (state, action: PayloadAction<CartState['cart']>) => {
      state.cart = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    fetchCartFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    
    // Add to cart
    addToCart: (state, action: PayloadAction<CartItem>) => {
      if (!state.cart) {
        // Initialize cart if it doesn't exist
        state.cart = {
          _id: 'temp-cart-id',
          user: 'current-user-id',
          items: [action.payload],
          totals: {
            subtotal: action.payload.price * action.payload.quantity,
            discount: 0,
            shipping: 0,
            tax: 0,
            total: action.payload.price * action.payload.quantity,
            currency: 'INR',
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return;
      }
      
      const existingItem = state.cart.items.find(
        item => item._id === action.payload._id
      );
      
      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1;
      } else {
        state.cart.items.push({
          ...action.payload,
          quantity: action.payload.quantity || 1,
        });
      }
      
      // Update totals (simplified)
      state.cart.totals.subtotal = state.cart.items.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      );
      state.cart.totals.total = state.cart.totals.subtotal;
    },
    
    // Update quantity
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      if (!state.cart) return;
      
      const item = state.cart.items.find(item => item._id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        
        // Update totals
        if (state.cart) {
          state.cart.totals.subtotal = state.cart.items.reduce(
            (sum, item) => sum + (item.price * item.quantity),
            0
          );
          state.cart.totals.total = state.cart.totals.subtotal;
          state.cart.updatedAt = new Date().toISOString();
        }
      }
    },
    
    // Remove from cart
    removeFromCart: (state, action: PayloadAction<string>) => {
      if (!state.cart) return;
      
      state.cart.items = state.cart.items.filter(item => item._id !== action.payload);
      
      // Update totals
      if (state.cart) {
        state.cart.totals.subtotal = state.cart.items.reduce(
          (sum, item) => sum + (item.price * item.quantity),
          0
        );
        state.cart.totals.total = state.cart.totals.subtotal;
        state.cart.updatedAt = new Date().toISOString();
      }
    },
    
    // Clear cart
    clearCart: (state) => {
      if (state.cart) {
        state.cart.items = [];
        state.cart.totals = {
          subtotal: 0,
          discount: 0,
          shipping: 0,
          tax: 0,
          total: 0,
          currency: 'INR',
        };
      }
    },
    
    // Set loading state
    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Set error
    setCartError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  fetchCartStart,
  fetchCartSuccess,
  fetchCartFailure,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  setCartLoading,
  setCartError,
} = cartSlice.actions;

export default cartSlice.reducer;

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
        // Check stock before initializing cart
        if (action.payload.stock <= 0) {
          // You might want to handle this error in the UI
          console.warn('Cannot add out of stock item to cart');
          return;
        }
        
        // Initialize cart if it doesn't exist
        state.cart = {
          _id: 'temp-cart-id',
          user: 'current-user-id',
          items: [{
            ...action.payload,
            quantity: 1, // Always set to 1 for new items
          }],
          totals: {
            subtotal: action.payload.price * 1, // Quantity is 1 for new items
            discount: 0,
            shipping: 0,
            tax: 0,
            total: action.payload.price * 1, // Quantity is 1 for new items
            currency: 'INR',
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return;
      }

      // Check if item already exists in cart (by product ID)
      const existingItemIndex = state.cart.items.findIndex(
        (item) => item.product === action.payload.product
      );

      if (existingItemIndex >= 0) {
        // Check if we can add more of this item (don't exceed stock)
        const existingItem = state.cart.items[existingItemIndex];
        if (existingItem.quantity >= action.payload.stock) {
          // You might want to show a toast/notification here
          console.warn('Cannot add more items: stock limit reached');
          return;
        }
        // Increase quantity by 1 if item exists and stock allows
        state.cart.items[existingItemIndex].quantity += 1;
      } else {
        // Add new item with quantity 1 (already checked stock in the component)
        state.cart.items.push({
          ...action.payload,
          quantity: 1, // Ensure new items start with quantity 1
        });
      }

      // Update totals
      const subtotal = state.cart.items.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      );

      state.cart.totals = {
        ...state.cart.totals,
        subtotal,
        total: subtotal - (state.cart.totals?.discount || 0) + (state.cart.totals?.shipping || 0) + (state.cart.totals?.tax || 0),
      };

      state.cart.updatedAt = new Date().toISOString();
    },
    
    // Update quantity
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      if (!state.cart) return;
      
      const { id, quantity } = action.payload;
      const item = state.cart.items.find(item => item._id === id);
      
      if (item) {
        // Don't allow quantity to exceed stock
        if (quantity > item.stock) {
          console.warn('Cannot set quantity higher than available stock');
          return;
        }
        
        // Don't allow quantity less than 1 (use remove instead)
        if (quantity < 1) {
          console.warn('Quantity must be at least 1');
          return;
        }
        
        item.quantity = quantity;
        
        // Update totals
        const subtotal = state.cart.items.reduce(
          (sum, item) => sum + (item.price * item.quantity),
          0
        );
        
        state.cart.totals = {
          ...state.cart.totals,
          subtotal,
          total: subtotal - (state.cart.totals?.discount || 0) + (state.cart.totals?.shipping || 0) + (state.cart.totals?.tax || 0),
        };
        state.cart.updatedAt = new Date().toISOString();
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

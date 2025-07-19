import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, CartState } from '../store';
import { saveCartToStorage, getCartFromStorage, clearCartFromStorage } from '../../utils/cartStorage';

// Load cart from localStorage on initial state
const savedCart = getCartFromStorage();

const initialState: CartState = {
  cart: savedCart,
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
      // Save to localStorage whenever cart is updated
      if (action.payload) {
        saveCartToStorage(action.payload);
      } else {
        clearCartFromStorage();
      }
    },
    fetchCartFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    
    // Add to cart
    addToCart: (state, action: PayloadAction<CartItem>) => {
      // Ensure we have a valid product with stock
      if (!action.payload || action.payload.stock <= 0) {
        console.warn('Cannot add invalid or out of stock item to cart');
        return;
      }
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

      // Recalculate totals
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
      
      // Save to localStorage
      saveCartToStorage(state.cart);
      saveCartToStorage(state.cart);
    },
    
    // Update quantity
    updateQuantity: (state: CartState, action: PayloadAction<{ id: string; quantity: number }>) => {
      if (!state.cart) return;
      
      const { id, quantity } = action.payload;
      const item = state.cart.items.find(item => item._id === id);
      
      if (item) {
        // Ensure quantity doesn't exceed available stock
        const newQuantity = Math.min(quantity, item.stock);
        item.quantity = newQuantity > 0 ? newQuantity : 1; // Don't allow 0 or negative quantities
      }
      
      // Update totals
      const subtotal = state.cart.items.reduce(
        (sum: number, item: CartItem) => sum + (item.price * item.quantity),
        0
      );
      
      state.cart.totals = {
        ...state.cart.totals,
        subtotal,
        total: subtotal - (state.cart.totals?.discount || 0) + (state.cart.totals?.shipping || 0) + (state.cart.totals?.tax || 0),
      };
      state.cart.updatedAt = new Date().toISOString();
      
      // Save to localStorage
      saveCartToStorage(state.cart);
    },
    
    // Remove from cart
    removeFromCart: (state: CartState, action: PayloadAction<string>) => {
      if (!state.cart) return;
      
      state.cart.items = state.cart.items.filter((item: CartItem) => item._id !== action.payload);
      
      // Update totals
      const subtotal = state.cart.items.reduce(
        (sum: number, item: CartItem) => sum + (item.price * item.quantity),
        0
      );

      state.cart.totals = {
        ...state.cart.totals,
        subtotal,
        total: subtotal - (state.cart.totals?.discount || 0) + (state.cart.totals?.shipping || 0) + (state.cart.totals?.tax || 0),
      };

      state.cart.updatedAt = new Date().toISOString();
      
      // Save to localStorage
      if (state.cart.items.length === 0) {
        state.cart = null;
        clearCartFromStorage();
      } else {
        saveCartToStorage(state.cart);
      }
    },
    
    // Clear cart
    clearCart: (state: CartState) => {
      state.cart = null;
      state.isLoading = false;
      state.error = null;
      state.isUpdating = false;
      // Clear from localStorage
      clearCartFromStorage();
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

import React, { useEffect } from 'react';
import { Box, Typography, Button, Container, Paper, IconButton, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Remove, Add, Delete } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { 
  removeFromCart, 
  updateQuantity, 
  clearCart,
  fetchCartStart,
  fetchCartSuccess,
  fetchCartFailure,
  setCartLoading,
  setCartError
} from '../store/slices/simpleCartSlice';
import { CartItem } from '../store/store';

type SimpleCartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

const CartPage: React.FC = () => {
  const { cart, isLoading, error } = useAppSelector((state) => ({
    cart: state.cart.cart,
    isLoading: state.cart.isLoading,
    error: state.cart.error
  }));
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Fetch cart on component mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        dispatch(fetchCartStart());
        // Here you would typically fetch the cart from your API
        // For now, we'll simulate a successful fetch with the current state or initialize a new cart
        if (!cart) {
          const initialCart = {
            _id: 'temp-cart-id',
            user: 'current-user-id',
            items: [],
            totals: {
              subtotal: 0,
              discount: 0,
              shipping: 0,
              tax: 0,
              total: 0,
              currency: 'INR'
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          dispatch(fetchCartSuccess(initialCart));
        } else {
          dispatch(fetchCartSuccess(cart));
        }
      } catch (err) {
        dispatch(fetchCartFailure(err instanceof Error ? err.message : 'Failed to fetch cart'));
      }
    };

    fetchCart();
  }, [dispatch]);

  const handleQuantityChange = (id: string, newQuantity: number): void => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemove = (id: string): void => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = (): void => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8, textAlign: 'center' }}>
        <Typography variant="h6">Loading your cart...</Typography>
      </Container>
    );
  }


  // Show error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8, textAlign: 'center' }}>
        <Typography color="error" gutterBottom>Error loading cart</Typography>
        <Typography variant="body2" color="text.secondary">{error}</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  // Show empty cart state
  if (!cart || cart.items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>Your cart is empty</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Looks like you haven't added any items to your cart yet.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  const { items, totals } = cart;
  const { subtotal, discount, shipping, tax, total } = totals;



  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>
      
      <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Your Cart ({items.length} items)</Typography>
          <Button 
            variant="outlined" 
            color="error" 
            size="small"
            onClick={handleClearCart}
          >
            Clear Cart
          </Button>
        </Box>
        {items.map((item) => (
          <React.Fragment key={item._id}>
            <Box sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
              <Box sx={{ width: 100, height: 100, mr: 3, flexShrink: 0 }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 1 }}
                />
              </Box>
              
              <Box sx={{ flexGrow: 1 }}>
                <Box>
                  <Typography variant="subtitle1" component="div">
                    {item.name}
                  </Typography>
                  {item.sku && (
                    <Typography variant="body2" color="text.secondary">
                      SKU: {item.sku}
                    </Typography>
                  )}
                  {item.stock && (
                    <Typography variant="body2" color={item.stock > 0 ? 'success.main' : 'error'}>
                      {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                    </Typography>
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                  }).format(item.price)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mx: 3 }}>
                <IconButton 
                  onClick={() => handleQuantityChange(item._id, (item.quantity || 0) - 1)}
                  size="small"
                  disabled={item.quantity <= 1}
                >
                  <Remove fontSize="small" />
                </IconButton>
                <Typography sx={{ mx: 1.5, minWidth: 20, textAlign: 'center' }}>
                  {item.quantity}
                </Typography>
                <IconButton 
                  onClick={() => handleQuantityChange(item._id, (item.quantity || 0) + 1)}
                  size="small"
                >
                  <Add fontSize="small" />
                </IconButton>
              </Box>
              
              <Typography variant="subtitle1" sx={{ minWidth: 100, textAlign: 'right' }}>
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                }).format((item.price || 0) * (item.quantity || 0))}
              </Typography>
              
              <IconButton 
                onClick={() => handleRemove(item._id)}
                color="error"
                sx={{ ml: 2 }}
              >
                <Delete />
              </IconButton>
            </Box>
            <Divider sx={{ my: 1 }} />
          </React.Fragment>
        ))}
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            component={RouterLink}
            to="/products"
            variant="outlined"
            sx={{ textTransform: 'none' }}
          >
            Continue Shopping
          </Button>
          
          <Box sx={{ textAlign: 'right' }}>
            <Box sx={{ mb: 2, textAlign: 'left', display: 'inline-block' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', minWidth: 200, mb: 1 }}>
                <Typography variant="body1">Subtotal:</Typography>
                <Typography>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(subtotal || 0)}</Typography>
              </Box>
              {discount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'success.main' }}>
                  <Typography variant="body1">Discount:</Typography>
                  <Typography>-{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(discount || 0)}</Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1">Shipping:</Typography>
                <Typography>
                  {shipping === 0 
                    ? 'Free' 
                    : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(shipping || 0)
                  }
                </Typography>
              </Box>
              {tax > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1">Tax:</Typography>
                  <Typography>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(tax || 0)}</Typography>
                </Box>
              )}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <Typography variant="subtitle1">Total:</Typography>
                <Typography variant="subtitle1">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(total || 0)}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
              {shipping === 0 ? 'Free shipping on all orders' : 'Shipping calculated at checkout'}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={() => {}}
            >
              Proceed to Checkout
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CartPage;

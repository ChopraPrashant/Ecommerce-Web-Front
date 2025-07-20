import React, { useEffect } from 'react';
import { Box, Typography, Button, Container, Paper, IconButton, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Remove, 
  Add, 
  Delete, 
  CheckCircleOutline, 
  LocalOfferOutlined, 
  ArrowForwardIos,
  ShoppingCartOutlined 
} from '@mui/icons-material';
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
      <Container maxWidth="md" sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '60vh',
        textAlign: 'center',
        py: 8
      }}>
        <Box sx={{ maxWidth: 400, mx: 'auto' }}>
          <ShoppingCartOutlined 
            sx={{ 
              fontSize: 80, 
              color: 'text.disabled',
              mb: 2
            }} 
          />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
            Looks like you haven't added any items to your cart yet. Start shopping to add products to your cart.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/products')}
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  const { items, totals } = cart;
  const { subtotal, discount, shipping, tax, total } = totals;



  return (
    <Container maxWidth="lg" sx={{ pt: 0, pb: 4, mt: -5 }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          fontWeight: 700,
          color: 'text.primary',
          mb: 1,
          mt: 0,
          position: 'relative',
          '&:after': {
            content: '""',
            display: 'block',
            width: '80px',
            height: '3px',
            background: 'linear-gradient(90deg, #1976d2, #64b5f6)',
            borderRadius: '2px',
            mt: 0.5
          }
        }}
      >
        Shopping Cart
      </Typography>
      
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 2, md: 4 }, 
          mb: 4, 
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
            Your Cart <Typography component="span" color="text.secondary">({items.length} {items.length === 1 ? 'item' : 'items'})</Typography>
          </Typography>
          <Button 
            variant="outlined" 
            color="error" 
            size="medium"
            onClick={handleClearCart}
            startIcon={<Delete fontSize="small" />}
            sx={{
              textTransform: 'none',
              borderRadius: 1.5,
              px: 2,
              py: 0.8,
              fontWeight: 500,
              borderWidth: '1.5px',
              '&:hover': {
                borderWidth: '1.5px'
              }
            }}
          >
            Clear Cart
          </Button>
        </Box>
        {items.map((item) => (
          <React.Fragment key={item._id}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: { xs: 'flex-start', sm: 'center' }, 
              py: 3,
              position: 'relative',
              transition: 'background-color 0.2s ease',
              '&:hover': {
                backgroundColor: 'action.hover',
                borderRadius: 1
              }
            }}>
              <Box sx={{ 
                width: { xs: 80, sm: 100 }, 
                height: { xs: 80, sm: 100 }, 
                mr: { xs: 2, sm: 3 }, 
                flexShrink: 0,
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 1.5,
                bgcolor: 'background.default',
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img
                  src={item.image || '/placeholder-product.png'}
                  alt={item.name}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain',
                    padding: 8
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-product.png';
                  }}
                />
              </Box>
              
              <Box sx={{ 
                flexGrow: 1,
                minWidth: 0, // Prevents overflow
                pr: { xs: 1, sm: 2 }
              }}>
                <Box>
                  <Typography 
                    variant="subtitle1" 
                    component="div"
                    sx={{
                      fontWeight: 500,
                      mb: 0.5,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {item.name}
                  </Typography>
                  {item.sku && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontSize: '0.8rem' }}
                    >
                      SKU: {item.sku}
                    </Typography>
                  )}
                  {item.stock !== undefined && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'inline-block',
                        mt: 0.5,
                        px: 1,
                        py: 0.3,
                        borderRadius: 0.5,
                        bgcolor: item.stock > 0 ? 'success.light' : 'error.light',
                        color: item.stock > 0 ? 'success.dark' : 'error.dark',
                        fontWeight: 500,
                        fontSize: '0.7rem'
                      }}
                    >
                      {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                    </Typography>
                  )}
                </Box>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mt: 1,
                    fontWeight: 600,
                    color: 'primary.main',
                    fontSize: '1.1rem'
                  }}
                >
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(item.price)}
                </Typography>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mx: { xs: 1, sm: 3 },
                bgcolor: 'action.hover',
                borderRadius: 1.5,
                px: 1,
                py: 0.5
              }}>
                <IconButton 
                  onClick={() => handleQuantityChange(item._id, (item.quantity || 0) - 1)}
                  size="small"
                  disabled={item.quantity <= 1}
                  sx={{
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.05)'
                    }
                  }}
                >
                  <Remove fontSize="small" />
                </IconButton>
                <Typography 
                  sx={{ 
                    mx: 1.5, 
                    minWidth: 24, 
                    textAlign: 'center',
                    fontWeight: 500,
                    fontSize: '0.95rem'
                  }}
                >
                  {item.quantity}
                </Typography>
                <IconButton 
                  onClick={() => handleQuantityChange(item._id, (item.quantity || 0) + 1)}
                  size="small"
                  sx={{
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.05)'
                    }
                  }}
                >
                  <Add fontSize="small" />
                </IconButton>
              </Box>
              
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                minWidth: { xs: 'auto', sm: 120 },
                pl: { xs: 0, sm: 2 },
                mr: { xs: 0, sm: 1 }
              }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 700,
                    color: 'text.primary',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format((item.price || 0) * (item.quantity || 0))}
                </Typography>
                {item.quantity > 1 && (
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{
                      display: 'block',
                      fontSize: '0.7rem',
                      textAlign: 'right',
                      mt: 0.5
                    }}
                  >
                    {item.quantity} × {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(item.price)}
                  </Typography>
                )}
              </Box>
              
              <IconButton 
                onClick={() => handleRemove(item._id)}
                color="error"
                size="small"
                sx={{
                  ml: { xs: 1, sm: 2 },
                  '&:hover': {
                    backgroundColor: 'error.light',
                    color: 'error.dark'
                  }
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
            <Divider sx={{ 
              my: 0,
              opacity: 0.7,
              borderColor: 'divider'
            }} />
          </React.Fragment>
        ))}
        
        <Box sx={{ 
          mt: 5, 
          display: 'flex', 
          flexDirection: { xs: 'column-reverse', md: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', md: 'center' },
          gap: 3
        }}>
          <Button
            component={RouterLink}
            to="/products"
            variant="outlined"
            size="large"
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontWeight: 500,
              borderWidth: '1.5px',
              '&:hover': {
                borderWidth: '1.5px',
                backgroundColor: 'action.hover'
              },
              alignSelf: { xs: 'stretch', sm: 'flex-start' },
              maxWidth: { xs: '100%', sm: 240 }
            }}
          >
            ← Continue Shopping
          </Button>
          
          <Box sx={{ 
            textAlign: 'right',
            width: { xs: '100%', md: 'auto' },
            maxWidth: 400,
            ml: 'auto'
          }}>
            <Paper 
              elevation={0}
              sx={{
                p: 3,
                bgcolor: 'background.default',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                textAlign: 'left',
                width: '100%',
                mb: 2
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2, 
                  pb: 1,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  fontWeight: 600
                }}
              >
                Order Summary
              </Typography>
              
              <Box sx={{ '& > *:not(:last-child)': { mb: 1.5 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Typography variant="body1" color="text.secondary">Subtotal:</Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {new Intl.NumberFormat('en-IN', { 
                      style: 'currency', 
                      currency: 'INR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(subtotal || 0)}
                  </Typography>
                </Box>
                
                {discount > 0 && (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: 'success.main'
                  }}>
                    <Typography variant="body1" color="success.main">Discount:</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      -{new Intl.NumberFormat('en-IN', { 
                        style: 'currency', 
                        currency: 'INR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(discount || 0)}
                    </Typography>
                  </Box>
                )}
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Typography variant="body1" color="text.secondary">Shipping:</Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {shipping === 0 
                      ? 'Free' 
                      : new Intl.NumberFormat('en-IN', { 
                          style: 'currency', 
                          currency: 'INR',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        }).format(shipping || 0)
                    }
                  </Typography>
                </Box>
                
                {tax > 0 && (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Typography variant="body1" color="text.secondary">Tax:</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {new Intl.NumberFormat('en-IN', { 
                        style: 'currency', 
                        currency: 'INR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(tax || 0)}
                    </Typography>
                  </Box>
                )}
                
                <Divider sx={{ my: 2, borderColor: 'divider' }} />
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 2
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Total:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {new Intl.NumberFormat('en-IN', { 
                      style: 'currency', 
                      currency: 'INR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(total || 0)}
                  </Typography>
                </Box>
              </Box>
            </Paper>
            
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 2, 
                fontStyle: 'italic',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                color: 'success.main',
                fontWeight: 500,
                mt: 2
              }}
            >
              <CheckCircleOutline fontSize="small" />
              {shipping === 0 ? 'Free shipping on all orders' : 'Shipping calculated at checkout'}
            </Typography>
            
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={() => {}}
              sx={{ 
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: '0 4px 14px rgba(25, 118, 210, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Proceed to Checkout
            </Button>
            
            <Paper 
              elevation={0}
              sx={{
                mt: 3,
                p: { xs: 2, sm: 3 },
                bgcolor: 'primary.light',
                background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.1) 100%)',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'primary.light',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(25, 118, 210, 0.15)'
                }
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <LocalOfferOutlined 
                  sx={{ 
                    fontSize: 32, 
                    color: 'primary.main',
                    mb: 1
                  }} 
                />
                <Typography 
                  variant="h6"
                  color="primary"
                  sx={{ 
                    fontWeight: 700,
                    mb: 1,
                    fontSize: '1.1rem'
                  }}
                >
                  Looking for a Better Deal?
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  component={RouterLink}
                  to="/contact"
                  endIcon={<ArrowForwardIos fontSize="small" />}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 2,
                    py: 0.8,
                    fontWeight: 500,
                    borderWidth: '1.5px',
                    '&:hover': {
                      borderWidth: '1.5px',
                      backgroundColor: 'rgba(25, 118, 210, 0.1)'
                    }
                  }}
                >
                  Contact Us for Exclusive Discounts
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CartPage;

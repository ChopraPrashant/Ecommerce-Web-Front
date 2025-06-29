import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import productService from '../services/productService';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Divider, 
  IconButton, 
  Chip, 
  Rating, 
  TextField, 
  Skeleton, 
  Breadcrumbs, 
  Snackbar, 
  Alert, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Home as HomeIcon,
  ChevronRight as ChevronRightIcon,
  LocalShipping as LocalShippingIcon,
  Undo as UndoIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
// TODO: Uncomment and implement these imports when the slices are available
// import { addToCart } from '../store/slices/cartSlice';
// import { toggleWishlist } from '../store/slices/wishlistSlice';
import { IProduct } from '../types/product';
import { RootState } from '../store/store';
import { formatCurrency } from '../utils/helpers';

// Default product data structure
const defaultProduct: IProduct = {
  _id: '',
  name: '',
  slug: '',
  description: '',
  price: 0,
  originalPrice: 0,
  stock: 0,
  sku: '',
  images: [],
  categories: [],
  variants: [],
  attributes: [],
  reviews: [],
  rating: 0,
  reviewCount: 0,
  isFeatured: false,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const ProductDetailsPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State
  const [product, setProduct] = useState<IProduct>(defaultProduct);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  
  // Mock cart and wishlist state - replace with actual Redux state when available
  const [cartItems] = useState<Array<{ product: string }>>([]);
  const [wishlistItems] = useState<string[]>([]);
  
  // Check if product is in cart or wishlist
  const isInCart = cartItems.some((item) => item.product === product?._id);
  const isInWishlist = wishlistItems.includes(product?._id || '');

  // Fetch product data
  const fetchProduct = useCallback(async () => {
    if (!productId) return;
    
    try {
      setLoading(true);
      setError(null);
      const productData = await productService.getProductById(productId);
      setProduct(productData);
    } catch (err: any) {
      console.error('Error fetching product:', err);
      setError(err.message || 'Failed to load product details');
      showSnackbar('Failed to load product details', 'error');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);
  
  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > (product?.stock || 1)) return;
    setQuantity(newQuantity);
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    // TODO: Uncomment and implement when cart slice is available
    // dispatch(
    //   addToCart({
    //     product: product._id,
    //     name: product.name,
    //     price: product.price,
    //     image: product.images[0]?.url,
    //     quantity,
    //     stock: product.stock,
    //   })
    // );
    
    showSnackbar('Product added to cart', 'success');
  };
  
  // Handle buy now
  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };
  
  // Handle toggle wishlist
  const handleToggleWishlist = () => {
    if (!product) return;
    // TODO: Uncomment and implement when wishlist slice is available
    // dispatch(toggleWishlist(product._id));
    showSnackbar(
      isInWishlist ? 'Removed from wishlist' : 'Added to wishlist',
      'success'
    );
  };
  
  // Handle share
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.name,
          text: `Check out ${product?.name} on our store`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setSnackbarMessage('Link copied to clipboard');
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };
  
  // Show snackbar with message and severity
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  
  // Calculate discount percentage
  const discountPercentage = product?.originalPrice && product.originalPrice > 0
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Render loading state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={fetchProduct}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
          <Skeleton variant="rectangular" width="100%" height={400} />
          <Box>
            <Skeleton variant="text" width="80%" height={40} />
            <Skeleton variant="text" width="60%" height={24} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="40%" height={32} sx={{ mb: 3 }} />
            <Skeleton variant="rectangular" width={200} height={48} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="100%" height={100} />
          </Box>
        </Box>
      </Container>
    );
  }
  
  if (!product._id) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          Product not found
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/products')}
          sx={{ mt: 2 }}
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.paper' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs separator={<ChevronRightIcon fontSize="small" />} sx={{ mb: 3 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <HomeIcon fontSize="small" sx={{ mr: 0.5 }} />
            Home
          </Link>
          {product.categories?.[0] && (
            <Link to={`/category/${product.categories[0].slug}`}>
              {product.categories[0].name}
            </Link>
          )}
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>
        
        {/* Product Details */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
          <Box>
            <Box 
              component="img"
              src={product.images[0]?.url || 'https://via.placeholder.com/800x800?text=No+Image'}
              alt={product.name}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '600px',
                objectFit: 'contain',
                borderRadius: 1,
              }}
            />
            
            {/* Product Tags */}
            <Box display="flex" gap={1} mt={2}>
              {discountPercentage > 0 && (
                <Chip 
                  label={`${discountPercentage}% OFF`} 
                  color="error" 
                  size="small" 
                  sx={{ fontWeight: 'bold' }}
                />
              )}
              {product.stock <= 0 && (
                <Chip 
                  label="Out of Stock" 
                  color="error" 
                  variant="outlined"
                  size="small"
                />
              )}
            </Box>
          </Box>
          
          {/* Product Info */}
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>
            
            <Box display="flex" alignItems="center" mb={2}>
              <Rating 
                value={product.rating} 
                precision={0.5} 
                readOnly 
                size="small"
                sx={{ mr: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                ({product.reviewCount} reviews)
              </Typography>
            </Box>
            
            <Box display="flex" alignItems="center" gap={2} my={2}>
              <Typography variant="h4" color="primary">
                {formatCurrency(product.price)}
              </Typography>
              {product.originalPrice && product.originalPrice > product.price && (
                <Typography variant="body1" sx={{ textDecoration: 'line-through', color: 'text.disabled' }}>
                  {formatCurrency(product.originalPrice)}
                </Typography>
              )}
            </Box>
            
            <Typography variant="body1" paragraph sx={{ my: 3 }}>
              {product.description}
            </Typography>
            
            {/* Quantity Selector */}
            <Box display="flex" alignItems="center" mb={3}>
              <Typography variant="subtitle1" sx={{ mr: 2 }}>
                Quantity:
              </Typography>
              <Box display="flex" alignItems="center">
                <IconButton 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  size="small"
                >
                  <RemoveIcon />
                </IconButton>
                <TextField
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  type="number"
                  inputProps={{
                    min: 1,
                    max: product.stock,
                    style: { textAlign: 'center' },
                  }}
                  sx={{ 
                    width: 80,
                    '& .MuiOutlinedInput-input': { 
                      padding: '8px',
                    },
                  }}
                  size="small"
                />
                <IconButton 
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= (product.stock || 0)}
                  size="small"
                >
                  <AddIcon />
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                {product.stock} available
              </Typography>
            </Box>
            
            {/* Action Buttons */}
            <Box display="flex" gap={2} flexWrap="wrap" mb={4}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                sx={{ flex: 1, minWidth: 200 }}
              >
                {isInCart ? 'Added to Cart' : 'Add to Cart'}
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={isInWishlist ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                onClick={handleToggleWishlist}
                sx={{ flex: 1, minWidth: 200 }}
              >
                {isInWishlist ? 'Wishlisted' : 'Wishlist'}
              </Button>
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              sx={{ mb: 3 }}
            >
              Buy Now
            </Button>
            
            <Box display="flex" justifyContent="center" gap={2} mb={4}>
              <IconButton onClick={handleShare} title="Share">
                <ShareIcon />
              </IconButton>
            </Box>
            
            {/* Shipping Info */}
            <Box p={2} bgcolor="background.default" borderRadius={1}>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <LocalShippingIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Free Shipping" 
                    secondary="Free delivery on all orders over $50" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <UndoIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Easy Returns" 
                    secondary="30-day return policy" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LockIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Secure Checkout" 
                    secondary="Your payment information is processed securely" 
                  />
                </ListItem>
              </List>
            </Box>
          </Box>
        </Box>
        
        {/* Product Tabs */}
        <Divider sx={{ my: 4 }} />
        
        {/* Product Specifications */}
        {product.attributes && product.attributes.length > 0 && (
          <Box mb={6}>
            <Typography variant="h5" gutterBottom>
              Specifications
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              {product.attributes.map((attr, index) => (
                <Box key={index} sx={{ width: { xs: '100%', sm: '50%' }, p: 1 }}>
                  <Box display="flex">
                    <Typography variant="subtitle2" sx={{ minWidth: 150, fontWeight: 'bold' }}>
                      {attr.name}:
                    </Typography>
                    <Typography variant="body2">
                      {Array.isArray(attr.values) ? attr.values.join(', ') : ''}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
        
        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default ProductDetailsPage;

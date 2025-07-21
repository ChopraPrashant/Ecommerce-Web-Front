import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { addToCart } from '../store/slices/simpleCartSlice';
import {
  Box,
  Container,
  Typography,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Pagination,
} from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import {
  ViewList as ViewListIcon,
  GridView as GridViewIcon,
} from '@mui/icons-material';
import ProductList from '../components/products/ProductList';
import { IProduct } from '../types/product';
import { products as mockProducts } from '../data/products';

type SortOption = 'featured' | 'latest' | 'price-low' | 'price-high' | 'name-asc' | 'name-desc' | 'top-rated';

interface Filters {
  page: number;
  limit: number;
  sortBy: SortOption;
}

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filter state
  const [filters, setFilters] = useState<Filters>({
    page: 1,
    limit: 12,
    sortBy: 'featured',
  });

  // Get category from URL
  const category = searchParams.get('category');
  
  // Update filters when category changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      page: 1 // Reset to first page when category changes
    }));
  }, [category]);

  // Get products with sorting and pagination
  const { paginatedProducts, total } = useMemo(() => {
    // Create a copy of products to avoid mutating the original array
    let filteredProducts = [...mockProducts];

    // Apply category filter if a category is selected
    if (category) {
      filteredProducts = filteredProducts.filter(product => 
        product.categories?.some(cat => {
          // Handle both string and object category types
          const categorySlug = typeof cat === 'string' ? cat : cat.slug;
          return categorySlug === category;
        })
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'latest':
        filteredProducts.sort((a, b) => 
          new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime()
        );
        break;
      case 'price-low':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'top-rated':
        filteredProducts.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      // 'featured' is the default case - no sorting needed
      default:
        break;
    }

    // Apply pagination
    const start = (filters.page - 1) * filters.limit;
    const end = start + filters.limit;
    const paginated = filteredProducts.slice(start, end);
    
    return {
      paginatedProducts: paginated,
      total: filteredProducts.length,
    };
  }, [filters.page, filters.limit, filters.sortBy, category]);

  // Create a ref for the main container
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle page change
  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, newPage: number) => {
    if (filters.page === newPage) return;
    
    // Update URL
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('page', newPage.toString());
    
    // Navigate with replace to avoid history buildup
    navigate(`?${newSearchParams.toString()}`, { 
      replace: true
    });
    
    // Update filters
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  }, [filters.page, navigate, searchParams]);

  // Handle sort change
  const handleSortChange = useCallback((value: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: value as SortOption,
      page: 1
    }));
  }, []);

  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.cart);
  
  // Handle add to cart
  const handleAddToCart = (product: IProduct) => {
    // Check if product is in stock
    if (product.stock <= 0) {
      // You might want to show a toast/notification here
      console.warn('Product is out of stock');
      return;
    }

    const cartItem = {
      _id: product._id, // Use product ID as the cart item ID to prevent duplicates
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      stock: product.stock || 0,
      sku: product.sku || `SKU-${product._id}`,
      image: product.images?.[0]?.url || '',
    };
    
    dispatch(addToCart(cartItem));
  };
  
  // Check if product is in cart
  const isInCart = (productId: string) => {
    return cart?.items?.some(item => item.product === productId) || false;
  };

  // Handle add to wishlist
  const handleAddToWishlist = (productId: string) => {
    console.log('Add to wishlist:', productId);
  };

  return (
    <Container maxWidth="xl" sx={{ pt: 0, pb: 0, mt: -5 }}>
      <Box>
        {/* Page Header */}
        <Box mb={4}>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{
              fontWeight: 500,
              fontFamily: '"EB Garamond", serif',
              letterSpacing: '0.5px',
              color: 'text.primary',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
              mb: 1
            }}
          >
            Our Products
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0 }}>
            Discover Our Amazing Collection of Products
          </Typography>
        </Box>

        {/* View Toggle, Categories, and Sort */}
        <Box mb={3} display="flex" flexWrap="wrap" gap={2} alignItems="center" width="100%" position="relative">
          <Box display="flex" alignItems="center" position="absolute" left={0}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newViewMode) => newViewMode && setViewMode(newViewMode)}
              aria-label="view mode"
              size="small"
            >
              <ToggleButton value="grid" aria-label="grid view">
                <GridViewIcon />
              </ToggleButton>
              <ToggleButton value="list" aria-label="list view">
                <ViewListIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Box display="flex" gap={1} sx={{ my: { xs: 1, sm: 0 } }}>
            <Button 
              variant={category === 'water-pumps' ? 'contained' : 'outlined'} 
              size="small"
              onClick={() => navigate('/products?category=water-pumps')}
              sx={{ 
                textTransform: 'none',
                '&.MuiButton-contained': {
                  bgcolor: '#42a5f5',
                  '&:hover': {
                    bgcolor: '#1e88e5',
                  },
                },
                '&.MuiButton-outlined': {
                  color: '#1976d2',
                  borderColor: '#90caf9',
                  '&:hover': {
                    borderColor: '#42a5f5',
                    bgcolor: 'rgba(66, 165, 245, 0.04)'
                  },
                }
              }}
            >
              Pumps
            </Button>
            <Button 
              variant={category === 'induction-motors' ? 'contained' : 'outlined'} 
              size="small"
              onClick={() => navigate('/products?category=induction-motors')}
              sx={{ 
                textTransform: 'none',
                '&.MuiButton-contained': {
                  bgcolor: '#42a5f5',
                  '&:hover': {
                    bgcolor: '#1e88e5',
                  },
                },
                '&.MuiButton-outlined': {
                  color: '#1976d2',
                  borderColor: '#90caf9',
                  '&:hover': {
                    borderColor: '#42a5f5',
                    bgcolor: 'rgba(66, 165, 245, 0.04)'
                  },
                }
              }}
            >
              Motors
            </Button>
            <Button 
              variant={category === 'cables' ? 'contained' : 'outlined'} 
              size="small"
              onClick={() => navigate('/products?category=cables')}
              sx={{ 
                textTransform: 'none',
                '&.MuiButton-contained': {
                  bgcolor: '#42a5f5',
                  '&:hover': {
                    bgcolor: '#1e88e5',
                  },
                },
                '&.MuiButton-outlined': {
                  color: '#1976d2',
                  borderColor: '#90caf9',
                  '&:hover': {
                    borderColor: '#42a5f5',
                    bgcolor: 'rgba(66, 165, 245, 0.04)'
                  },
                }
              }}
            >
              Cables
            </Button>
            </Box>
          </Box>

          <Box position="absolute" right={0}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="sort-by-label">Sort By</InputLabel>
              <Select
                labelId="sort-by-label"
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value as string)}
                label="Sort By"
              >
                <MenuItem value="featured">Featured</MenuItem>
                <MenuItem value="latest">Latest</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
                <MenuItem value="name-asc">Name: A to Z</MenuItem>
                <MenuItem value="name-desc">Name: Z to A</MenuItem>
                <MenuItem value="top-rated">Top Rated</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Product List */}
        <Box>
          <ProductList
            products={paginatedProducts}
            loading={false}
            viewMode={viewMode}
            onAddToCart={(productId) => {
              const product = paginatedProducts.find(p => p._id === productId);
              if (product) handleAddToCart(product);
            }}
            isInCart={isInCart}
            onToggleWishlist={handleAddToWishlist}
            page={filters.page}
            onPageChange={handlePageChange}
            count={total}
            itemsPerPage={filters.limit}
            cartItems={cart?.items.map(item => item.product) || []}
          />
        </Box>
      </Box>
      
      {/* Stylish Message Section */}
      <Box 
        sx={{
          mt: 0,
          mb: 6,
          p: 4,
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          borderRadius: 3,
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          position: 'relative',
          overflow: 'hidden',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
          }
        }}
      >
        <Box 
          component="span"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 60,
            height: 60,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            color: 'white',
            mb: 3,
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
          }}
        >
          <ShoppingBagOutlinedIcon sx={{ fontSize: 32 }} />
        </Box>
        <Typography 
          variant="h6"
          component="p"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 2,
            maxWidth: '600px',
            mx: 'auto',
            lineHeight: 1.4,
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}
        >
          Explore our Complete Collection with Detailed Specifications ~ Just a Call or Message away!
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button 
            variant="contained"
            color="primary"
            sx={{ 
              textTransform: 'none',
              px: 4,
              py: 1,
              fontWeight: 500,
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)'
              }
            }}
            onClick={() => window.location.href = 'tel:+919426029094'}
          >
            Call Now
          </Button>
          <Button 
            variant="outlined"
            color="primary"
            sx={{ 
              textTransform: 'none',
              px: 4,
              py: 1,
              fontWeight: 500,
              borderWidth: '2px',
              '&:hover': {
                borderWidth: '2px'
              }
            }}
            onClick={() => window.location.href = 'mailto:uttam.corp@gmail.com'}
          >
            Email Us
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductsPage;

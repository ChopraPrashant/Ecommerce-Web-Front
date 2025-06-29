import React, { useMemo, useEffect, useRef } from 'react';
import { Box, Typography, Skeleton, Pagination, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import ProductCard from './ProductCard';
import { IProduct } from '../../types/product';

interface ProductListProps {
  products: IProduct[];
  loading?: boolean;
  error?: string | null;
  count?: number;
  page?: number;
  onPageChange?: (event: React.ChangeEvent<unknown>, page: number) => void;
  onAddToCart?: (productId: string) => void;
  onToggleWishlist?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
  wishlistItems?: string[];
  cartItems?: string[];
  viewMode?: 'grid' | 'list';
  itemsPerPage?: number;
  loadingCount?: number;
  showPagination?: boolean;
  emptyMessage?: string;
  sx?: any;
}

const StyledProductList = styled(Box)(({ theme }) => ({
  width: '100%',
  '& .MuiPagination-ul': {
    justifyContent: 'center',
    marginTop: theme.spacing(4),
  },
}));

const ProductGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, 1fr)',
  gap: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
  '&.list-view': {
    gridTemplateColumns: '1fr',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: '1fr',
    },
  },
}));

const StyledEmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(8, 2),
  textAlign: 'center',
  '& .MuiSvgIcon-root': {
    fontSize: '4rem',
    color: theme.palette.text.disabled,
    marginBottom: theme.spacing(2),
  },
}));

const ProductList: React.FC<ProductListProps> = ({
  products = [],
  loading = false,
  error = null,
  count = 0,
  page = 1,
  onPageChange,
  onAddToCart,
  onToggleWishlist,
  onQuickView,
  wishlistItems = [],
  cartItems = [],
  viewMode = 'grid',
  itemsPerPage = 12,
  loadingCount = 12,
  showPagination = true,
  emptyMessage = 'No products found',
  sx,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const containerRef = useRef<HTMLDivElement>(null);
  const prevPageRef = useRef<number>(page || 1);

  // Handle scroll to top when page changes
  useEffect(() => {
    if (page && page !== prevPageRef.current) {
      // Scroll to the top of the container
      const scrollToTop = () => {
        if (containerRef.current) {
          const container = containerRef.current;
          container.scrollIntoView({ behavior: 'smooth', block: 'start' });
          
          // Fallback to window scroll if needed
          const timer = setTimeout(() => {
            window.scrollTo({
              top: container.offsetTop,
              behavior: 'smooth'
            });
          }, 100);
          
          return () => clearTimeout(timer);
        }
      };
      
      // Use requestAnimationFrame to ensure the scroll happens after the DOM updates
      requestAnimationFrame(() => {
        scrollToTop();
      });
    }
    prevPageRef.current = page || 1;
  }, [page]);

  // Calculate the number of columns based on view mode and screen size
  const getGridColumns = () => {
    if (viewMode === 'list') return 1;
    if (isMobile) return 2;
    if (isTablet) return 3;
    return 4; // Desktop
  };

  const gridColumns = getGridColumns();
  const itemSpacing = viewMode === 'list' ? 2 : 2;

  // Generate loading skeletons
  const loadingSkeletons = useMemo(
    () =>
      Array(loadingCount || 8)
        .fill(0)
        .map((_, index) => (
          <Box key={`skeleton-${index}`}>
            <ProductCard
              product={{
                _id: `skeleton-${index}`,
                name: 'Loading product',
                description: 'Loading description',
                price: 0,
                originalPrice: 0,
                stock: 0,
                images: [],
                categories: [],
                variants: [],
                attributes: [],
                reviews: [],
                rating: 0,
                reviewCount: 0,
                isFeatured: false,
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                slug: '',
                sku: '',
              }}
              loading={true}
              variant={viewMode === 'list' ? 'list' : 'grid'}
            />
          </Box>
        )),
    [loadingCount, viewMode]
  );

  const renderProducts = useMemo(() => {
    if (loading) {
      return loadingSkeletons;
    }

    if (products.length === 0) {
      return (
        <Box sx={{ gridColumn: '1 / -1' }}>
          <StyledEmptyState>
            <Typography variant="h6" color="textSecondary">
              {emptyMessage || 'No products found'}
            </Typography>
          </StyledEmptyState>
        </Box>
      );
    }

    return products.map((product) => (
      <Box key={product._id}>
        <ProductCard
          product={product}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          onQuickView={onQuickView}
          isInWishlist={wishlistItems?.includes(product._id) || false}
          isInCart={cartItems?.includes(product._id) || false}
          variant={viewMode}
        />
      </Box>
    ));
  }, [
    loading,
    loadingSkeletons,
    products,
    emptyMessage,
    viewMode,
    onAddToCart,
    onToggleWishlist,
    onQuickView,
    wishlistItems,
    cartItems,
  ]);

  // Handle error state
  if (error) {
    return (
      <StyledEmptyState sx={sx}>
        <Typography color="error" variant="h6" gutterBottom>
          Error loading products
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {error}
        </Typography>
      </StyledEmptyState>
    );
  }

  return (
    <StyledProductList sx={sx} ref={containerRef}>
      <ProductGrid className={viewMode === 'list' ? 'list-view' : ''}>
        {renderProducts}
      </ProductGrid>

      {showPagination && count > itemsPerPage && (
        <Pagination
          count={Math.ceil(count / itemsPerPage)}
          page={page}
          onChange={onPageChange}
          color="primary"
          sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}
        />
      )}
    </StyledProductList>
  );
};

export default ProductList;

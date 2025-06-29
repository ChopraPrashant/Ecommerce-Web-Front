import React from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Typography, Button, Rating, Chip, Skeleton } from '@mui/material';
import { ShoppingCart, Favorite, FavoriteBorder, Visibility } from '@mui/icons-material';
import { formatCurrency } from '../../utils/helpers';
import Card from '../ui/Card';
import { IProduct } from '../../types/product';

interface ProductCardProps {
  product: IProduct;
  loading?: boolean;
  onAddToCart?: (productId: string) => void;
  onToggleWishlist?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
  isInWishlist?: boolean;
  isInCart?: boolean;
  showActions?: boolean;
  variant?: 'grid' | 'list';
  sx?: any;
}

const StyledProductCard = styled(Box, {
  shouldForwardProp: (prop) => !['variant'].includes(prop as string),
})<{ variant: 'grid' | 'list' }>(({ theme, variant }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
  ...(variant === 'list' && {
    flexDirection: 'row',
    '&:hover': {
      transform: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  }),
}));

const ProductImageWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  '&:hover .product-actions': {
    opacity: 1,
    transform: 'translateY(0)',
  },
}));

const ProductActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(1),
  background: 'rgba(255, 255, 255, 0.9)',
  opacity: 0,
  transform: 'translateY(10px)',
  transition: 'all 0.3s ease-in-out',
  gap: theme.spacing(1),
  '& > *': {
    minWidth: 'auto',
    padding: theme.spacing(1),
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

const SaleBadge = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  backgroundColor: theme.palette.error.main,
  color: theme.palette.error.contrastText,
  fontWeight: 'bold',
  zIndex: 1,
}));

const StockBadge = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'inStock',
})<{ inStock: boolean }>(({ theme, inStock }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  left: theme.spacing(1),
  backgroundColor: inStock ? theme.palette.success.main : theme.palette.error.main,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  zIndex: 1,
}));

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  loading = false,
  onAddToCart,
  onToggleWishlist,
  onQuickView,
  isInWishlist = false,
  isInCart = false,
  showActions = true,
  variant = 'grid',
  sx,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const handleProductClick = () => {
    navigate(`/products/${product.slug || product._id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product._id);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(product._id);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product._id);
    }
  };

  const renderImage = () => (
    <ProductImageWrapper>
      {loading ? (
        <Skeleton variant="rectangular" width="100%" height={variant === 'grid' ? 200 : 240} />
      ) : (
        <>
          <img
            src={product.images?.[0]?.url || '/placeholder-product.jpg'}
            alt={product.name}
            style={{
              width: '100%',
              height: variant === 'grid' ? '200px' : '240px',
              objectFit: 'cover',
            }}
            loading="lazy"
          />
          {(product.onSale || product.discountPercentage) && (
            <SaleBadge
              size="small"
              label={`${product.discountPercentage || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF`}
              sx={{
                position: 'absolute',
                top: theme.spacing(1),
                right: theme.spacing(1),
              }}
            />
          )}
          <StockBadge
            size="small"
            inStock={product.stock > 0}
            label={product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          />
          {showActions && (
            <ProductActions className="product-actions">
              <Button
                size="small"
                color="primary"
                variant="contained"
                startIcon={isInCart ? <ShoppingCart /> : <ShoppingCart />}
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isInCart}
              >
                {isInCart ? 'In Cart' : 'Add to Cart'}
              </Button>
              <Button
                size="small"
                color="secondary"
                variant="outlined"
                onClick={handleToggleWishlist}
              >
                {isInWishlist ? <Favorite color="error" /> : <FavoriteBorder />}
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={handleQuickView}
              >
                <Visibility />
              </Button>
            </ProductActions>
          )}
        </>
      )}
    </ProductImageWrapper>
  );

  const renderContent = () => (
    <Box p={2} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      {loading ? (
        <>
          <Skeleton width="80%" height={24} />
          <Skeleton width="60%" height={20} sx={{ mt: 1 }} />
          <Skeleton width="40%" height={20} sx={{ mt: 1 }} />
        </>
      ) : (
        <>
          <Typography
            variant="subtitle1"
            component="h3"
            sx={{
              fontWeight: 500,
              mb: 0.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minHeight: '3em',
            }}
          >
            {product.name}
          </Typography>
          
          {product.brand && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: 'block',
                mb: 0.5,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontWeight: 500,
              }}
            >
              {product.brand.name}
            </Typography>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating
              value={product.averageRating || product.rating || 0}
              precision={0.5}
              readOnly
              size="small"
            />
            <Typography variant="caption" color="text.secondary">
              ({product.numReviews || product.reviewCount || 0} reviews)
            </Typography>
          </Box>
          
          <Box sx={{ mt: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography
                variant="h6"
                component="span"
                color="primary"
                sx={{ fontWeight: 'bold' }}
              >
                {formatCurrency(product.price)}
              </Typography>
              {(product.onSale || product.discountPercentage) && product.originalPrice && (
                <Typography
                  variant="body2"
                  color="text.disabled"
                  sx={{
                    textDecoration: 'line-through',
                    ml: 1,
                  }}
                >
                  {formatCurrency(product.originalPrice)}
                </Typography>
              )}
            </Box>
            
            {variant === 'list' && product.stock > 0 && (
              <Typography variant="caption" color="success.main" display="block">
                {product.stock} items left
              </Typography>
            )}
            
            {variant === 'list' && product.shortDescription && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {product.shortDescription}
              </Typography>
            )}
          </Box>
        </>
      )}
    </Box>
  );

  if (variant === 'list') {
    return (
      <StyledProductCard
        variant={variant}
        sx={{
          ...sx,
          '&:hover': {
            '& .MuiCard-root': {
              boxShadow: (theme: any) => theme.shadows[4],
            },
          },
        }}
      >
        <Card
          variant="outlined"
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            p: 0,
            '&:hover': {
              cursor: 'pointer',
            },
            [theme.breakpoints.down('sm')]: {
              flexDirection: 'column',
            },
            ...sx,
          }}
          onClick={handleProductClick}
        >
          <Box
            sx={{
              width: { xs: '100%', sm: 240 },
              flexShrink: 0,
              [theme.breakpoints.down('sm')]: {
                width: '100%',
              },
            }}
          >
            {renderImage()}
          </Box>
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            {renderContent()}
          </Box>
        </Card>
      </StyledProductCard>
    );
  }

  return (
    <StyledProductCard variant={variant} sx={sx}>
      <Card
        variant="outlined"
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            boxShadow: (theme: any) => theme.shadows[4],
            cursor: 'pointer',
          },
        }}
        onClick={handleProductClick}
      >
        {renderImage()}
        {renderContent()}
      </Card>
    </StyledProductCard>
  );
};

export default ProductCard;

import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/store';
import { addToCart } from '../store/slices/simpleCartSlice';
import { Box, Typography, Paper, Container, Card, CardContent, CardMedia, IconButton, Snackbar, Alert, Grid } from '@mui/material';
import { ChevronLeft, ChevronRight, ShoppingCartOutlined, AddShoppingCart } from '@mui/icons-material';

// Format number as Indian Rupees
const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  sales: number;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleAddToCart = (product: Product) => {
    const cartItem = {
      _id: product.id,
      id: product.id, // For backward compatibility
      product: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      stock: 10, // Default stock value, should be fetched from product
      sku: `SKU-${product.id}`, // Generate a default SKU
    };
    
    dispatch(addToCart(cartItem));
    setSnackbarMessage(`${product.name} added to cart`);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  const statsContainerRef = React.useRef<HTMLDivElement>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Mock best-selling products data
  const bestSellingProducts: Product[] = [
    {
      id: '1',
      name: 'Submersible Pump',
      price: 0,
      image: 'submersible.png',
      sales: 0
    },
    {
      id: '2',
      name: 'MonoBlock Pump',
      price: 0,
      image: 'Monoblock.png',
      sales: 0
    },
    {
      id: '3',
      name: 'Induction Motor',
      price: 0,
      image: 'InductionMotor.png',
      sales: 0
    },
    {
      id: '4',
      name: 'Pressure Booster',
      price: 0,
      image: 'Pressure Booster.png',
      sales: 0
    },
    {
      id: '5',
      name: 'Cable',
      price: 0,
      image: 'Cables.png',
      sales: 0
    },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const cardWidth = 200; // Width of each card
    const gap = 24; // gap-3 = 1rem = 24px
    const scrollAmount = (cardWidth + gap) * 4; // Scroll by 4 cards at a time
    
    if (direction === 'left' && currentIndex > 0) {
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
      setCurrentIndex(prev => prev - 1);
    } else if (direction === 'right' && currentIndex < Math.ceil(bestSellingProducts.length / 4) - 1) {
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      setCurrentIndex(prev => prev + 1);
    }
  };
  
  const isFirstPage = currentIndex === 0;
  const isLastPage = currentIndex >= Math.ceil(bestSellingProducts.length / 4) - 1;

  // Scrolling text component
  const ScrollingText = ({ text }: { text: string }) => (
    <Box 
      sx={{
        py: 1.8,
        color: 'text.primary',
        fontStyle: 'italic',
        fontWeight: 700,
        fontFamily: '"Times New Roman", Times, serif',
        fontSize: '1.05rem',
        letterSpacing: '0.3px',
        position: 'relative',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'rgba(250, 250, 250, 0.8)',
        '&:hover': {
          '& > div': {
            animationPlayState: 'paused'
          }
        }
      }}
    >
      <Box
        sx={{
          display: 'inline-block',
          paddingLeft: '100%',
          animation: 'scroll 30s linear infinite',
          '@keyframes scroll': {
            '0%': { transform: 'translateX(0)' },
            '100%': { transform: 'translateX(-100%)' }
          }
        }}
      >
        <Typography variant="h6" component="span" sx={{ pr: 4, fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.25rem' } }}>
          {text}
        </Typography>
        <Typography variant="h6" component="span" sx={{ pr: 4, fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.25rem' } }}>
          {text}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Helmet>
        <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>
      <Box sx={{ mt: -4 }}>
        <ScrollingText text="Supplying Quality Water Pumps, Induction Motors, and Cables for over 20 years — Trusted Registered Dealer in the Marketplace" />
      </Box>
      {/* Full Width Banner */}
      <Box
        component="img"
        src="/Productss.png"
        alt="Banner"
        sx={{
          width: '98%',
          height: '540px',
          objectFit: 'cover',
          display: 'block',
          backgroundColor: '#f5f5f5',
          mt: 4,
          ml: 2,  // Small left margin
          borderRadius: 1
        }}
      />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Paper 
            elevation={3}
            onClick={() => navigate('/products')}
            sx={{ 
              p: 3,
              width: '100%',
              maxWidth: 300,
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 6,
              }
            }}
          >
            <Typography variant="h6" color="textSecondary" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
              Total Products
            </Typography>
            <Typography variant="h4" align="center">100+</Typography>
          </Paper>
        </Box>

        {/* What we Deal In */}
        <Box sx={{ mt: 8, mb: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'left' }}>
            We Deal In
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 2 }}>
            {/* Water Pumps Card */}
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' } }}>
              <Card 
                onClick={() => {
                  navigate('/products?category=water-pumps');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image="pumpp.png"
                  alt="Water Pumps"
                  sx={{ objectFit: 'contain', px: '8px', pt: '10px', pb: '4px', pr: '4px' }}
                />
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Typography gutterBottom variant="h5" component="h3">
                    Water Pumps
                  </Typography>
                  <Typography color="text.secondary">
                    High-Quality Water Pumps for various Applications
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            
            {/* Induction Motors Card */}
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' } }}>
              <Card 
                onClick={() => {
                  navigate('/products?category=induction-motors');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image="/motorr.png"
                  alt="Induction Motors"
                  sx={{ objectFit: 'contain', p: 0 }}
                />
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Typography gutterBottom variant="h5" component="h3">
                    Induction Motors
                  </Typography>
                  <Typography color="text.secondary">
                    Efficient and Reliable Induction Motors for Industrial Use
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            
            {/* Cables Card */}
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' }, mx: 'auto' }}>
              <Card 
                onClick={() => {
                  navigate('/products?category=cables');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image="/Cables.png"
                  alt="Cables"
                  sx={{ objectFit: 'contain', p: 1 }}
                />
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Typography gutterBottom variant="h5" component="h3">
                    Cables
                  </Typography>
                  <Typography color="text.secondary">
                    Durable Cables for Industrial and Residential Applications
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      
      {/* Best Selling Products */}
      <Box sx={{ mt: 6, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Best Selling Products
          </Typography>
          <IconButton 
            color="primary" 
            aria-label="View Cart"
            onClick={() => navigate('/cart')}
            sx={{
              p: 1,
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            <ShoppingCartOutlined />
          </IconButton>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={() => scroll('left')}
            disabled={isFirstPage}
            sx={{
              backgroundColor: 'background.paper',
              boxShadow: 1,
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              flexShrink: 0,
              width: 40,
              height: 40,
              opacity: isFirstPage ? 0.5 : 1,
              cursor: isFirstPage ? 'not-allowed' : 'pointer'
            }}
          >
            <ChevronLeft />
          </IconButton>
          
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <Box 
              ref={scrollContainerRef}
              sx={{
                display: 'grid',
                gridAutoFlow: 'column',
                gridAutoColumns: 'minmax(200px, 1fr)',
                gap: 3,
                py: 2,
                px: 1,
                overflow: 'hidden',
                scrollBehavior: 'smooth',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                width: '100%',
              }}
          >
            {bestSellingProducts.map((product) => (
              <Card 
                key={product.id}
                sx={{ 
                  minWidth: 200, 
                  flexShrink: 0,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <Box sx={{ p: 1, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box 
                      component="img"
                      src={product.image}
                      alt={product.name}
                      sx={{ 
                        height: '100%',
                        width: product.id === '1' ? '120%' : 'auto',
                        maxWidth: product.id === '1' ? '120%' : '100%',
                        objectFit: 'contain', 
                        margin: product.id === '1' ? '0 -10%' : '0'
                      }}
                    />
                  </Box>
                  <IconButton
                    color="primary"
                    aria-label="add to cart"
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      backgroundColor: 'background.paper',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    <AddShoppingCart />
                  </IconButton>
                </Box>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle1" noWrap sx={{ textAlign: 'center' }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                    {formatINR(product.price)}
                  </Typography>
                  <Typography variant="caption" color="primary" sx={{ textAlign: 'center', display: 'block' }}>
                    {product.sales} sold
                  </Typography>
                </CardContent>
              </Card>
              ))}
            </Box>
          </Box>
          
          <IconButton 
            onClick={() => scroll('right')}
            disabled={isLastPage}
            sx={{
              backgroundColor: 'background.paper',
              boxShadow: 1,
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              flexShrink: 0,
              width: 40,
              height: 40,
              opacity: isLastPage ? 0.5 : 1,
              cursor: isLastPage ? 'not-allowed' : 'pointer'
            }}
          >
            <ChevronRight />
          </IconButton>
        </Box>
        </Box>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DashboardPage;

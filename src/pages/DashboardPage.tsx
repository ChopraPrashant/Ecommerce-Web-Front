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
      name: 'OWE052(1PH)Z-21FS',
      price: 9999,
      image: 'OWE052.png',
      sales: 0
    },
    {
      id: '2',
      name: 'Aquagold 150',
      price: 15550,
      image: 'aquagold150.png',
      sales: 0
    },
    {
      id: '3',
      name: '5HP IE3 3000 RPM',
      price: 49999,
      image: 'InductionMotor.png',
      sales: 0
    },
    {
      id: '4',
      name: 'Pressure Booster V24',
      price: 24999,
      image: 'Pressure Booster.png',
      sales: 0
    },
    {
      id: '5',
      name: 'Cable 100m',
      price: 5999,
      image: 'Cables.png',
      sales: 0
    },
    {
      id: '6',
      name: 'STPM22(1PH)-15 2HP',
      price: 24999,
      image: 'Stpm22.png',
      sales: 0
    },
    {
      id: '7',
      name: 'Control Panel 1.5HP',
      price: 3499,
      image: 'controlpanel.png',
      sales: 0
    },
    {
      id: '8',
      name: 'Flomax Plus 1HP',
      price: 10999,
      image: 'flomaxplus.png',
      sales: 0
    },
    {
      id: '9',
      name: 'Champ Dura 1HP',
      price: 5199,
      image: 'champdura.png',
      sales: 0
    },
    {
      id: '10',
      name: 'Sewerage Pump 0.5HP',
      price: 11999,
      image: 'stpg.png',
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
      <Box sx={{ mt: -8 }}>
        <ScrollingText text="Supplying Quality Water Pumps, Induction Motors, and Cables for over 20 years — Trusted Registered Dealer in the Marketplace" />
      </Box>
      {/* Full Width Banner */}
      <Box
        component="img"
        src="/Productss.png"
        alt="Banner"
        sx={{
          width: '98%',
          height: { xs: '300px', sm: '540px' },
          objectFit: 'cover',
          display: 'block',
          backgroundColor: '#f5f5f5',
          mt: { xs: 0, sm: 4 },
          mb: { xs: 0, sm: 0 },
          pt: { xs: 0, sm: 0 },
          pb: { xs: 0, sm: 0 },
          ml: { xs: 0, sm: 2 },
          mx: { xs: 'auto', sm: 'unset' },
          borderRadius: 1,
          '@media (max-width: 600px)': {
            width: '100%',
            objectFit: 'contain',
            backgroundColor: 'transparent',
            height: '280px',
            mt: 0,
            mb: 0,
            pt: 0,
            pb: 0
          }
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
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold', 
              textAlign: { xs: 'center', sm: 'left' },
              width: '100%',
              px: { xs: 2, sm: 0 }
            }}
          >
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
        <Box sx={{ 
          display: 'flex', 
          justifyContent: { xs: 'center', sm: 'space-between' }, 
          alignItems: 'center', 
          mb: 2 
        }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '1.5rem', sm: '2.125rem' } // Smaller on mobile, normal on desktop
            }}
          >
            Best Selling Products
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
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
        </Box>
        
        <Box sx={{ width: '100%' }}>
            <Box 
              ref={scrollContainerRef}
              sx={{
                display: 'grid',
                gridAutoFlow: 'column',
                gridAutoColumns: 'minmax(200px, 1fr)',
                gap: 3,
                py: 2,
                px: 1,
                overflowX: 'auto',
                scrollBehavior: 'smooth',
                '&::-webkit-scrollbar': {
                  display: { xs: 'none', sm: 'block' },
                  height: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  borderRadius: '3px',
                },
                msOverflowStyle: { xs: 'none', sm: 'auto' },
                scrollbarWidth: { xs: 'none', sm: 'thin' },
                width: '100%',
                WebkitOverflowScrolling: 'touch', // For smooth scrolling on iOS
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
                  <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', fontSize: '1rem', fontWeight: 'bold' }}>
                    {formatINR(product.price)}
                  </Typography>
                  {/* Sales count removed as per user request */}
                </CardContent>
              </Card>
              ))}
            </Box>
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

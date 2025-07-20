import { ReactNode } from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography, Button, InputBase, alpha, Container, Badge, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined';
import LinkedIn from '@mui/icons-material/LinkedIn';
import Twitter from '@mui/icons-material/Twitter';
import LocationOn from '@mui/icons-material/LocationOn';
import Phone from '@mui/icons-material/Phone';
import Email from '@mui/icons-material/Email';
import AccessTime from '@mui/icons-material/AccessTime';
import { useAppSelector } from '../store/store';
import { useLocation, Link } from 'react-router-dom';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const cartItemCount = useAppSelector(
    (state) => state.cart.cart?.items?.reduce((total: number, item: any) => total + (item.quantity || 0), 0) || 0
  );
  const location = useLocation();
  const isContactPage = location.pathname === '/contact';
  const isCartPage = location.pathname === '/cart';
  const cartItems = useAppSelector((state) => state.cart.cart?.items || []);
  const shouldShowFooter = !isContactPage && !(isCartPage && cartItems.length === 0);

  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography variant="h6" component="div">
              <Button 
                component={Link}
                to="/"
                color="inherit" 
                sx={{ 
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                Uttam Corporation
              </Button>
            </Typography>
            
            <Box
              sx={{
                position: 'relative',
                borderRadius: (theme) => theme.shape.borderRadius,
                backgroundColor: (theme) => alpha(theme.palette.common.white, 0.15),
                '&:hover': {
                  backgroundColor: (theme) => alpha(theme.palette.common.white, 0.25),
                },
                marginLeft: 3,
                marginRight: 3,
                width: '100%',
                maxWidth: 500,
              }}
            >
              <Box
                sx={{
                  padding: (theme) => theme.spacing(0, 2),
                  height: '100%',
                  position: 'absolute',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SearchIcon />
              </Box>
              <InputBase
                placeholder="Search..."
                sx={{
                  color: 'inherit',
                  width: '100%',
                  '& .MuiInputBase-input': {
                    padding: (theme) => theme.spacing(1, 1, 1, 0),
                    paddingLeft: (theme) => `calc(1em + ${theme.spacing(4)})`,
                    transition: (theme) => theme.transitions.create('width'),
                    width: '100%',
                  },
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              component={Link}
              to="/"
              color="inherit" 
              sx={{ whiteSpace: 'nowrap' }}
            >
              Dashboard
            </Button>
            <Button 
              component={Link}
              to="/contact"
              color="inherit" 
              sx={{ whiteSpace: 'nowrap' }}
            >
              Contact Us
            </Button>
            <Button 
              component={Link}
              to="/products"
              color="inherit" 
              sx={{ mx: 1 }}
            >
              Products
            </Button>
            <IconButton 
              component={Link}
              to="/cart"
              color="inherit" 
              aria-label="cart"
              sx={{ ml: 2 }}
            >
              <Badge badgeContent={cartItemCount} color="error">
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          pt: 8, // Padding top to account for AppBar
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          }
        }}
      >
        <Box component="main" sx={{ flexGrow: 1, pt: 5, pb: shouldShowFooter ? 0 : 0 }}>
          {children}
        </Box>
        
        {/* Footer */}
        {shouldShowFooter && (
          <Box 
            component="footer" 
            sx={{ 
              py: 4,
              px: 2,
              mt: 'auto',
              backgroundColor: (theme) => theme.palette.background.paper,
              borderTop: (theme) => `1px solid ${theme.palette.divider}`
            }}
          >
          <Container maxWidth="lg">
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1.3fr' },
              gap: 4,
              mb: 2,
              '& > div': {
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'center', md: 'flex-start' },
                textAlign: { xs: 'center', md: 'left' }
              }
            }}>
              {/* Left Column - Company Info and Business Hours */}
              <Box sx={{ maxWidth: '100%', pl: { md: 6 } }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom fontWeight={800} color="primary" sx={{ fontSize: '1.35rem' }}>
                    Uttam Corporation
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Your Trusted Partner for Quality Products and Services since 2006.
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={800} fontSize={18} gutterBottom color="primary">
                    Business Hours
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <AccessTime fontSize="small" sx={{ color: 'primary.main', mt: '2px' }} />
                    <Typography variant="body2" color="text.secondary">
                      Monday - Saturday: 11:00 AM - 6:00 PM
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Right Column - Contact Info */}
              <Box sx={{ maxWidth: '100%', ml: { md: 30 }, mr: { md: 0 } }}>
                <Typography variant="body1" color="primary" sx={{ mb: 1.5, fontWeight: 800, fontSize: '1.1rem' }}>
                  Ashok Chopra
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 1.2,
                  '& > *': {
                    display: 'flex',
                    alignItems: 'flex-start',
                    lineHeight: 1.4
                  },
                  '& svg': {
                    mt: 0.5,
                    mr: 1.5,
                    color: 'primary.main',
                    flexShrink: 0
                  }
                }}>
                  <Typography 
                    variant="body2" 
                    component="a"
                    href="https://maps.app.goo.gl/CdZk77cpA5kLrkfH8"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: 'flex',
                      color: 'text.secondary',
                      textDecoration: 'none',
                      '&:hover': {
                        color: 'primary.main',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    <LocationOn fontSize="small" sx={{ mt: '2px' }} />
                    <span>
                      B-30 Karnavati Estate, G.I.D.C, Phase 3,<br />
                      Vatva, Ahmedabad - 382445,<br />
                      Gujarat, India
                    </span>
                  </Typography>
                  <Typography 
                    variant="body2" 
                    component="a" 
                    href="tel:+919426029094" 
                    color="text.secondary" 
                    sx={{ 
                      textDecoration: 'none', 
                      '&:hover': { 
                        textDecoration: 'underline',
                        color: 'primary.main'
                      } 
                    }}
                  >
                    <Phone fontSize="small" />
                    <span>+91 9426029094<br />+91 9408761181</span>
                  </Typography>
                  <Typography 
                    variant="body2" 
                    component="a" 
                    href="mailto:uttam.corp@gmail.com" 
                    color="text.secondary" 
                    sx={{ 
                      textDecoration: 'none', 
                      '&:hover': { 
                        textDecoration: 'underline',
                        color: 'primary.main'
                      } 
                    }}
                  >
                    <Email fontSize="small" />
                    <span>uttam.corp@gmail.com</span>
                  </Typography>
                </Box>
              </Box>


            </Box>
            
            <Box sx={{ 
              pt: 2, 
              mt: 2,
              borderTop: 1, 
              borderColor: 'divider',
              textAlign: 'center'
            }}>
              <Typography variant="body2" color="text.secondary" align="center">
                © {new Date().getFullYear()} Uttam Corporation. All rights reserved.
              </Typography>
            </Box>
          </Container>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MainLayout;

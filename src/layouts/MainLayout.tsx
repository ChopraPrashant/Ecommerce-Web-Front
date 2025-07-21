import { ReactNode, useState } from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography, Button, InputBase, alpha, Container, Badge, IconButton, useMediaQuery, useTheme, Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };
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
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
        position: 'relative'
      }}
    >
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Mobile menu button */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo and Company Name */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0, mr: 2 }}>
              <Box 
                component="img"
                src="logoo.png" 
                alt="Uttam Corporation Logo"
                sx={{
                  height: { xs: 30, sm: 40 },
                  width: 'auto',
                  mr: 1,
                }}
              />
              <Typography 
                variant="h6" 
                component={Link}
                to="/"
                sx={{ 
                  color: 'inherit',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    textDecoration: 'none',
                  },
                }}
              >
                Uttam Corporation
              </Typography>
            </Box>
            
            {/* Search Bar - Desktop */}
            <Box
              sx={{
                position: 'relative',
                borderRadius: (theme) => theme.shape.borderRadius,
                backgroundColor: (theme) => alpha(theme.palette.common.white, 0.15),
                '&:hover': {
                  backgroundColor: (theme) => alpha(theme.palette.common.white, 0.25),
                },
                ml: { xs: 0, md: 3 },
                mr: { xs: 1, md: 3 },
                width: '100%',
                maxWidth: 500,
                display: { xs: showSearch ? 'flex' : 'none', md: 'flex' },
                flex: { xs: 1, md: '0 1 auto' },
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
              {isMobile && (
                <IconButton
                  color="inherit"
                  onClick={() => setShowSearch(false)}
                  sx={{ mr: 1 }}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </Box>
          </Box>
          
          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
            <Button 
              component={Link}
              to="/"
              color="inherit" 
              sx={{ whiteSpace: 'nowrap', minWidth: 'auto', px: 1 }}
            >
              Dashboard
            </Button>
            <Button 
              component={Link}
              to="/products"
              color="inherit" 
              sx={{ whiteSpace: 'nowrap', minWidth: 'auto', px: 1 }}
            >
              Products
            </Button>
            <Button 
              component={Link}
              to="/contact"
              color="inherit" 
              sx={{ whiteSpace: 'nowrap', minWidth: 'auto', px: 1 }}
            >
              Contact Us
            </Button>
            <IconButton 
              component={Link}
              to="/cart"
              color="inherit" 
              aria-label="cart"
              sx={{ ml: 1 }}
              size="large"
            >
              <Badge badgeContent={cartItemCount} color="error">
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Box>

          {/* Mobile Search and Cart */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1, alignItems: 'center', ml: 1 }}>
            <IconButton
              color="inherit"
              aria-label="search"
              onClick={toggleSearch}
              sx={{ display: showSearch ? 'none' : 'flex' }}
            >
              <SearchIcon />
            </IconButton>
            <IconButton 
              component={Link}
              to="/cart"
              color="inherit" 
              aria-label="cart"
              size="large"
            >
              <Badge badgeContent={cartItemCount} color="error">
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box',
            width: 280,
            backgroundColor: (theme) => theme.palette.background.paper,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="div">
            Menu
          </Typography>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          <ListItem 
            component={Link} 
            to="/" 
            onClick={handleDrawerToggle}
            sx={{
              '&:hover': {
                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
              },
              cursor: 'pointer',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem 
            component={Link} 
            to="/products" 
            onClick={handleDrawerToggle}
            sx={{
              '&:hover': {
                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
              },
              cursor: 'pointer',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <ListItemText primary="Products" />
          </ListItem>
          <ListItem 
            component={Link} 
            to="/contact" 
            onClick={handleDrawerToggle}
            sx={{
              '&:hover': {
                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
              },
              cursor: 'pointer',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <ListItemText primary="Contact Us" />
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          overflowX: 'hidden',
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
        <Box component="div" sx={{ 
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden',
          flexGrow: 1, 
          pt: { xs: 7, sm: 8 }, 
          pb: shouldShowFooter ? 0 : 0,
          px: { xs: 2, sm: 3, md: 4 },
          boxSizing: 'border-box'
        }}>
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
              gap: { xs: 3, md: 4 },
              mb: 2,
              '& > div': {
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'center', md: 'flex-start' },
                textAlign: { xs: 'center', md: 'left' },
                '& > *': {
                  maxWidth: '100%',
                }
              }
            }}>
              {/* Left Column - Company Info and Business Hours */}
              <Box sx={{ 
                maxWidth: '100%', 
                pl: { md: 6 },
                width: '100%',
                boxSizing: 'border-box',
                px: { xs: 2, sm: 0 },
              }}>
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
              <Box sx={{ 
                maxWidth: '100%', 
                ml: { md: 30 }, 
                mr: { md: 0 },
                width: '100%',
                boxSizing: 'border-box',
                px: { xs: 2, sm: 0 },
                mt: { xs: 0, md: 0 }, // Reduced from 4 to 1 for mobile
              }}>
                <Typography variant="body1" color="primary" sx={{ 
                  mb: { xs: 0.5, md: 0 }, 
                  fontWeight: 800, 
                  fontSize: '1.2rem',
                  textAlign: { xs: 'center', md: 'left' }
                }}>
                  Ashok Chopra
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 1.2,
                  '& > *': {
                    display: 'flex',
                    lineHeight: 1.4,
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'center', md: 'flex-start' },
                    textAlign: { xs: 'center', md: 'left' }
                  },
                  '& svg': {
                    mt: 0.5,
                    mr: { xs: 0, md: 1.5 },
                    mb: { xs: 0.5, md: 0 },
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
              textAlign: 'center',
              px: { xs: 2, sm: 0 },
            }}>
              <Typography variant="body2" color="text.secondary" align="center">
                {new Date().getFullYear()} Uttam Corporation. All rights reserved.
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

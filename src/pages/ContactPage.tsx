import React from 'react';
import { Container, Typography, Paper, Box, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Email, Phone, LocationOn, Business } from '@mui/icons-material';

const ContactPage: React.FC = () => {
  // Contact information
  const contactInfo = {
    companyName: 'Uttam Corporation',
    yourName: 'Prashant Chopra',
    email: 'Prashant.ecommerce2025@gmail.com',
    phone: '+91 9408761181',
    mobile: '+91 9426029094',
    address: {
      street: 'B-30 Karnavati Estate, G.I.D.C, Phase 3, Vatva',
      city: 'Ahmedabad',
      state: 'Gujarat',
      postalCode: '382445',
      country: 'India'
    },
    workingHours: 'Monday - Saturday : 11:00 AM - 6:00 PM',
    socialMedia: {
      linkedin: 'https://linkedin.com/in/yourprofile',
      twitter: 'https://twitter.com/yourhandle'
    }
  };

  // Styled components for layout
  const ContactContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 200px)', // Adjust based on your header/footer height
    padding: '24px',
  });
  
  const SingleCardContainer = styled('div')({
    width: '100%',
    maxWidth: '800px',
  });

  const ContactCard = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    height: '100%',
    boxShadow: theme.shadows[2],
    alignItems: 'center',
    textAlign: 'center',
  }));

  const ContactItem = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '16px',
    gap: '8px',
    width: '100%',
  });

  const ContactIcon = styled(Box)(({ theme }) => ({
    color: theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    minWidth: '48px',
    borderRadius: '50%',
    backgroundColor: theme.palette.action.hover,
    '& .MuiSvgIcon-root': {
      fontSize: '1.75rem',
    }
  }));

  const LocationLink = styled('a')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'inherit',
    '&:hover $icon': {
      transform: 'scale(1.1)',
    },
  }));
  
  const LocationIcon = styled(ContactIcon)({
    width: '48px',
    height: '48px',
    transition: 'transform 0.2s',
  });

  const ContactText = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
  });

  const SectionTitle = styled(Typography)({
    marginBottom: '16px',
    fontWeight: 600,
  });

  return (
    <Container maxWidth="lg" sx={{ pt: 1, pb: 6 }}>
      <ContactContainer>
        <SingleCardContainer>
        {/* Contact Information */}
        <ContactCard>
          <SectionTitle variant="h4">Contact Information</SectionTitle>
          
          <ContactItem>
            <ContactIcon>
              <Business />
            </ContactIcon>
            <ContactText>
              <Typography variant="h5" component="div" fontWeight={600} sx={{ lineHeight: 1.2, mb: 0.5 }}>
                {contactInfo.companyName}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 600 }}>
                {contactInfo.yourName}
              </Typography>
            </ContactText>
          </ContactItem>
          
          <ContactItem>
            <ContactIcon>
              <LocationOn />
            </ContactIcon>
            <ContactText>
              <Typography variant="body1">
                {contactInfo.address.street}<br />
                {contactInfo.address.city}, {contactInfo.address.state}<br />
                {contactInfo.address.postalCode}, {contactInfo.address.country}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <LocationLink 
                  href={'https://maps.app.goo.gl/16yGoG8DAiFu7dfW9'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                >
                  <LocationIcon>
                    <LocationOn fontSize="large" />
                  </LocationIcon>
                  <Typography variant="body2" color="primary" sx={{ mt: 1, textAlign: 'center' }}>
                    View on Google Maps
                  </Typography>
                </LocationLink>
              </Box>
            </ContactText>
          </ContactItem>
          
          <ContactItem>
            <ContactIcon>
              <Phone />
            </ContactIcon>
            <ContactText>
              <Typography variant="body1">
                <Link href={`tel:${contactInfo.phone.replace(/[^0-9+]/g, '')}`} color="inherit" underline="hover">
                  {contactInfo.phone}
                </Link>
                <br />
                <Link href={`tel:${contactInfo.mobile.replace(/[^0-9+]/g, '')}`} color="inherit" underline="hover">
                  {contactInfo.mobile}
                </Link>
              </Typography>
            </ContactText>
          </ContactItem>
          
          <ContactItem>
            <ContactIcon>
              <Email />
            </ContactIcon>
            <ContactText>
              <Typography variant="body1">
                <Link href={`mailto:${contactInfo.email}`} color="inherit" underline="hover">
                  {contactInfo.email}
                </Link>
              </Typography>
            </ContactText>
          </ContactItem>
          
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" color="text.secondary">
              Working Hours:
            </Typography>
            <Typography variant="body1">
              {contactInfo.workingHours}
            </Typography>
          </Box>
        </ContactCard>
      </SingleCardContainer>
    </ContactContainer>
    </Container>
  );
};

export default ContactPage;

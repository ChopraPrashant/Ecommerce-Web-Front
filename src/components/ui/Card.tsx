import React, { forwardRef, ReactNode } from 'react';
import {
  Card as MuiCard,
  CardProps as MuiCardProps,
  CardContent,
  CardMedia,
  CardHeader,
  CardActions,
  CardActionArea,
  Typography,
  Box,
  styled,
  SxProps,
  Theme,
  useTheme,
} from '@mui/material';

type CardVariant = 'elevation' | 'outlined' | 'filled';
type CardElevation = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24;

interface CardBaseProps extends Omit<MuiCardProps, 'variant'> {
  variant?: CardVariant;
  elevation?: CardElevation;
  hoverElevation?: CardElevation;
  square?: boolean;
  sx?: SxProps<Theme>;
}

interface CardProps extends Omit<CardBaseProps, 'content' | 'variant'> {
  variant?: CardVariant; // Add variant back to CardProps
  media?: {
    component?: React.ElementType;
    image: string;
    alt?: string; // Add alt property
    content?: React.ReactNode;
    height?: number | string;
    aspectRatio?: string;
    sx?: SxProps<Theme>;
  };
  header?: {
    title: ReactNode;
    subheader?: ReactNode;
    avatar?: ReactNode;
    action?: ReactNode;
    titleTypographyProps?: any;
    subheaderTypographyProps?: any;
    sx?: SxProps<Theme>;
  };
  content?: {
    children: ReactNode;
    sx?: SxProps<Theme>;
  };
  actions?: {
    children: ReactNode;
    position?: 'top' | 'bottom' | 'sticky' | 'sticky-bottom';
    disableSpacing?: boolean;
    sx?: SxProps<Theme>;
  };
  actionArea?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}

const StyledCard = styled(MuiCard, {
  shouldForwardProp: (prop) => !['hoverElevation', 'square'].includes(prop as string),
})<{ hoverElevation?: CardElevation; square?: boolean }>(
  ({ theme, hoverElevation, square, elevation = 0 }) => ({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: square ? 0 : theme.shape.borderRadius,
    transition: theme.transitions.create(['box-shadow', 'transform'], {
      duration: theme.transitions.duration.shorter,
    }),
    '&:hover': {
      ...(hoverElevation !== undefined && {
        boxShadow: theme.shadows[hoverElevation],
        transform: 'translateY(-2px)',
      }),
    },
    ...(elevation && {
      boxShadow: theme.shadows[elevation],
    }),
  })
);

const StyledCardActions = styled(CardActions, {
  shouldForwardProp: (prop) => !['position'].includes(prop as string),
})<{ position?: 'top' | 'bottom' | 'sticky' | 'sticky-bottom' }>(
  ({ theme, position = 'bottom', disableSpacing }) => ({
    padding: theme.spacing(1, 2, 2, 2),
    marginTop: 'auto',
    ...(position === 'sticky' && {
      position: 'sticky',
      top: 0,
      zIndex: 1,
      backgroundColor: theme.palette.background.paper,
      borderBottom: `1px solid ${theme.palette.divider}`,
    }),
    ...(position === 'sticky-bottom' && {
      position: 'sticky',
      bottom: 0,
      zIndex: 1,
      backgroundColor: theme.palette.background.paper,
      borderTop: `1px solid ${theme.palette.divider}`,
    }),
    ...(position === 'top' && {
      order: -1,
      marginTop: 0,
      marginBottom: 'auto',
    }),
    ...(!disableSpacing && {
      '& > :not(:first-of-type)': {
        marginLeft: theme.spacing(1),
      },
    }),
  })
);

const Card = forwardRef<HTMLDivElement, CardProps>(({
  variant = 'elevation',
  elevation = 0,
  hoverElevation,
  square = false,
  media,
  header,
  content,
  actions,
  actionArea = false,
  onClick,
  children,
  sx,
  ...props
}, ref) => {
  const theme = useTheme();
  
  const renderMedia = () => {
    if (!media) return null;
    
    const {
      component = 'img',
      image,
      alt = '',
      height = 200,
      aspectRatio = '16/9',
      sx: mediaSx,
      ...mediaProps
    } = media;
    
    return (
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 0,
          paddingTop: `calc(100% / (${aspectRatio}))`,
          overflow: 'hidden',
          ...(mediaSx as any),
        }}
      >
        <CardMedia
          component={component as any}
          image={image}
          alt={alt}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          {...mediaProps}
        />
      </Box>
    );
  };

  const renderHeader = () => {
    if (!header) return null;
    return (
      <CardHeader
        title={header.title}
        subheader={header.subheader}
        avatar={header.avatar}
        action={header.action}
        titleTypographyProps={header.titleTypographyProps}
        subheaderTypographyProps={header.subheaderTypographyProps}
        sx={{
          '& .MuiCardHeader-content': {
            overflow: 'hidden',
          },
          '& .MuiCardHeader-title, & .MuiCardHeader-subheader': {
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          },
          ...header.sx,
        }}
      />
    );
  };

  const renderContent = () => {
    if (content) {
      return <CardContent sx={{ flexGrow: 1, ...content.sx }}>{content.children}</CardContent>;
    }
    return null;
  };

  const renderActions = () => {
    if (!actions) return null;
    return (
      <StyledCardActions 
        disableSpacing={actions.disableSpacing} 
        position={actions.position}
        sx={actions.sx}
      >
        {actions.children}
      </StyledCardActions>
    );
  };

  const renderCardContent = () => (
    <>
      {renderHeader()}
      {renderMedia()}
      {renderContent()}
      {children}
      {renderActions()}
    </>
  );

  // Ensure variant is one of the allowed values
  const cardVariant = (variant === 'filled' ? 'elevation' : variant) as 'elevation' | 'outlined' | undefined;

  return (
    <StyledCard
      ref={ref}
      variant={cardVariant}
      elevation={elevation}
      hoverElevation={hoverElevation}
      square={square}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
      {...props}
    >
      {actionArea ? (
        <CardActionArea onClick={onClick}>
          {renderCardContent()}
        </CardActionArea>
      ) : (
        renderCardContent()
      )}
    </StyledCard>
  );
});

Card.displayName = 'Card';

export default Card;

// Example usage:
/*
<Card
  variant="outlined"
  sx={{ maxWidth: 345, m: 2 }}
  media={{
    image: '/static/images/cards/contemplative-reptile.jpg',
    alt: 'Green iguana',
    aspectRatio: '4/3',
  }}
  header={{
    title: 'Lizard',
    subheader: 'September 14, 2021',
    action: <IconButton aria-label="settings"><MoreVertIcon /></IconButton>,
  }}
  content={{
    children: (
      <Typography variant="body2" color="text.secondary">
        Lizards are a widespread group of squamate reptiles, with over 6,000 species.
      </Typography>
    ),
  }}
  actions={{
    children: [
      <Button size="small" key="share">Share</Button>,
      <Button size="small" key="learn-more">Learn More</Button>,
    ],
  }}
  actionArea
  onClick={() => console.log('Card clicked!')}
/>
*/

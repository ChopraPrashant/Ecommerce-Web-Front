import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
  Slider,
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Collapse,
  Divider,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { ICategory, IBrand } from '../../types/product';

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    marginBottom: theme.spacing(2),
  },
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: 0,
    '&:not(:last-child)': {
      marginBottom: theme.spacing(2),
    },
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  padding: theme.spacing(0, 2),
  minHeight: '48px !important',
  '&.Mui-expanded': {
    minHeight: '48px !important',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  '& .MuiAccordionSummary-content': {
    margin: theme.spacing(1, 0),
    '&.Mui-expanded': {
      margin: theme.spacing(1, 0),
    },
  },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingTop: 0,
}));

interface FilterOption {
  id: string;
  label: string;
  count?: number;
  selected?: boolean;
}

interface PriceRange {
  min: number;
  max: number;
}

interface ProductFiltersProps {
  categories: ICategory[];
  brands: IBrand[];
  priceRange: PriceRange;
  selectedPriceRange: PriceRange;
  onPriceRangeChange: (range: PriceRange) => void;
  selectedCategories: string[];
  onCategoryToggle: (categoryId: string) => void;
  selectedBrands: string[];
  onBrandToggle: (brandId: string) => void;
  selectedRatings: number[];
  onRatingToggle: (rating: number) => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onResetFilters: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  categoryCounts?: Record<string, number>;
  brandCounts?: Record<string, number>;
  loading?: boolean;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories = [],
  brands = [],
  priceRange = { min: 0, max: 1000 },
  selectedPriceRange = { min: 0, max: 1000 },
  onPriceRangeChange,
  selectedCategories = [],
  onCategoryToggle,
  selectedBrands = [],
  onBrandToggle,
  selectedRatings = [],
  onRatingToggle,
  sortBy = 'featured',
  onSortChange,
  searchQuery = '',
  onSearchChange,
  onResetFilters,
  mobileOpen = false,
  onMobileClose,
  categoryCounts = {},
  brandCounts = {},
  loading = false,
}) => {
  const theme = useTheme();
  const isMobile = useTheme().breakpoints.down('md');
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([
    selectedPriceRange.min,
    selectedPriceRange.max,
  ]);

  // Update local state when props change
  useEffect(() => {
    setLocalPriceRange([selectedPriceRange.min, selectedPriceRange.max]);
  }, [selectedPriceRange]);

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setLocalPriceRange(newValue as [number, number]);
  };

  const handlePriceChangeCommitted = (
    event: React.SyntheticEvent | Event,
    newValue: number | number[]
  ) => {
    const [min, max] = newValue as [number, number];
    onPriceRangeChange({ min, max });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearchQuery.trim());
  };

  const renderRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <StarIcon key={i} color="primary" fontSize="small" />
        ) : (
          <StarBorderIcon key={i} fontSize="small" />
        )
      );
    }
    return (
      <Box display="flex" alignItems="center">
        {stars}
        <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
          & Up
        </Typography>
      </Box>
    );
  };

  const filterContent = (
    <Box>
      {/* Search */}
      <form onSubmit={handleSearchSubmit}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search products..."
          value={localSearchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: localSearchQuery && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => {
                    setLocalSearchQuery('');
                    onSearchChange('');
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </form>

      {/* Price Range */}
      <StyledAccordion defaultExpanded>
        <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">Price Range</Typography>
        </StyledAccordionSummary>
        <StyledAccordionDetails>
          <Box px={1}>
            <Slider
              value={localPriceRange}
              onChange={handlePriceChange}
              onChangeCommitted={handlePriceChangeCommitted}
              valueLabelDisplay="auto"
              min={priceRange.min}
              max={priceRange.max}
              valueLabelFormat={(value) => `$${value}`}
              aria-labelledby="range-slider"
              disabled={loading}
            />
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Typography variant="body2" color="textSecondary">
                ${localPriceRange[0]}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                ${localPriceRange[1]}
              </Typography>
            </Box>
          </Box>
        </StyledAccordionDetails>
      </StyledAccordion>

      {/* Categories */}
      <StyledAccordion defaultExpanded>
        <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">Categories</Typography>
        </StyledAccordionSummary>
        <StyledAccordionDetails>
          <FormGroup>
            {categories.map((category) => (
              <FormControlLabel
                key={category._id}
                control={
                  <Checkbox
                    size="small"
                    checked={selectedCategories.includes(category._id)}
                    onChange={() => onCategoryToggle(category._id)}
                    name={category.name}
                    disabled={loading}
                  />
                }
                label={
                  <Box display="flex" justifyContent="space-between" width="100%">
                    <Typography variant="body2">{category.name}</Typography>
                    {categoryCounts[category._id] !== undefined && (
                      <Typography variant="caption" color="textSecondary">
                        ({categoryCounts[category._id]})
                      </Typography>
                    )}
                  </Box>
                }
                sx={{ ml: 0, mr: 0 }}
              />
            ))}
          </FormGroup>
        </StyledAccordionDetails>
      </StyledAccordion>

      {/* Brands */}
      {brands.length > 0 && (
        <StyledAccordion defaultExpanded>
          <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">Brands</Typography>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <FormGroup>
              {brands.map((brand) => (
                <FormControlLabel
                  key={brand._id}
                  control={
                    <Checkbox
                      size="small"
                      checked={selectedBrands.includes(brand._id)}
                      onChange={() => onBrandToggle(brand._id)}
                      name={brand.name}
                      disabled={loading}
                    />
                  }
                  label={
                    <Box display="flex" justifyContent="space-between" width="100%">
                      <Typography variant="body2">{brand.name}</Typography>
                      {brandCounts[brand._id] !== undefined && (
                        <Typography variant="caption" color="textSecondary">
                          ({brandCounts[brand._id]})
                        </Typography>
                      )}
                    </Box>
                  }
                  sx={{ ml: 0, mr: 0 }}
                />
              ))}
            </FormGroup>
          </StyledAccordionDetails>
        </StyledAccordion>
      )}

      {/* Ratings */}
      <StyledAccordion defaultExpanded>
        <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">Customer Review</Typography>
        </StyledAccordionSummary>
        <StyledAccordionDetails>
          <FormGroup>
            {[5, 4, 3, 2, 1].map((rating) => (
              <FormControlLabel
                key={rating}
                control={
                  <Checkbox
                    size="small"
                    checked={selectedRatings.includes(rating)}
                    onChange={() => onRatingToggle(rating)}
                    name={`rating-${rating}`}
                    disabled={loading}
                  />
                }
                label={renderRatingStars(rating)}
                sx={{ ml: 0, mr: 0, mb: 0.5 }}
              />
            ))}
          </FormGroup>
        </StyledAccordionDetails>
      </StyledAccordion>

      {/* Sort By */}
      <StyledAccordion defaultExpanded>
        <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">Sort By</Typography>
        </StyledAccordionSummary>
        <StyledAccordionDetails>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              aria-label="sort-by"
              name="sort-by"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
            >
              <FormControlLabel
                value="featured"
                control={<Radio size="small" disabled={loading} />}
                label="Featured"
                sx={{ mb: 0.5 }}
              />
              <FormControlLabel
                value="newest"
                control={<Radio size="small" disabled={loading} />}
                label="Newest"
                sx={{ mb: 0.5 }}
              />
              <FormControlLabel
                value="price-asc"
                control={<Radio size="small" disabled={loading} />}
                label="Price: Low to High"
                sx={{ mb: 0.5 }}
              />
              <FormControlLabel
                value="price-desc"
                control={<Radio size="small" disabled={loading} />}
                label="Price: High to Low"
                sx={{ mb: 0.5 }}
              />
              <FormControlLabel
                value="top-rated"
                control={<Radio size="small" disabled={loading} />}
                label="Top Rated"
                sx={{ mb: 0.5 }}
              />
            </RadioGroup>
          </FormControl>
        </StyledAccordionDetails>
      </StyledAccordion>

      {/* Reset Filters */}
      <Button
        fullWidth
        variant="outlined"
        color="primary"
        onClick={onResetFilters}
        disabled={
          loading ||
          (selectedCategories.length === 0 &&
            selectedBrands.length === 0 &&
            selectedRatings.length === 0 &&
            (selectedPriceRange.min !== priceRange.min ||
              selectedPriceRange.max !== priceRange.max) &&
            sortBy === 'featured')
        }
        sx={{ mt: 2 }}
      >
        Reset Filters
      </Button>
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: (theme) => theme.zIndex.drawer + 1,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            opacity: mobileOpen ? 1 : 0,
            visibility: mobileOpen ? 'visible' : 'hidden',
            transition: 'all 0.3s ease-in-out',
          }}
          onClick={onMobileClose}
        />
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: '85%',
            maxWidth: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            zIndex: (theme) => theme.zIndex.drawer + 2,
            transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s ease-in-out',
            overflowY: 'auto',
            p: 2,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={onMobileClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          {filterContent}
        </Box>
      </>
    );
  }

  return (
    <Box
      sx={{
        position: 'sticky',
        top: theme.spacing(2),
        alignSelf: 'flex-start',
        width: 280,
        flexShrink: 0,
        mr: 3,
        [theme.breakpoints.down('md')]: {
          display: 'none',
        },
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        mb={2}
        sx={{ display: { xs: 'flex', md: 'none' } }}
      >
        <FilterListIcon color="action" sx={{ mr: 1 }} />
        <Typography variant="h6">Filters</Typography>
      </Box>
      {filterContent}
    </Box>
  );
};

export default ProductFilters;

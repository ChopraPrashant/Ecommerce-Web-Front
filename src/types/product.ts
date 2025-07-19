export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: string | ICategory;
  children?: ICategory[];
  isActive?: boolean;
  image?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface IBrand {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  isActive?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface IProductImage {
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

export interface IProductVariant {
  _id: string;
  name: string;
  sku: string;
  price: number;
  originalPrice: number;
  stock: number;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: string;
  };
  attributes: Record<string, string>;
  images: IProductImage[];
  isActive: boolean;
}

export interface IProductAttribute {
  name: string;
  values: string[];
  isVariant: boolean;
  isFilterable: boolean;
}

export interface IProductReview {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
  verifiedPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  sku: string;
  price: number;
  originalPrice: number;
  discountPercentage?: number;
  discount?: number;
  stock: number;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: string;
  };
  images: IProductImage[];
  categories: ICategory[];
  brand?: IBrand;
  tags?: string[];
  variants: IProductVariant[];
  attributes: IProductAttribute[];
  reviews: IProductReview[];
  rating?: number;
  averageRating?: number;
  reviewCount?: number;
  numReviews?: number;
  isFeatured?: boolean;
  isActive: boolean;
  onSale?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IProductFilter {
  categories?: string[];
  priceRange?: { min: number; max: number };
  ratings?: number[];
  attributes?: Record<string, string[]>;
  sortBy?: 'price' | 'rating' | 'createdAt' | 'name';
  sortOrder?: 'asc' | 'desc';
  inStock?: boolean;
  onSale?: boolean;
}

export interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IProductListResponse {
  products: IProduct[];
  pagination: IPagination;
  filters: {
    categories: Array<{ _id: string; name: string; count: number }>;
    priceRange: { min: number; max: number };
    ratings: Array<{ rating: number; count: number }>;
    attributes: Record<string, Array<{ value: string; count: number }>>;
  };
}

export interface IReviewInput {
  rating: number;
  title?: string;
  comment?: string;
  images?: File[];
}

export interface IProductQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  onSale?: boolean;
  [key: string]: string | number | boolean | undefined;
}

import { IProduct } from './product';

export interface ICartItem {
  _id: string;
  product: string | IProduct;
  variant?: string;
  quantity: number;
  price: number;
  discount?: number;
  attributes?: Record<string, string>;
  name: string;
  image?: string;
  stock: number;
  sku: string;
  weight?: number;
}

export interface ICartCoupon {
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  description?: string;
}

export interface ICartTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
}

export interface ICart {
  _id: string;
  user: string;
  items: ICartItem[];
  coupon?: ICartCoupon;
  totals: ICartTotals;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddToCartData {
  productId: string;
  variantId?: string;
  quantity: number;
  attributes?: Record<string, string>;
}

export interface IUpdateCartItemData {
  itemId: string;
  quantity: number;
}

export interface IApplyCouponData {
  code: string;
}

export interface ICartResponse {
  success: boolean;
  cart: ICart;
  message?: string;
}

export interface ICartError {
  success: boolean;
  message: string;
  error?: any;
  code?: string;
}

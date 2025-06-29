import { IUserAddress } from './user';
import { IProduct } from './product';

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
export type PaymentMethod = 'credit_card' | 'paypal' | 'stripe' | 'cod' | 'bank_transfer';

export interface IOrderItem {
  _id: string;
  product: string | IProduct;
  variant?: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
  total: number;
  weight?: number;
  image?: string;
  attributes?: Record<string, string>;
  returnEligible: boolean;
  returnRequested: boolean;
  returnStatus?: 'requested' | 'approved' | 'rejected' | 'received' | 'refunded';
  returnReason?: string;
  returnNotes?: string;
  returnDate?: Date;
}

export interface IOrderAddress extends Omit<IUserAddress, '_id' | 'isDefault' | 'addressType'> {
  _id: string;
}

export interface IOrderPayment {
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paymentIntentId?: string;
  paymentDate?: Date;
  amount: number;
  currency: string;
  cardLast4?: string;
  cardBrand?: string;
  receiptUrl?: string;
  billingAddress: IOrderAddress;
}

export interface IOrderShipping {
  method: string;
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
  cost: number;
  address: IOrderAddress;
  estimatedDelivery?: Date;
  shippedDate?: Date;
  deliveredDate?: Date;
}

export interface IOrderTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  taxRate: number;
}

export interface IOrderCoupon {
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  discount: number;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  user: string;
  items: IOrderItem[];
  status: OrderStatus;
  payment: IOrderPayment;
  shipping: IOrderShipping;
  totals: IOrderTotals;
  coupon?: IOrderCoupon;
  notes?: string;
  customerNote?: string;
  ipAddress: string;
  userAgent: string;
  currency: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateOrderData {
  shippingAddress: string | IUserAddress;
  billingAddress?: string | IUserAddress;
  shippingMethod: string;
  paymentMethod: PaymentMethod;
  paymentIntentId?: string;
  saveBillingAddress?: boolean;
  saveShippingAddress?: boolean;
  customerNote?: string;
  couponCode?: string;
}

export interface IOrderQueryParams {
  page?: number;
  limit?: number;
  status?: OrderStatus | OrderStatus[];
  sortBy?: 'createdAt' | 'updatedAt' | 'total';
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface IOrderResponse {
  success: boolean;
  order: IOrder;
  message?: string;
}

export interface IOrderListResponse {
  success: boolean;
  orders: IOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IOrderError {
  success: boolean;
  message: string;
  error?: any;
  code?: string;
}

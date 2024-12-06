import { api } from '../api';
import { CartItem } from '../../components/sales/types';

export interface Sale {
  _id: string;
  store: string;
  items: Array<{
    product: {
      _id: string;
      name: string;
      price: number;
    } | null;
    quantity: number;
    modifiers: Array<{
      name: string;
      option: {
        name: string;
        price: number;
      };
    }>;
    discounts: Array<{
      name: string;
      type: 'percentage' | 'fixed';
      value: number;
    }>;
    price: number;
  }>;
  total: number;
  paymentMethod: 'cash' | 'card' | 'qr';
  paymentDetails: any;
  status: 'completed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export interface CreateSaleRequest {
  store: string;
  items: Array<{
    product: string;
    quantity: number;
    modifiers: Array<{
      name: string;
      option: {
        name: string;
        price: number;
      };
    }>;
    discounts: Array<{
      name: string;
      type: 'percentage' | 'fixed';
      value: number;
    }>;
    price: number;
  }>;
  total: number;
  paymentMethod: 'cash' | 'card' | 'qr';
  paymentDetails: any;
}

export interface SaleMetrics {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
}

export const saleApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createSale: builder.mutation<Sale, CreateSaleRequest>({
      query: (saleData) => ({
        url: 'sales',
        method: 'POST',
        body: saleData,
      }),
      invalidatesTags: ['Sales', 'Products'], // Add 'Products' to invalidate the products cache
    }),
    getSales: builder.query<Sale[], string>({
      query: (storeId) => `sales/${storeId}`,
      providesTags: ['Sales'],
    }),
    getSaleMetrics: builder.query<SaleMetrics, { storeId: string; startDate: string; endDate: string }>({
      query: ({ storeId, startDate, endDate }) => 
        `sales/${storeId}/metrics?startDate=${startDate}&endDate=${endDate}`,
      providesTags: ['Sales'],
    }),
    refundSale: builder.mutation<Sale, string>({
      query: (saleId) => ({
        url: `sales/${saleId}/refund`,
        method: 'POST',
      }),
      invalidatesTags: ['Sales', 'Products'], // Add 'Products' to invalidate the products cache
    }),
  }),
});

export const {
  useCreateSaleMutation,
  useGetSalesQuery,
  useGetSaleMetricsQuery,
  useRefundSaleMutation,
} = saleApi;
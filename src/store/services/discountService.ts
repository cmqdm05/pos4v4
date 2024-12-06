import { api } from '../api';

export interface Discount {
  _id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  startDate: string;
  endDate: string;
  minPurchase?: number;
  maxDiscount?: number;
  applicableProducts: string[];
  active: boolean;
  store: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiscountRequest {
  name: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  startDate: string;
  endDate: string;
  minPurchase?: number;
  maxDiscount?: number;
  applicableProducts?: string[];
  active: boolean;
  store: string;
}

export const discountApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDiscounts: builder.query<Discount[], string>({
      query: (storeId) => `discounts/${storeId}`,
      providesTags: ['Discounts'],
    }),
    createDiscount: builder.mutation<Discount, CreateDiscountRequest>({
      query: (discountData) => ({
        url: 'discounts',
        method: 'POST',
        body: discountData,
      }),
      invalidatesTags: ['Discounts'],
    }),
    updateDiscount: builder.mutation<Discount, Partial<Discount> & Pick<Discount, '_id'>>({
      query: ({ _id, ...patch }) => ({
        url: `discounts/${_id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Discounts'],
    }),
    deleteDiscount: builder.mutation<void, string>({
      query: (id) => ({
        url: `discounts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Discounts'],
    }),
  }),
});

export const {
  useGetDiscountsQuery,
  useCreateDiscountMutation,
  useUpdateDiscountMutation,
  useDeleteDiscountMutation,
} = discountApi;
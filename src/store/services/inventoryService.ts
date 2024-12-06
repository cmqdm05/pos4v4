import { api } from '../api';

export interface StockMovement {
  _id: string;
  product: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  reference?: string;
  store: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockAlert {
  _id: string;
  product: string;
  store: string;
  type: 'low_stock' | 'out_of_stock';
  threshold: number;
  status: 'active' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

export const inventoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStockMovements: builder.query<StockMovement[], string>({
      query: (storeId) => `inventory/movements/${storeId}`,
      providesTags: ['Inventory'],
    }),
    addStockMovement: builder.mutation<StockMovement, Partial<StockMovement>>({
      query: (movement) => ({
        url: 'inventory/movements',
        method: 'POST',
        body: movement,
      }),
      invalidatesTags: ['Inventory', 'Products'],
    }),
    getStockAlerts: builder.query<StockAlert[], string>({
      query: (storeId) => `inventory/alerts/${storeId}`,
      providesTags: ['Inventory'],
    }),
    updateStockAlert: builder.mutation<StockAlert, Partial<StockAlert> & Pick<StockAlert, '_id'>>({
      query: ({ _id, ...patch }) => ({
        url: `inventory/alerts/${_id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Inventory'],
    }),
  }),
});

export const {
  useGetStockMovementsQuery,
  useAddStockMovementMutation,
  useGetStockAlertsQuery,
  useUpdateStockAlertMutation,
} = inventoryApi;
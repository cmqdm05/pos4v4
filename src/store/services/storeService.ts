import { api } from '../api';
import { createNotification, getStoreCreatedMessage } from '../../utils/notification';

export interface Store {
  _id: string;
  name: string;
  address: string;
  phone: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStoreRequest {
  name: string;
  address: string;
  phone: string;
}

export const storeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createStore: builder.mutation<Store, CreateStoreRequest>({
      query: (storeData) => ({
        url: 'stores',
        method: 'POST',
        body: storeData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          await createNotification(dispatch, getStoreCreatedMessage(data.name));
        } catch (error) {
          // Handle error if needed
        }
      },
      invalidatesTags: ['Stores'],
    }),
    getStores: builder.query<Store[], void>({
      query: () => 'stores',
      providesTags: ['Stores'],
      transformResponse: (response: Store[]) => {
        return [...response].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },
    }),
    getStore: builder.query<Store, string>({
      query: (id) => `stores/${id}`,
      providesTags: (result, error, id) => [{ type: 'Stores', id }],
    }),
    updateStore: builder.mutation<Store, Partial<Store> & Pick<Store, '_id'>>({
      query: ({ _id, ...patch }) => ({
        url: `stores/${_id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { _id }) => [
        { type: 'Stores', id: _id },
        'Stores',
      ],
    }),
    deleteStore: builder.mutation<void, string>({
      query: (id) => ({
        url: `stores/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Stores'],
    }),
  }),
});

export const {
  useCreateStoreMutation,
  useGetStoresQuery,
  useGetStoreQuery,
  useUpdateStoreMutation,
  useDeleteStoreMutation,
} = storeApi;
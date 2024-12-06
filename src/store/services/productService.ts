import { api } from "../api";
// import { createNotification, getLowStockMessage } from '../../utils/notifications';
import { createNotification, getLowStockMessage } from "../../utils/notification";

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  store: string;
  stock: number;
  image?: string;
  modifiers?: Array<{
    name: string;
    options: Array<{
      name: string;
      price: number;
    }>;
  }>;
  discounts?: Array<{
    name: string;
    type: "percentage" | "fixed";
    value: number;
    startDate: string;
    endDate: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  category: string;
  store: string;
  stock: number;
  image?: string;
  modifiers?: Product["modifiers"];
  discounts?: Product["discounts"];
}

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], string>({
      query: (storeId) => `products/${storeId}`,
      providesTags: ["Products"],
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        try {
          await cacheDataLoaded;

          const checkLowStock = (products: Product[]) => {
            products.forEach((product) => {
              if (product.stock <= 10) {
                createNotification(
                  dispatch,
                  getLowStockMessage(product.name, product.stock),
                  'alert',
                  product.store
                );
              }
            });
          };

          checkLowStock(await cacheDataLoaded);

          await cacheEntryRemoved;
        } catch {
          // Handle error if needed
        }
      },
    }),
    createProduct: builder.mutation<Product, CreateProductRequest>({
      query: (productData) => ({
        url: "products",
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation<
      Product,
      Partial<Product> & Pick<Product, "_id">
    >({
      query: ({ _id, ...patch }) => ({
        url: `products/${_id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products", "Categories", "Inventory"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
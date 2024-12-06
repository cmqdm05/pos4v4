import { api } from "../api";
import { createNotification, getRoleCreatedMessage } from '../../utils/notification';

export interface Permission {
  name: string;
  description?: string;
  module: "sales" | "inventory" | "reports" | "users" | "settings";
}

export interface Role {
  _id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  store: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  permissions: Permission[];
  store: string;
  isDefault?: boolean;
}

export const roleApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<Role[], string>({
      query: (storeId) => `roles/${storeId}`,
      providesTags: ["Roles"],
    }),
    createRole: builder.mutation<Role, CreateRoleRequest>({
      query: (roleData) => ({
        url: "roles",
        method: "POST",
        body: roleData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          await createNotification(
            dispatch,
            getRoleCreatedMessage(data.name),
            'system',
            data.store
          );
        } catch (error) {
          // Handle error if needed
        }
      },
      invalidatesTags: ["Roles"],
    }),
    updateRole: builder.mutation<Role, Partial<Role> & Pick<Role, "_id">>({
      query: ({ _id, ...patch }) => ({
        url: `roles/${_id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["Roles"],
    }),
    deleteRole: builder.mutation<void, string>({
      query: (id) => ({
        url: `roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Roles"],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = roleApi;
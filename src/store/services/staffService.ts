import { api } from "../api";
import { Role } from "./roleService";
import { createNotification, getStaffLoginMessage } from "../../utils/notification";

export interface Staff {
  _id: string;
  name: string;
  email: string;
  role: Role;
  store: string;
  status: "active" | "inactive";
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  store: string;
}

export interface StaffLoginRequest {
  email: string;
  password: string;
}

export const staffApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStaff: builder.query<Staff[], string>({
      query: (storeId) => `staff/${storeId}`,
      providesTags: ["Staff"],
    }),
    createStaff: builder.mutation<Staff, CreateStaffRequest>({
      query: (staffData) => ({
        url: "staff",
        method: "POST",
        body: staffData,
      }),
      invalidatesTags: ["Staff"],
    }),
    updateStaff: builder.mutation<Staff, Partial<Staff> & Pick<Staff, "_id">>({
      query: ({ _id, ...patch }) => ({
        url: `staff/${_id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["Staff"],
    }),
    deleteStaff: builder.mutation<void, string>({
      query: (id) => ({
        url: `staff/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Staff"],
    }),
    staffLogin: builder.mutation<Staff & { token: string }, StaffLoginRequest>({
      query: (credentials) => ({
        url: "staff/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          await createNotification(
            dispatch,
            getStaffLoginMessage(data.name),
            'system',
            data.store
          );
        } catch (error) {
          // Handle error if needed
        }
      },
    }),
  }),
});

export const {
  useGetStaffQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
  useStaffLoginMutation,
} = staffApi;
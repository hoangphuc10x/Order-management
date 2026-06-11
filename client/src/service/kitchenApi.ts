import { OrderedOfTable } from "./orderApi";
import { rootApi } from "./rootApi";
import { Table } from "./tableApi";
export interface OrderItem {
  _id: string;
  orderId: string;
  itemId: string;
  name: string;
  quantity: number;
  status: string;
  tableNumber: string;
  orderItemId: string;
  createdAt: string;
  updatedAt: string;
  categoryId?: string;
  categoryName?: string;
  difficultyLevel?: number;
  userId?: string;
  fulname?: string;
  __v?: number;
}

interface ApiResponse {
  success: boolean;
  result: OrderItem[];
}

interface SummaryFood {
  success: boolean;
  data: Item[];
}
interface Chef {
  _id: string;
  fulname: string;
  status: string;
}
export interface Item {
  itemId: string;
  name: string;
  quantity: number;
  status: "PENDING" | "PROCESSING"; // Assuming the status can be either 'PENDING' or 'PROCESSING'
  updatedAt: string; // Date as a string (ISO format)
  orderIds: string[];
  tableNumbers: string[];
  categoryId: string;
  note?: string;
  kitchenIds: string[];
  orderItemIds: string[]; // Assuming kitchenIds is an array of strings
  // Optional field (some items have a note, some don't)
}
export interface OrderDetail {
  _id: string;
  orderId: string;
  tableNumber: string;
  quantity: number;
  status: "PENDING" | "PROCESSING"; // Assuming the status can be 'PENDING' or 'PROCESSING'
  note?: string; // Optional field (some orders may not have a note)
}

export const kitchenApi = rootApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getAllOrderForKitchen: builder.query<ApiResponse, void>({
        query: () => "/kitchens/get-all",
        providesTags: [{ type: "CHEF" }],
      }),

      // Món được giao cho chính đầu bếp đang đăng nhập (lấy theo token)
      getMyKitchenItems: builder.query<ApiResponse, void>({
        query: () => "/kitchens/my-items",
        providesTags: [{ type: "CHEF" }],
      }),

      updateOrderStatus: builder.mutation<
        void,
        { orderItemIds: string[]; status: string; orderId?: string }
      >({
        query: ({ orderItemIds, status, orderId }) => ({
          url: `/kitchens/update-status`, // Dùng _id trong URL
          method: "PATCH",
          body: { status, orderItemIds, orderId }, // Cập nhật trạng thái trong body
        }),
        invalidatesTags: ["DUPITIEM", "CHEF"],
      }),
      updateOrderItemStatus: builder.mutation<
        void,
        { itemId: string; status: string; orderIds: string[] }
      >({
        query: ({ orderIds, status, itemId }) => ({
          url: `/kitchens/update-item-status`, // Dùng _id trong URL
          method: "PATCH",
          body: { orderIds, status, itemId }, // Cập nhật trạng thái trong body
        }),
        invalidatesTags: [{ type: "ORDER" }],
      }),
      getAllOrderDiplicate: builder.query<SummaryFood, void>({
        query: () => "/kitchens/summary-food",
        providesTags: [{ type: "DUPITIEM" }, { type: "CHEF" }],
      }),
      getItemForTable: builder.query<
        OrderDetail[],
        { itemId: string; status: string }
      >({
        query: ({ itemId, status }) => ({
          url: `/kitchens/orders-of-item`,
          params: { itemId, status },
          method: "GET",
        }),
      }),
      getItemByCategoryId: builder.query<OrderItem[], { id: string }>({
        query: ({ id }) => `/kitchens/get-items-by-categoryId/${id}`,
        providesTags: [{ type: "CHEF" }, { type: "DUPITIEM" }],
      }),
      getAllChefForCooking: builder.query<Chef[], void>({
        query: () => "/kitchens/get-all-chef-cooking",
        providesTags: [{ type: "CHEF" }],
      }),
      chooseChefForCooking: builder.mutation<
        void,
        { userId: string; orderItemIds: string[] }
      >({
        query: ({ userId, orderItemIds }) => ({
          url: "/kitchens/assign-chef-cooking", // Dùng _id trong URL
          method: "PATCH",
          body: { orderItemIds, userId }, // Cập nhật trạng thái trong body
        }),
        invalidatesTags: ["CHEF", "DUPITIEM"],
      }),
      getOreredOfTableStaff: builder.query<OrderedOfTable, string>({
        query: (id) => `/kitchens/items-in-table/${id}`,
        providesTags: [{ type: "CHEF" }],
      }),
      getTableOccupied: builder.query<{ success: string; data: Table[] }, void>(
        {
          query: () => `/kitchens/occupied-table`,
          providesTags: ["CHEF"],
        }
      ),
    };
  },
});

export const {
  useGetAllOrderForKitchenQuery,
  useGetMyKitchenItemsQuery,
  useUpdateOrderStatusMutation,
  useUpdateOrderItemStatusMutation,
  useGetAllOrderDiplicateQuery,
  useGetItemForTableQuery,
  useGetItemByCategoryIdQuery,
  useGetAllChefForCookingQuery,
  useChooseChefForCookingMutation,
  useGetOreredOfTableStaffQuery,
  useGetTableOccupiedQuery,
} = kitchenApi;

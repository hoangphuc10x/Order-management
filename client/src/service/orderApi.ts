import { rootApi } from "./rootApi";

export interface OrderItem {
  itemId: string;
  name?: string;
  quantity: number;
  price: number | GetPrice;
  status?: "PENDING" | "PROCESSING" | "COMPLETED";
  _id?: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
  difficultyLevel?: number;
}

interface GetPrice {
  $numberDecimal: string;
}

export interface Order {
  tableId: string;
  userId: string;
  userName?: string;
  tableName?: string;
  orderId?: string;
  totalPrice: number | GetPrice;
  status?:
    | "PENDING"
    | "CONFIRMED"
    | "COMPLETED"
    | "ALL_SERVED"
    | "BILL_REQUESTED"
    | "CANCELLED"
    | "PREPARING";
  orderItems: OrderItem[];
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  discountAmount?: number;
  discountPercent?: number;
  discountId?: string | null;
  __v?: number;
}

interface OrderResponse {
  success: boolean;
  newOrder: Order;
}

export interface OrderedOfTable {
  success: boolean;
  order: Order;
}
interface OrderedByID {
  success: boolean;
  order: Order[];
}

interface ItemUpdate {
  itemId: string;
  quantity: number;
  price: number;
  note?: string;
}

export const orderApi = rootApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      createOrder: builder.mutation<OrderResponse, Order>({
        query: (formData) => ({
          url: "/orders/create-update-order",
          method: "POST",
          body: formData,
        }),
        invalidatesTags: [{ type: "ORDER" }],
      }),
      //   updateMenuItem: builder.mutation<void,MenuItem>({
      //     query: (formData) => ({
      //         url: "/menu-item/create",
      //         method: "PUT",
      //         body: formData
      //     }),
      //     invalidatesTags: [{ type: 'ITEM' }]
      //   }),
      getOrered: builder.query<OrderedOfTable, string>({
        query: (id) => `/orders/${id}`,
        providesTags: [{ type: "ORDER" }],
      }),
      getOreredOfTable: builder.query<OrderedOfTable, string>({
        query: (id) => `/orders/ordered/table/${id}`,
        providesTags: [{ type: "ORDER" }],
      }),
      getOreredByUserId: builder.query<OrderedByID, string>({
        query: (id) => `/orders/ordered/user/${id}`,
        providesTags: [{ type: "ORDER" }],
      }),
      // Đơn đang hoạt động của 1 khách tại 1 bàn (trang "đã đặt" của khách)
      getActiveOrderByUserAndTable: builder.query<
        OrderedOfTable,
        { tableId: string; userId: string }
      >({
        query: ({ tableId, userId }) =>
          `/orders/ordered/table/${tableId}/user/${userId}`,
        providesTags: [{ type: "ORDER" }],
      }),
      // Tất cả đơn đang hoạt động của 1 bàn (nhân viên chọn theo tên khách)
      getActiveOrdersByTable: builder.query<
        { success: boolean; orders: Order[] },
        string
      >({
        query: (tableId) => `/orders/ordered/table/${tableId}/all`,
        providesTags: [{ type: "ORDER" }],
      }),
      updateOrder: builder.mutation<
        OrderResponse,
        { id: string; status: string }
      >({
        query: ({ status, id }) => ({
          url: `/orders/update-status/${id}`,
          method: "PATCH",
          body: { status },
        }),
        invalidatesTags: ["ORDER", "CHEF"],
      }),
      updateItemOrder: builder.mutation<
        OrderResponse,
        { formData: ItemUpdate; id: string }
      >({
        query: ({ formData, id }) => ({
          url: `/orders/update-orderItems/${id}`,
          method: "PUT",
          body: { items: formData },
        }),
        invalidatesTags: [{ type: "ORDER" }],
      }),
    };
  },
});

export const {
  useCreateOrderMutation,
  useGetOreredQuery,
  useUpdateOrderMutation,
  useGetOreredByUserIdQuery,
  useGetOreredOfTableQuery,
  useGetActiveOrderByUserAndTableQuery,
  useGetActiveOrdersByTableQuery,
  useUpdateItemOrderMutation,
} = orderApi;

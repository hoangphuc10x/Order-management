import { rootApi } from "./rootApi";
export interface Table {
  _id: string;
  tableNumber: string;
  qrCode?: string;
  status: "AVAILABLE" | "OCCUPIED";
  inform: boolean; 
  slug: string;
}
interface ApiResponse {
  success: boolean;
  result: Table[];
}

interface TableResponse {
  result: Table;
}

export const tableApi = rootApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getAllTables: builder.query<ApiResponse, void>({
        query: () => "/tables/get-all",
        providesTags: [{ type: "TABLES" }],
      }),
      createTable: builder.mutation<void, { tableNumber: string }>({
        query: ({ tableNumber }) => ({
          url: "/tables/create",
          method: "POST",
          body: { tableNumber },
        }),
        invalidatesTags: [{ type: "TABLES" }],
      }),
      getTableById: builder.query<TableResponse, { id: string }>({
        query: ({id}) => `/tables/${id}`,
        providesTags: [{ type: "ITEM" }],
      }),
      deleteTable: builder.mutation<void, { id: string }>({
        query: ({ id }) => ({
          url: `/tables/delete/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: [{ type: "TABLES" }],
      }),
    };
  },
});

export const {
  useGetAllTablesQuery,
  useCreateTableMutation,
  useGetTableByIdQuery,
  useDeleteTableMutation,
} = tableApi;

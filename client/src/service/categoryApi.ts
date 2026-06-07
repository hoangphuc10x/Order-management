import { rootApi } from "./rootApi";
interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  result: Category[];
}

export const categoryApi = rootApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getAllCategories: builder.query<ApiResponse, void>({
        query: () => "/categories/get-all",
        // providesTags: [{ type: "ITEM" }],
      }),
     
      //   createMenuItem: builder.mutation<void, MenuItem>({
      //     query: (formData) => ({
      //       url: "/menu-item/create",
      //       method: "POST",
      //       body: formData,
      //     }),
      //     invalidatesTags: [{ type: "ITEM" }],
      //   }),
      //   getTableById: builder.query<void, { id: string }>({
      //     query: (id) => `/tables/${id}`,
      //     // providesTags: [{ type: "ITEM" }],
      //   }),
    };
  },
});

export const { useGetAllCategoriesQuery } =
  categoryApi;

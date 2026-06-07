import { rootApi } from "./rootApi";

export interface MenuItem {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
}
export interface CreateMenuItem {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: { categoryId: string };
  difficultyLevel: number;
  readyToServeItems: boolean;
}
export interface FoodItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  categoryName: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  result: FoodItem[];
}

interface Category {
  categoryId: string;
  categoryName: string;
}

interface Price {
  $numberDecimal: string; // Có thể chuyển thành number nếu cần
}

interface MenuItemDetail {
  _id: string;
  name: string;
  description: string;
  price: Price;
  imageUrl: string;
  difficultyLevel: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  category: Category;
  readyToServeItems: boolean;
}

interface ApiResponseMenuDetail {
  success: boolean;
  result: MenuItemDetail;
}

interface UploadImageResponse {
  success: boolean;
  message: string;
  urlImages: string[];
}

export const menuItemApi = rootApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getAllMenuItems: builder.query<ApiResponse, void>({
        query: () => "/menu-item/get-all",
        providesTags: [{ type: "ITEM" }, { type: "ITEM_ADMIN" }],
      }),
      createMenuItem: builder.mutation<void, CreateMenuItem>({
        query: (formData) => ({
          url: "/menu-item/create",
          method: "POST",
          body: formData,
        }),
        invalidatesTags: [{ type: "ITEM" }],
      }),
      updateMenuItem: builder.mutation<
        void,
        {
          name: string;
          id: string;
          category: { categoryId: string; categoryName: string };

          price: number;
          imageUrl: string;
          description: string;
          difficultyLevel: number;
          readyToServeItems: boolean;
        }
      >({
        query: ({
          name,
          id,
          category,
          price,
          imageUrl,
          description,
          difficultyLevel,
          readyToServeItems,
        }) => ({
          url: `/menu-item/${id}/edit`, // Make sure this URL is correct
          method: "PUT",
          body: {
            name,
            category,
            price,
            imageUrl,
            description,
            difficultyLevel,
            readyToServeItems,
          },
        }),
        invalidatesTags: [
          { type: "ITEM_DETAIL" }, // Invalidate cụ thể khi có thay đổi về chi tiết món ăn
          { type: "ITEM_ADMIN" }, // Nếu bạn cần invalidate item admin
          { type: "ITEM" }, // Thêm tag này để invalidates lại getAllMenuItems
        ],
      }),
      getMenuItemById: builder.query<ApiResponseMenuDetail, { id: string }>({
        query: ({ id }) => `/menu-item/${id}`,
        providesTags: [{ type: "ITEM_DETAIL" }],
      }),
      deleteMenuItem: builder.mutation<void, { id: string }>({
        query: ({ id }) => ({
          url: `/menu-item/${id}/delete`,
          method: "DELETE",
        }),
        invalidatesTags: [{ type: "ITEM_ADMIN" }],
      }),
      uploadImage: builder.mutation<UploadImageResponse, FormData>({
        query: (formData) => ({
          url: "/uploads/food",
          method: "POST",
          body: formData,
        }),
      }),
    };
  },
});

export const {
  useGetAllMenuItemsQuery,
  useCreateMenuItemMutation,
  useGetMenuItemByIdQuery,
  useDeleteMenuItemMutation,
  useUploadImageMutation,
  useUpdateMenuItemMutation,
} = menuItemApi;

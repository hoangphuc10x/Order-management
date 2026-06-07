import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  note?: string;
  imageUrl: string
}


interface OrderState {
  items: OrderItem[];
}

const initialState: OrderState = {
  items: [],
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<OrderItem>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity = action.payload.quantity;
        existingItem.note = action.payload.note;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<OrderItem>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem?.quantity === 1) {
        state.items = state.items.filter(
          (item) => item.id !== action.payload.id
        );
      } else if (existingItem && existingItem.quantity >= 1) {
        existingItem.quantity = action.payload.quantity;
      }
    },
    removeItems: (state, action: PayloadAction<{id: string}>) => {
        state.items = state.items.filter(
          (item) => item.id !== action.payload.id
        );
    },
    clearCart: () => initialState,
  },
});

// Export actions and reducer
export const { addToCart, removeFromCart, clearCart, removeItems } = orderSlice.actions;
export default orderSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  id: "",
};

export const orderCurentSlice = createSlice({
  name: "orderId",
  initialState,
  reducers: {
    addOrderId: (state, action: PayloadAction<{ id: string }>) => {
      state.id = action.payload.id;
    },
    clearOrder: () => initialState,
  },
});

// Export actions and reducer
export const { addOrderId, clearOrder } = orderCurentSlice.actions;
export default orderCurentSlice.reducer;

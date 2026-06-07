import { Table } from "@/service/tableApi";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { tableInfo: Table } = {
  tableInfo: {
    _id: "",
    tableNumber: "",
    qrCode: "",
    status: "AVAILABLE",
    slug: "",
  },
};

export const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    // Define types for action payloads
    saveTableInfo: (state, action: PayloadAction<{ tableInfo: Table }>) => {
      state.tableInfo = action.payload.tableInfo;
    },
  },
});

// Export actions and reducer
export const { saveTableInfo } = tableSlice.actions;
export default tableSlice.reducer;

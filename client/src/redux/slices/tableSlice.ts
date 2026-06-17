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
    // Xoá cache bàn của khách (sau khi thanh toán xong, gỡ liên kết khách với bàn).
    clearTableInfo: () => initialState,
  },
});

// Export actions and reducer
export const { saveTableInfo, clearTableInfo } = tableSlice.actions;
export default tableSlice.reducer;

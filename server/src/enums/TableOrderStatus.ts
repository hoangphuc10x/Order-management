export enum TableOrderStatus {
  PENDING = "PENDING", // Đơn hàng đang chờ xác nhận
  CONFIRMED = "CONFIRMED", // Đơn hàng đã được xác nhận
  PREPARING = "PREPARING", // Món ăn đang được chuẩn bị
  ALL_SERVED = "ALL_SERVED", // Món ăn đã được phục vụ
  BILL_REQUESTED = "BILL_REQUESTED", // Khách yêu cầu thanh toán
  COMPLETED = "COMPLETED", // Đơn hàng đã hoàn tất
  CANCELLED = "CANCELLED", // Đơn hàng bị hủy
}

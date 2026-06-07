export const formatMoneyVND = (amount: number): string => {
  return amount.toLocaleString("vi-VN") + " VNĐ";
};

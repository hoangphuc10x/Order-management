import { ChevronLeft, X } from "lucide-react";
import Loading from "../Loading";

import {
  useGetActiveOrdersByTableQuery,
  useUpdateOrderMutation,
} from "@/service/orderApi";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/Table";

import { STATUS } from "../../enum/status";
import Bill from "../staff/Bill";
import { useUpdateOrderStatusMutation } from "@/service/kitchenApi";
import { useTranslation } from "react-i18next";

interface TableDetailProps {
  setSelectedTable: (table: null | string) => void;
  id: string;
}

const TableDetail = ({ setSelectedTable, id }: TableDetailProps) => {
  const { t } = useTranslation();
  const { data, isLoading, refetch } = useGetActiveOrdersByTableQuery(id);
  const [updateOrder, { isSuccess }] = useUpdateOrderMutation();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const orders = data?.orders ?? [];
  // Nhiều khách cùng bàn -> nhiều đơn. Chọn 1 đơn để xem; nếu chỉ 1 đơn thì mở luôn.
  const order =
    orders.find((o) => o._id === selectedOrderId) ??
    (orders.length === 1 ? orders[0] : undefined);

  useEffect(() => {
    if (isSuccess) {
      setSelectedTable(null);
      toast.success(t("tableDetail.confirmSuccess"));
    }
  }, [isSuccess, setSelectedTable]);

  const handleConfirm = (orderId: string) => {
    updateOrder({ id: orderId, status: STATUS.CONFIRMED });
  };

  const handleCancelAll = (orderId: string) => {
    updateOrder({ id: orderId, status: STATUS.CANCELLED });
  };

  const handleUpdateStatus = async (_id: string, newStatus: string) => {
    if (!_id || !order?._id) {
      console.error("Error: Order ID is undefined");
      return;
    }
    try {
      await updateOrderStatus({
        status: newStatus,
        orderItemIds: [_id],
        orderId: order._id,
      }).unwrap();
      toast.success(t("tableDetail.servedCalled"));
      refetch();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  const Header = ({ showBack }: { showBack?: boolean }) => (
    <div className="bg-gradient-to-r from-primary-100 to-primary-400 text-white text-lg font-bold sm:h-[10%] h-[5%] p-4 flex justify-center items-center relative">
      {showBack && (
        <ChevronLeft
          size={24}
          className="cursor-pointer absolute left-4"
          onClick={() => setSelectedOrderId(null)}
        />
      )}
      <span>{t("tableDetail.title")}</span>
      <X
        size={24}
        className="cursor-pointer absolute right-4"
        onClick={() => setSelectedTable(null)}
      />
    </div>
  );

  // Bill cho đơn đã yêu cầu thanh toán
  if (order && order.status === STATUS.BILL_REQUESTED) {
    return (
      <div className="w-full flex justify-center items-center absolute top-0 min-h-screen h-full">
        <Bill data={{ success: true, order }} setSelectedTable={setSelectedTable} />
      </div>
    );
  }

  // Nhiều đơn và chưa chọn -> hiển thị box chọn khách
  if (!order && orders.length > 0) {
    return (
      <div className="w-full flex justify-center items-center absolute top-0 min-h-screen h-full">
        <div className="bg-white sm:w-[80vw] w-full shadow-lg flex flex-col gap-2 border-2 border-primary-100 pb-2 h-[70vh] min-h-screen">
          <Header />
          <div className="flex-1 flex flex-col px-6 gap-3 mt-5">
            <h3 className="font-bold text-center text-primary-100">
              {t("tableDetail.selectGuest")}
            </h3>
            {orders.map((o, index) => (
              <button
                key={o._id}
                onClick={() => setSelectedOrderId(o._id ?? null)}
                className="flex justify-between items-center border-2 border-primary-100 rounded-lg px-4 py-3 hover:bg-secondary-100 transition"
              >
                <span className="font-medium">
                  {index + 1}. {o.userName || t("staffDetail.undefined")}
                </span>
                <span className="text-xs italic text-slate-500">
                  {o.status === STATUS.PENDING
                    ? t("status.pending")
                    : o.status === STATUS.CONFIRMED
                    ? t("orderedTable.cooking")
                    : o.status === STATUS.ALL_SERVED
                    ? t("status.served")
                    : o.status}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center absolute top-0 min-h-screen h-full">
      <div className="bg-white sm:w-[80vw] w-full shadow-lg flex flex-col gap-2 border-2 border-primary-100 pb-2 h-[70vh] min-h-screen">
        {/* Header */}
        <Header showBack={orders.length > 1} />
        {/* Tên khách của đơn đang xem */}
        {order?.userName && (
          <div className="text-center text-sm font-medium text-primary-100">
            {order.userName}
          </div>
        )}
        {/* Body */}
        <div className="flex-1 flex flex-col px-6 h-[75%]">
          <Table className="mt-5 border-b-2 max-h-[80%]">
            <TableHeader className="text-sm text-[#949494]">
              <TableRow>
                <TableHead className="text-center w-[25%]">{t("table.name")}</TableHead>
                <TableHead className="text-center w-[15%]">
                  {t("table.quantity")}
                </TableHead>
                <TableHead className="text-center w-[35%]">{t("table.note")}</TableHead>
                <TableHead className="text-center w-[15%]">
                  {t("table.status")}
                </TableHead>
                <TableHead className="text-center w-[15%]">
                  {t("table.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-y-auto">
              {order?.orderItems.map((item) => (
                <TableRow className="font-medium" key={item._id}>
                  <TableCell className="text-center">
                    <span className="text-justify">{item.name}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-justify text-primary-100">
                      {item.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-slate-500 font-normal">
                    <span className=" line-clamp-2 !overflow-y-auto">
                      {item.note || t("table.noNote")}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-slate-500 font-normal">
                    <span
                      className={`inline-block whitespace-nowrap text-[10px] sm:text-xs border-2 px-2 py-1 italic rounded-lg ${
                        item.status === STATUS.PENDING
                          ? "text-secondary-100"
                          : item.status === STATUS.PROCESSING
                          ? "text-primary-100 border-primary-100"
                          : "text-green-500 border-green-500"
                      }`}
                    >
                      {item.status === STATUS.PENDING
                        ? t("status.pending")
                        : item.status === STATUS.PROCESSING
                        ? t("status.processing")
                        : t("status.done")}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-slate-500 font-normal">
                    <button
                      className={`btn ${
                        item.status === STATUS.COMPLETED
                          ? "bg-primary-100 !text-white"
                          : " !bg-slate-400"
                      }`}
                      disabled={item.status !== STATUS.COMPLETED}
                      onClick={() =>
                        handleUpdateStatus(item._id as string, STATUS.SERVED)
                      }
                    >
                      {item.status === STATUS.SERVED
                        ? t("status.served")
                        : t("tableDetail.serve")}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className=" border-t-2 py-3">
          {order?.status === STATUS.PENDING && (
            <div className="flex justify-around w-full ">
              <button
                className="btn !text-white"
                onClick={() => order._id && handleConfirm(order._id)}
              >
                {t("common.confirm")}
              </button>
              <button
                className="btn !border-red-500 border !bg-white !text-red-500"
                onClick={() => order._id && handleCancelAll(order._id)}
              >
                {t("common.cancelAlt")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default TableDetail;

import { X } from "lucide-react";
import Loading from "../Loading";

import {
  useGetOreredOfTableQuery,
  useUpdateOrderMutation,
} from "@/service/orderApi";
import { useEffect } from "react";
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
import {
  useUpdateOrderStatusMutation,
} from "@/service/kitchenApi";
interface TableDetailProps {
  setSelectedTable: (table: null | string) => void;
  id: string;
}

const TableDetail = ({ setSelectedTable, id }: TableDetailProps) => {
  const { data, isLoading, refetch } = useGetOreredOfTableQuery(id);
  const [updateOrder, { isSuccess }] = useUpdateOrderMutation();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();


  useEffect(() => {
    if (isSuccess) {
      setSelectedTable(null);
      toast.success("Xác nhận thành công");
    }
  }, [isSuccess, setSelectedTable]);

  const handleConfirm = (id: string) => {
    updateOrder({ id, status: STATUS.CONFIRMED });
  };

  const handleCancelAll = (id: string) => {
    updateOrder({ id, status: STATUS.CANCELLED });
  };

  const handleUpdateStatus = async (_id: string, newStatus: string) => {
    if (!_id) {
      console.error("Error: Order ID is undefined");
      return;
    }
    try {
      console.log("_id", _id);
      const response = await updateOrderStatus({
        status: newStatus,
        orderItemIds: [_id],
        orderId: data?.order._id || "",
      }).unwrap();
      console.log("Response from server:", response);
      toast.success("Đã gọi phục vụ món!");
      refetch();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full flex justify-center items-center absolute top-0 min-h-screen h-full">
      {data?.order.status === STATUS.BILL_REQUESTED ? (
        <Bill data={data} setSelectedTable={setSelectedTable} />
      ) : (
        <div className=" bg-white sm:w-[80vw] w-full  shadow-lg flex flex-col gap-2 border-2 border-primary-100 pb-2 h-[70vh] min-h-screen">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-100 to-primary-400  text-white text-lg font-bold sm:h-[10%] h-[5%] p-4 flex justify-center items-center relative ">
            <span className="">Thông tin bàn</span>
            <X
              size={24}
              className="cursor-pointer absolute right-4"
              onClick={() => setSelectedTable(null)}
            />
          </div>
          {/* Body */}
          <div className="flex-1 flex flex-col px-6 h-[75%]">
            <Table className="mt-5 border-b-2 max-h-[80%]">
              <TableHeader className="text-sm text-[#949494]">
                <TableRow>
                  <TableHead className="text-center w-[25%]">Tên món</TableHead>
                  <TableHead className="text-center w-[15%]">
                    Số lượng
                  </TableHead>
                  <TableHead className="text-center w-[35%]">Ghi chú</TableHead>
                  <TableHead className="text-center w-[15%]">
                    Trạng thái
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="overflow-y-auto">
                {data?.order.orderItems.map((item) => (
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
                        {item.note || "Không có ghi chú"}
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
                          ? "Đang chờ"
                          : item.status === STATUS.PROCESSING
                          ? "Đang chế biến"
                          : "Đã xong"}
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
                          ? "Đã phục vụ"
                          : " Phục vụ"}
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className=" border-t-2 py-3">
            {data?.order.status === STATUS.PENDING && (
              <div className="flex justify-around w-full ">
                <button
                  className="btn !text-white"
                  onClick={() =>
                    data?.order._id && handleConfirm(data.order._id)
                  }
                >
                  Xác nhận
                </button>
                <button
                  className="btn !border-red-500 border !bg-white !text-red-500"
                  onClick={() =>
                    data?.order._id && handleCancelAll(data.order._id)
                  }
                >
                  Hủy bỏ
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default TableDetail;

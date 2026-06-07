import SelectChef from "@/components/chef/SelectChef";
import Loading from "@/components/Loading";
import { STATUS } from "@/enum/status";
import { socket } from "@/provider/SocketProvider";
import { useUpdateOrderStatusMutation } from "@/service/kitchenApi";

import { OrderItem, useGetOreredOfTableQuery } from "@/service/orderApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/Table";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "sonner";

const TableDetailForChef = () => {
  const { id } = useParams();
  const location = useLocation();
  const tableName = location.state?.tableName;

  const [isModalOpenChef, setIsModalOpenChef] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  const { data, isLoading, refetch } = useGetOreredOfTableQuery(id || "");

  const [updateOrderItem] = useUpdateOrderStatusMutation();

  useEffect(() => {
    socket.on("tableStatusChanged", (data) => {
      console.log("tableStatusChanged");
      if (data) {
        refetch();
      }
    });
    socket.on("kitchenStatusUpdated", (data) => {
      console.log("kitchenStatusUpdated");
      if (data) {
        refetch();
      }
    });
    socket.on("orderStatusChanged", (data) => {
      console.log("orderStatusChanged");
      if (data) {
        refetch();
      }
      if (data.status === "COMPLETED") {
        toast.success("Đã hoàn thành món ăn");
        refetch();
      }
    });
    socket.on("orderItemStatusUpdated", (data) => {
      console.log("orderItemStatusUpdated");
      if (data) {
        refetch();
      }
    });
    return () => {
      socket.off("tableStatusChanged");
      socket.off("kitchenStatusUpdated");
      socket.off("orderStatusChanged");
      socket.off("orderItemStatusUpdated");
    };
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }
  const handleUpdateOrderStatus = async (
    status: string,
    orderItemIds: string[]
  ) => {
    try {
      console.log("first", orderItemIds);
      await updateOrderItem({
        status,
        orderItemIds,
        orderId: data?.order?._id || "",
      }).unwrap();
      toast.success("Cập nhật trạng thái món thành công");
    } catch (error) {
      console.error("Error updating order status", error);
    }
  };

  const handleModalAllChef = (order: OrderItem) => {
    setIsModalOpenChef(!isModalOpenChef);
    setSelectedOrder(order);
    refetch();
  };

  return (
    <div className=" flex flex-col flex-1 h-full border-2 py-5 gap-4 rounded-lg ">
      <div className="w-full flex justify-center">
        <span className="font-bold text-xl text-white bg-gradient-to-r from-primary-100 to-primary-400 px-4 py-1.5 rounded-lg shadow">
          Bàn số: {tableName}
        </span>
      </div>
      <div
        className="w-full max-h-[70vh] overflow-y-scroll"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <Table className="w-full">
          <TableHeader className="text-sm text-black">
            <TableRow>
              <TableHead className="p-2 w-[5%] text-center">STT</TableHead>
              <TableHead className="p-2 w-[25%] text-center">
                Tên món ăn
              </TableHead>
              <TableHead className="p-2 w-[15%] text-center">
                Số lượng món
              </TableHead>
              <TableHead className="p-2 w-[10%] text-center">
                Thời gian cập nhật
              </TableHead>
              <TableHead className="p-2 w-[10%] text-center">
                Trạng thái
              </TableHead>
              <TableHead className="p-2 w-[10%] text-center">
                Chức năng
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data?.order?.orderItems || [])?.map((order, index) => (
              <TableRow key={index} className="font-medium">
                <TableCell className="p-2 text-center">{index + 1}</TableCell>
                <TableCell className="p-2 text-center">{order.name}</TableCell>
                <TableCell className="p-2 text-center">
                  {order.quantity}
                </TableCell>
                <TableCell className="p-2 text-center">
                  {order.updatedAt &&
                    new Date(order.updatedAt).toLocaleString().split(",")[1]}
                </TableCell>
                <TableCell className="p-2 text-center">
                  {order.status === "PENDING" ? (
                    <span className="text-yellow-500">Chờ xử lý</span>
                  ) : order.status === "PROCESSING" ? (
                    <span className="text-green-700">Đang chế biến</span>
                  ) : order.status === "COMPLETED" ? (
                    <span className="text-blue-600">Đã hoàn thành</span>
                  ) : (
                    <span className="text-blue-600">Đã lên món</span>
                  )}
                </TableCell>
                <TableCell className="p-2 text-center">
                  <div className="flex gap-2 justify-center items-center">
                    {order.status === STATUS.PENDING && (
                      <button
                        onClick={() => handleModalAllChef(order)}
                        className="bg-primary-100 hover:bg-yellow-600 text-white px-3 py-1 rounded-xl whitespace-nowrap"
                      >
                        Chọn đầu bếp
                      </button>
                    )}
                    {order.status === STATUS.PROCESSING && (
                      <button
                        onClick={() =>
                          order._id && handleUpdateOrderStatus(STATUS.COMPLETED, [order._id])
                        }
                        className="bg-green-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-xl whitespace-nowrap"
                      >
                        Hoàn thành
                      </button>
                    )}
                    {(order.status === STATUS.COMPLETED ||
                      order.status === STATUS.SERVED) && (
                      <span className="bg-green-500  text-white px-3 py-1 rounded-xl whitespace-nowrap opacity-50">
                        Đã xong
                      </span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {isModalOpenChef && selectedOrder && (
          <SelectChef
            setIsModalOpenChef={setIsModalOpenChef}
            order={{
              orderItemIds: selectedOrder._id ? [selectedOrder._id] : [],
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TableDetailForChef;

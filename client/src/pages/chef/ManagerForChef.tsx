import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/Table";
import { socket } from "@/provider/SocketProvider";
import Loading from "@/components/Loading";
import {
  useGetAllOrderForKitchenQuery,
  // useUpdateOrderStatusMutation,
} from "@/service/kitchenApi";

const ManagerForChef = () => {
  const { data, isLoading, refetch } = useGetAllOrderForKitchenQuery();
  // const [getUpdateOrderStatus] = useUpdateOrderStatusMutation();

  useEffect(() => {
    socket.on("orderItemStatusUpdated", (data) => {
      console.log("orderItemStatusUpdated");
      if (data) {
        refetch();
      }
    });
    return () => {
      socket.off("orderItemStatusUpdated");
    };
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  const handleUpdateStatus = async (_id: string, newStatus: string) => {
    if (!_id) {
      return;
    }
    try {
      console.log(`Sending request to update order ${_id} to ${newStatus}`);
      // const response = await getUpdateOrderStatus({
      //   orderItemIds: [_id],,
      //   status: newStatus,
      // }).unwrap();
      // console.log("Response from server:", response);
      refetch();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };
  console.log(data);
  return (
    <div className="p-5">
      <div className="h-12 flex w-full items-center px-7 bg-gradient-to-r from-primary-100 to-primary-400">
        <h3 className="text-white font-bold text-xl">Gợi ý</h3>
        <div className="flex flex-1 justify-center"></div>
      </div>
      <div className="p-6 mr-3">
        <Table className="w-full">
          <TableHeader className="text-sm text-black">
            <TableRow>
              <TableHead className="p-2 w-[10%] text-center">STT</TableHead>
              <TableHead className="p-2 w-[20%] text-center">Bàn</TableHead>
              <TableHead className="p-2 w-[20%] text-center">
                Tên món ăn
              </TableHead>
              <TableHead className="p-2 w-[20%] text-center">
                Số lượng
              </TableHead>
              <TableHead className="p-2 w-[20%] text-center">
                Thời gian đặt
              </TableHead>
              <TableHead className="p-2 w-[10%] text-center">
                Chức năng
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.result
              ?.filter((order) => order.status !== "COMPLETED") // Hiển thị đơn hàng chưa hoàn thành
              .map((order, index) => (
                <TableRow key={order._id} className="font-medium">
                  <TableCell className="p-2 text-center">{index + 1}</TableCell>
                  <TableCell className="p-2 text-center">
                    {order.tableNumber}
                  </TableCell>
                  <TableCell className="p-2 text-center">
                    {order.name}
                  </TableCell>
                  <TableCell className="p-2 text-center">
                    {order.quantity}
                  </TableCell>
                  <TableCell className="p-2 text-center">
                    {new Date(order.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="p-2 text-center">
                    {order.status === "PENDING" && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(order._id, "PROCESSING")
                        }
                        className="bg-[#FBBC05] text-white px-3 py-1 rounded-xl whitespace-nowrap"
                      >
                        Bắt đầu
                      </button>
                    )}
                    {order.status === "PROCESSING" && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(order._id, "COMPLETED")
                        }
                        className="bg-green-500 text-white px-3 py-1 rounded-xl whitespace-nowrap"
                      >
                        Hoàn thành
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ManagerForChef;

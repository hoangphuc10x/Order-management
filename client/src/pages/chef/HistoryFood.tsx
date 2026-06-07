import Loading from "@/components/Loading";
import { socket } from "@/provider/SocketProvider";
import { useGetAllOrderForKitchenQuery } from "@/service/kitchenApi";
import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/Table"; // Thêm import các component Table

const HistoryFood = () => {
  const { data, isLoading, refetch } = useGetAllOrderForKitchenQuery();

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



  return (
    <div className="flex flex-col h-full w-full">
      <div className="h-16 flex w-full items-center px-10 bg-gradient-to-r from-primary-100 to-primary-400">
        <h3 className="text-white font-bold text-xl">Lịch sử món ăn</h3>
        <div className="flex flex-1 justify-center"></div>
      </div>
      <div className="p-6 mr-3">
        <Table className="w-full">
          <TableHeader className="text-sm text-black">
            <TableRow>
              <TableHead className="p-2 text-center w-[10%]">STT</TableHead>
              <TableHead className="p-2 text-center w-[20%]">Bàn</TableHead>
              <TableHead className="p-2 text-center w-[40%]">
                Tên món ăn
              </TableHead>
              <TableHead className="p-2 text-center w-[20%]">
                Thời gian đặt
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.result
              ?.filter((order) => order.status === "COMPLETED") // Lọc đơn hàng có trạng thái COMPLETED
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
                    {new Date(order.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default HistoryFood;

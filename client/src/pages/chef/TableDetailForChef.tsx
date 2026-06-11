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
import { useTranslation } from "react-i18next";

const TableDetailForChef = () => {
  const { t } = useTranslation();
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
        toast.success(t("chef.dishCompleted"));
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
      toast.success(t("chef.updateStatusSuccess"));
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
          {t("chef.tableNo")} {tableName}
        </span>
      </div>
      <div
        className="w-full max-h-[70vh] overflow-y-scroll"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <Table className="w-full">
          <TableHeader className="text-sm text-black">
            <TableRow>
              <TableHead className="p-2 w-[5%] text-center">{t("table.stt")}</TableHead>
              <TableHead className="p-2 w-[25%] text-center">
                {t("table.dishName")}
              </TableHead>
              <TableHead className="p-2 w-[15%] text-center">
                {t("table.quantityDish")}
              </TableHead>
              <TableHead className="p-2 w-[10%] text-center">
                {t("table.updateTime")}
              </TableHead>
              <TableHead className="p-2 w-[10%] text-center">
                {t("table.status")}
              </TableHead>
              <TableHead className="p-2 w-[10%] text-center">
                {t("table.actions")}
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
                    <span className="text-yellow-500">{t("status.waiting")}</span>
                  ) : order.status === "PROCESSING" ? (
                    <span className="text-green-700">{t("status.processing")}</span>
                  ) : order.status === "COMPLETED" ? (
                    <span className="text-blue-600">{t("status.completed")}</span>
                  ) : (
                    <span className="text-blue-600">{t("status.plated")}</span>
                  )}
                </TableCell>
                <TableCell className="p-2 text-center">
                  <div className="flex gap-2 justify-center items-center">
                    {order.status === STATUS.PENDING && (
                      <button
                        onClick={() => handleModalAllChef(order)}
                        className="bg-primary-100 hover:bg-yellow-600 text-white px-3 py-1 rounded-xl whitespace-nowrap"
                      >
                        {t("chef.selectChefBtn")}
                      </button>
                    )}
                    {order.status === STATUS.PROCESSING && (
                      <button
                        onClick={() =>
                          order._id && handleUpdateOrderStatus(STATUS.COMPLETED, [order._id])
                        }
                        className="bg-green-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-xl whitespace-nowrap"
                      >
                        {t("common.complete")}
                      </button>
                    )}
                    {(order.status === STATUS.COMPLETED ||
                      order.status === STATUS.SERVED) && (
                      <span className="bg-green-500  text-white px-3 py-1 rounded-xl whitespace-nowrap opacity-50">
                        {t("status.done")}
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

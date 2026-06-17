import Loading from "@/components/Loading";
import { socket } from "@/provider/SocketProvider";
import {
  OrderItem,
  useGetItemByCategoryIdQuery,
  useGetMyKitchenItemsQuery,
  useUpdateOrderStatusMutation,
} from "@/service/kitchenApi";
import { useUserInfo } from "@/hook/auth";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/Table";

import { useParams } from "react-router-dom";
import CheckTable from "@/components/chef/CheckTable";
import SelectChef from "@/components/chef/SelectChef";
import { STATUS } from "@/enum/status";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const SortFood = () => {
  const { t } = useTranslation();
  const { id, category } = useParams();
  const [isPenđing, setIsPending] = useState("PENDING");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenChef, setIsModalOpenChef] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [status, setStatus] = useState("PENDING");
  const [itemId, setItemId] = useState("");
  const { role } = useUserInfo();
  const isChef = role === "chef";

  // Bếp trưởng/quản lý lấy theo danh mục; đầu bếp lấy món được giao rồi lọc theo danh mục.
  const categoryQuery = useGetItemByCategoryIdQuery(
    { id: id || "" },
    { skip: isChef }
  );
  const myQuery = useGetMyKitchenItemsQuery(undefined, { skip: !isChef });

  const isLoading = isChef ? myQuery.isLoading : categoryQuery.isLoading;
  const refetch = isChef ? myQuery.refetch : categoryQuery.refetch;
  const items: OrderItem[] = isChef
    ? (myQuery.data?.result ?? []).filter((o) => o.categoryId === id)
    : categoryQuery.data ?? [];

  const [updateOrderItem, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

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
    socket.on("chefAssigned", (data) => {
      if (data) {
        refetch();
      }
    });
    socket.on("orderStatusChanged", (data) => {
      console.log("orderStatusChanged");
      if (data) {
        refetch();
      }
    });
    socket.on("orderItemStatusUpdated", (data) => {
      console.log("orderItemStatusUpdated");
      if (data) {
        refetch();
      }
    });
    socket.on("orderUpdated", (data) => {
      console.log("orderUpdated");
      if (data) {
        refetch();
      }
    });
    return () => {
      socket.off("tableStatusChanged");
      socket.off("kitchenStatusUpdated");
      socket.off("chefAssigned");
      socket.off("orderStatusChanged");
      socket.off("orderItemStatusUpdated");
      socket.off("orderUpdated");
    };
  }, [refetch]);

  if (isLoading) {
    return <Loading />;
  }
  const handleUpdateOrderStatus = async (
    status: string,
    orderItemIds: string[]
  ) => {
    try {
      await updateOrderItem({
        status,
        orderItemIds,
      }).unwrap();
      toast.success(t("chef.updateStatusSuccess"));
    } catch (error) {
      console.error("Error updating order status", error);
    }
  };

  const handleModalToggle = (order: OrderItem) => {
    // Cập nhật thông tin món ăn khi nhấn nút "Xem bàn"
    setSelectedOrder(order);
    setItemId(order.itemId); // Cập nhật itemId từ order
    setStatus(order.status); // Cập nhật status từ order
    setIsModalOpen(!isModalOpen);
  };

  const handleModalAllChef = (order: OrderItem) => {
    setIsModalOpenChef(!isModalOpenChef);
    setSelectedOrder(order);
  };
  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="h-16 flex w-full items-center px-10 bg-gradient-to-r from-primary-100 to-primary-400">
        <h3 className="text-white font-bold text-xl">{category}</h3>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setIsPending("PENDING")}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none transition transform hover:scale-105 active:bg-yellow-700 border "
          >
            {t("chef.pendingFilter")}
          </button>
          <button
            onClick={() => setIsPending("PROCESSING")}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none transition transform hover:scale-105 active:bg-green-700 border "
          >
            {t("chef.cookingFilter")}
          </button>
        </div>
      </div>
      <div className="p-6 mr-3 overflow-y-auto h-[75vh]">
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
              {!isChef && (
                <TableHead className="p-2 w-[10%] text-center">
                  {t("chef.chefName")}
                </TableHead>
              )}
              <TableHead className="p-2 w-[10%] text-center">
                {t("table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items
              .filter((order) => order.status === isPenđing)
              .map((order, index) => (
                <TableRow key={index} className="font-medium">
                  <TableCell className="p-2 text-center">{index + 1}</TableCell>
                  <TableCell className="p-2 text-center">
                    {order.name}
                  </TableCell>
                  <TableCell className="p-2 text-center">
                    {order.quantity}
                  </TableCell>
                  <TableCell className="p-2 text-center">
                    {new Date(order.updatedAt).toLocaleString().split(",")[1]}
                  </TableCell>
                  <TableCell className="p-2 text-center">
                    {order.status === "PENDING" ? (
                      <span className="text-yellow-500">{t("status.waiting")}</span>
                    ) : order.status === "PROCESSING" ? (
                      <span className="text-green-700">{t("status.processing")}</span>
                    ) : (
                      <span className="text-blue-600">{t("status.completed")}</span>
                    )}
                  </TableCell>
                  {!isChef && (
                    <TableCell className="p-2 text-center">
                      {order.fulname ? (
                        <span className="text-primary-100">{order.fulname}</span>
                      ) : (
                        <span className="text-slate-400 italic">
                          {t("chef.notAssigned")}
                        </span>
                      )}
                    </TableCell>
                  )}
                  <TableCell className="p-2 text-center">
                    <div className="flex gap-2 justify-center items-center">
                      <button
                        onClick={() => handleModalToggle(order)}
                        className="bg-blue-500 hover:bg-blue-800 text-white px-3 py-1 rounded-xl whitespace-nowrap"
                      >
                        {t("chef.viewTable")}
                      </button>
                      {isChef ? (
                        isPenđing === STATUS.PENDING ? (
                          <button
                            disabled={isUpdating}
                            onClick={() =>
                              handleUpdateOrderStatus(STATUS.PROCESSING, [
                                order.orderItemId,
                              ])
                            }
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-xl whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {isUpdating ? t("common.processing") : t("chef.startCooking")}
                          </button>
                        ) : (
                          <button
                            disabled={isUpdating}
                            onClick={() =>
                              handleUpdateOrderStatus(STATUS.COMPLETED, [
                                order.orderItemId,
                              ])
                            }
                            className="bg-green-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-xl whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {isUpdating ? t("common.processing") : t("common.complete")}
                          </button>
                        )
                      ) : (
                        isPenđing === STATUS.PENDING && (
                          <button
                            onClick={() => handleModalAllChef(order)}
                            className="bg-primary-100 hover:bg-yellow-600 text-white px-3 py-1 rounded-xl whitespace-nowrap"
                          >
                            {t("chef.selectChefBtn")}
                          </button>
                        )
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {isModalOpen && selectedOrder && (
          <CheckTable
            itemId={itemId}
            status={status}
            key={itemId}
            setIsModalOpen={setIsModalOpen}
          />
        )}
        {isModalOpenChef && selectedOrder && (
          <SelectChef
            setIsModalOpenChef={setIsModalOpenChef}
            order={{
              orderItemIds: [selectedOrder.orderItemId],
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SortFood;

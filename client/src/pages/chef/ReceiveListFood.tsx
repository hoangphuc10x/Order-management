import Loading from "@/components/Loading";
import { socket } from "@/provider/SocketProvider";
import {
  OrderItem,
  useGetAllOrderForKitchenQuery,
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
import SelectChef from "@/components/chef/SelectChef";
import CheckTable from "@/components/chef/CheckTable";
import { STATUS } from "@/enum/status";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const ReceiveListFood = () => {
  const { t } = useTranslation();
  const { role } = useUserInfo();
  const isChef = role === "chef";

  // Tab mặc định: chef bắt đầu ở "đang chế biến" (PROCESSING),
  // chef_head bắt đầu ở "chờ xử lý" (PENDING).
  const [tab, setTab] = useState(isChef ? STATUS.PROCESSING : STATUS.PENDING);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenChef, setIsModalOpenChef] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [status, setStatus] = useState("PENDING");
  const [itemId, setItemId] = useState("");

  // Đầu bếp thường chỉ thấy món được giao cho mình; bếp trưởng/quản lý thấy tất cả.
  const allQuery = useGetAllOrderForKitchenQuery(undefined, { skip: isChef });
  const myQuery = useGetMyKitchenItemsQuery(undefined, { skip: !isChef });
  const { data, isLoading, refetch } = isChef ? myQuery : allQuery;
  const [updateOrderItem, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  useEffect(() => {
    socket.on("tableStatusChanged", (data) => {
      if (data) {
        refetch();
      }
    });
    socket.on("kitchenStatusUpdated", (data) => {
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
      if (data) {
        refetch();
      }
    });
    socket.on("orderItemStatusUpdated", (data) => {
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
      toast.success(t("chef.updateStatusSuccess2"));
      refetch();
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
        <h3 className="text-white font-bold text-xl">{t("chef.allDishes")}</h3>
        <div className="ml-auto flex gap-2">
          {isChef ? (
            <>
              <button
                onClick={() => setTab(STATUS.PROCESSING)}
                className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none transition transform hover:scale-105 active:bg-blue-700 border ${
                  tab === STATUS.PROCESSING ? "ring-2 ring-white" : ""
                }`}
              >
                {t("chef.tabInProgress")}
              </button>
              <button
                onClick={() => setTab(STATUS.COOKING)}
                className={`px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none transition transform hover:scale-105 active:bg-green-700 border ${
                  tab === STATUS.COOKING ? "ring-2 ring-white" : ""
                }`}
              >
                {t("chef.tabCooking")}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setTab(STATUS.PENDING)}
                className={`px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none transition transform hover:scale-105 active:bg-yellow-700 border ${
                  tab === STATUS.PENDING ? "ring-2 ring-white" : ""
                }`}
              >
                {t("chef.pendingFilter")}
              </button>
              <button
                onClick={() => setTab(STATUS.PROCESSING)}
                className={`px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none transition transform hover:scale-105 active:bg-green-700 border ${
                  tab === STATUS.PROCESSING ? "ring-2 ring-white" : ""
                }`}
              >
                {t("chef.cookingFilter")}
              </button>
            </>
          )}
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
            {data?.result
              .filter((order) =>
                // chef_head: tab "đang chế biến" gộp cả PROCESSING và COOKING
                !isChef && tab === STATUS.PROCESSING
                  ? order.status === STATUS.PROCESSING ||
                    order.status === STATUS.COOKING
                  : order.status === tab
              )
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
                    {order.status === STATUS.PENDING ? (
                      <span className="text-yellow-500">{t("status.waiting")}</span>
                    ) : order.status === STATUS.PROCESSING ? (
                      <span className="text-blue-600">{t("status.inProgress")}</span>
                    ) : order.status === STATUS.COOKING ? (
                      <span className="text-green-700">{t("status.cooking")}</span>
                    ) : (
                      <span className="text-slate-500">{t("status.completed")}</span>
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
                        tab === STATUS.PROCESSING ? (
                          <button
                            disabled={isUpdating}
                            onClick={() =>
                              handleUpdateOrderStatus(STATUS.COOKING, [
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
                        tab === STATUS.PENDING && (
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

export default ReceiveListFood;

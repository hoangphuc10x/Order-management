import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/Table";
import {
  Item,
  useGetAllOrderDiplicateQuery,
  useUpdateOrderStatusMutation,
} from "@/service/kitchenApi";
import Loading from "@/components/Loading";
import { socket } from "@/provider/SocketProvider";
import CheckTable from "@/components/chef/CheckTable";
import SelectChef from "@/components/chef/SelectChef";
import { STATUS } from "@/enum/status";
import { useTranslation } from "react-i18next";

const DuplicateFood = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenChef, setIsModalOpenChef] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Item | null>(null);

  const [status, setStatus] = useState("PENDING");
  const [isPenđing, setIsPending] = useState("PENDING");
  const [itemId, setItemId] = useState("");
  const { data, isLoading, refetch } = useGetAllOrderDiplicateQuery();
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
  },[]);

  if (isLoading) {
    return <Loading />;
  }
  const handleModalAllChef = (order: Item) => {
    setIsModalOpenChef(!isModalOpenChef);
    setSelectedOrder(order);
  };
  const handleModalToggle = (order: Item) => {
    // Cập nhật thông tin món ăn khi nhấn nút "Xem bàn"
    setSelectedOrder(order);
    setItemId(order.itemId); // Cập nhật itemId từ order
    setStatus(order.status); // Cập nhật status từ order
    setIsModalOpen(!isModalOpen);
  };

  const handleUpdateOrderStatus = async (
    status: string,
    orderItemIds: string[]
  ) => {
    try {
      await updateOrderItem({
        status,
        orderItemIds,
      }).unwrap();
    } catch (error) {
      console.error("Error updating order status", error);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="h-16 flex w-full items-center px-10 bg-gradient-to-r from-primary-100 to-primary-400">
        <h3 className="text-white font-bold text-xl">{t("chef.duplicateTitle")}</h3>
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
              <TableHead className="p-2 w-[10%] text-center">
                {t("table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data
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
                    {order.status === STATUS.PENDING ? (
                      <span className="text-yellow-500">{t("status.waiting")}</span>
                    ) : order.status === STATUS.PROCESSING ? (
                      <span className="text-green-700">{t("status.processing")}</span>
                    ) : (
                      <span className="text-blue-600">{t("status.completed")}</span>
                    )}
                  </TableCell>
                  <TableCell className="p-2 text-center">
                    <div className="flex gap-2 justify-center items-center">
                      <button
                        onClick={() => handleModalToggle(order)}
                        className="bg-blue-500 hover:bg-blue-800 text-white px-3 py-1 rounded-xl whitespace-nowrap"
                      >
                        {t("chef.viewTable")}
                      </button>
                      {isPenđing === STATUS.PENDING ? (
                        <button
                          onClick={() => handleModalAllChef(order)}
                          className="bg-primary-100 hover:bg-yellow-600 text-white px-3 py-1 rounded-xl whitespace-nowrap"
                        >
                          {t("chef.selectChefBtn")}
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleUpdateOrderStatus(
                              STATUS.COMPLETED,
                              order.orderItemIds
                            )
                          }
                          className="bg-green-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-xl whitespace-nowrap"
                        >
                          {t("common.complete")}
                        </button>
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
            order={{ orderItemIds: selectedOrder.orderItemIds }}
          />
        )}
      </div>
    </div>
  );
};

export default DuplicateFood;

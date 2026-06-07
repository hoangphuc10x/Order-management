import TableDetail from "@/components/admin/TableDetail";
import Loading from "@/components/Loading";
import { STATUS } from "@/enum/status";
import ManageTableIcon from "@/icons/ManageTableIcon";
import { socket } from "@/provider/SocketProvider";
import { useGetAllTablesQuery } from "@/service/tableApi";
import { BellRing } from "lucide-react";
import { useEffect, useState } from "react";

const ShowTablePage = () => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    {}
  );
  const { data, isLoading, refetch } = useGetAllTablesQuery();

  useEffect(() => {
    socket.on("tableStatusChanged", (dt) => {
      console.log("tableStatusChanged", dt);
      if (dt.status === STATUS.OCCUPIED) {
        setNotifications((prev) => ({ ...prev, [dt.tableId]: true }));
      }
      refetch();
    });
    socket.on("orderItemStatusUpdated", (dt) => {
      console.log("orderItemStatusUpdated", dt);
      if (dt.status === STATUS.COMPLETED) {
        setNotifications((prev) => ({ ...prev, [dt.tableId]: true }));
      }
      refetch();
    });
    socket.on("orderStatusChanged", (dt) => {
      console.log("orderStatusChanged", dt);
      if (dt.status === STATUS.BILL_REQUESTED) {
        setNotifications((prev) => ({ ...prev, [dt.tableId]: true }));
      }
    });
    socket.on("orderUpdated", (dt) => {
      console.log("orderUpdated", dt);
      if (dt) {
        setNotifications((prev) => ({ ...prev, [dt.tableId]: true }));
      }
    });

    return () => {
      socket.off("tableStatusChanged");
      socket.off("orderItemStatusUpdated");
      socket.off("orderStatusChanged");
      socket.off("orderUpdated");
    };
  }, []);

  console.log("notifications", notifications);

  const handleTableClick = (id: string) => {
    setSelectedTable(id);
    setNotifications((prev) => ({ ...prev, [id]: false }));
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="h-16 flex w-full justify-between items-center px-10 bg-gradient-to-r from-primary-100 to-primary-400">
        <h3 className="text-white font-bold text-xl">Quản lý bàn</h3>
      </div>

      {/* Danh sách bàn */}
      <div className="flex-1 sm:p-16 p-8 grid sm:grid-cols-4 grid-cols-2 gap-10 ">
        {(data?.result || []).map((table) => (
          <button
            key={table._id}
            className={`p-1 flex flex-col justify-center items-center sm:w-[15vw] sm:h-[15vh] w-[35vw] relative border rounded-lg border-[#B38500] cursor-pointer ${
              table.status === "AVAILABLE"
                ? " bg-secondary-100 "
                : " bg-primary-500"
            }`}
            onClick={() => {
              if (table.status !== "AVAILABLE") {
                handleTableClick(table._id);
              }
            }}
          >
            <div className="absolute size-10 rounded-lg bg-primary-100 flex justify-center items-center top-1 left-1">
              <h3 className="text-xs text-white">{table.tableNumber}</h3>
            </div>

            {notifications[table._id] && (
              <div className="absolute top-0 right-0 sm:m-3 m-1 text-red-500">
                <BellRing />
              </div>
            )}

            <div>
              <ManageTableIcon />
            </div>
          </button>
        ))}
      </div>

      {selectedTable && (
        <TableDetail
          id={selectedTable}
          setSelectedTable={(table) => setSelectedTable(table || null)}
        />
      )}
    </div>
  );
};

export default ShowTablePage;

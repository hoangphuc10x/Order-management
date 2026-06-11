import CreateTable from "@/components/admin/CreateTable";
import ShowQRTable from "@/components/admin/ShowQRTable";
import TableDetailAdmin from "@/components/admin/TableDetailAdmin";
import Alert from "@/components/Alert";
import Loading from "@/components/Loading";
import ManageTableIcon from "@/icons/ManageTableIcon";
import {
  useDeleteTableMutation,
  useGetAllTablesQuery,
} from "@/service/tableApi";

// import Panigatation from "@/ui/Panigatation";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
// import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const ManageTablesPage = () => {
  const { t } = useTranslation();
  const [showFormCreateTable, setShowFormCreateTable] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [showQRTable, setShowQRTable] = useState<string | null>(null);
  const [deleteTable, { isSuccess: isDeleteSucces }] = useDeleteTableMutation();
  const { data, isLoading } = useGetAllTablesQuery();

  const handleTableClick = (id: string) => {
    setSelectedTable(id);
  };

  const handleQRShowClick = (id: string) => {
    setShowQRTable(id);
  };

  console.log("showQRTable", showQRTable);

  useEffect(() => {
    if (isDeleteSucces) {
      toast.success(t("managerTables.deleteSuccess"));
    }
  }, [isDeleteSucces]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col h-full w-full ">
      {/* Header */}
      <div className="h-16 flex w-full justify-between items-center px-10 bg-gradient-to-r from-primary-100 to-primary-400">
        <h3 className="text-white font-bold text-xl">{t("managerTables.title")}</h3>
        <button
          className="flex gap-1 py-1 px-3 items-center text-white border bg-primary-100 border-[#6D28D9] hover:bg-yellow-300 rounded-xl"
          onClick={() => setShowFormCreateTable(true)}
        >
          <Plus size={20} />
          {t("managerTables.addTable")}
        </button>
      </div>

      {/* Danh sách bàn */}
      <div className="flex-1 p-16 grid grid-cols-4  gap-10 overflow-y-scroll">
        {(data?.result || []).map((table) => (
          <div className="relative" key={table._id}>
            <button
              className={`p-1 flex flex-col justify-center items-center w-full min-h-28 border rounded-lg border-[#6D28D9] cursor-pointer  ${
                table.status === "AVAILABLE"
                  ? " bg-secondary-100 "
                  : " bg-primary-500 hover:bg-yellow-300"
              }`}
              onClick={() => {
                if (table.status !== "AVAILABLE") {
                  console.log("true");
                  handleTableClick(table._id);
                }
              }}
            >
              <ManageTableIcon />
            </button>
            <div
              className="absolute size-10 rounded-lg bg-primary-100 flex justify-center items-center top-1 left-1 hover:cursor-pointer hover:opacity-50"
              onClick={() => handleQRShowClick(table._id)}
            >
              <h3 className="text-xs text-white">{table.tableNumber}</h3>
            </div>
            <div className="absolute flex justify-center items-center w-10 h-10 rounded-full bg-white text-primary-100 top-1 right-1 hover:bg-yellow-600">
              <Alert
                btn1={t("common.cancel")}
                btn2={t("common.delete")}
                description={t("managerTables.deleteDesc")}
                title={t("common.confirmDelete")}
                Icon={Trash2}
                handleBtn2={async () => {
                  await deleteTable({ id: table._id });
                }}
                handleBtn1={() => {}}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Hiển thị thông tin chi tiet bàn */}
      {selectedTable && (
        <TableDetailAdmin
          id={selectedTable}
          setSelectedTable={setSelectedTable}
        />
      )}

      {showQRTable && (
        <ShowQRTable id={showQRTable} setShowQRTable={setShowQRTable} />
      )}

      {/* Form tạo bàn */}
      {showFormCreateTable && (
        <CreateTable setShowFormCreateTable={setShowFormCreateTable} />
      )}
      {/* 
      <Panigatation/> */}
    </div>
  );
};

export default ManageTablesPage;

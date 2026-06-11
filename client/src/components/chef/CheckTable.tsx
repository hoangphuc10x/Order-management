import { useGetItemForTableQuery } from "@/service/kitchenApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/Table";
import { useTranslation } from "react-i18next";

const CheckTable = ({
  itemId,
  status,
  setIsModalOpen,
}: {
  itemId: string;
  status: string;
  setIsModalOpen: (value: boolean) => void;
}) => {
  const { t } = useTranslation();
  const { data: tableData } = useGetItemForTableQuery({
    itemId,
    status,
  });
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
      <div className="bg-white w-[900px] max-w-[95vw] max-w-full h-[579px] shadow-lg overflow-auto mb-[80px] fixed top-0 left-1/2 transform -translate-x-1/2 z-50 mt-10">
        <div className="bg-gradient-to-r from-primary-100 to-primary-400 text-white text-lg font-bold h-[65px] p-4 flex justify-center items-center">
          <p>{t("chef.duplicateTables")}</p>
        </div>

        <div className="p-10 text-lg flex flex-col items-center text-center">
          <div className="w-full">
            <Table className="w-full">
              <TableHeader className="text-sm text-black">
                <TableRow>
                  <TableHead className="p-2 w-[5%] text-center">{t("table.stt")}</TableHead>
                  <TableHead className="p-2 w-[10%] text-center">
                    {t("chef.tableName")}
                  </TableHead>
                  <TableHead className="p-2 w-[5%] text-center">
                    {t("table.quantity")}
                  </TableHead>
                  <TableHead className="p-2 w-[10%] text-center">
                    {t("table.note")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData?.map((table, index) => (
                  <TableRow key={index} className="text-center">
                    <TableCell className="p-2">{index + 1}</TableCell>
                    <TableCell className="p-2">{table.tableNumber}</TableCell>
                    <TableCell className="p-2">{table.quantity}</TableCell>
                    <TableCell className="p-2">{table.note}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-2 flex justify-center">
          <button
            className="h-8 w-[100px] text-black border border-yellow-500 rounded-2xl hover:bg-yellow-500 hover:text-white transition"
            onClick={() => setIsModalOpen(false)} // Đóng modal khi nhấn nút "Đóng"
          >
            {t("common.close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckTable;

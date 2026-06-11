import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Input from "@/ui/Input";
import {  Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/Table"; // Import the required table components
import { toast } from "sonner";
import { useGetOrderStartEndQuery } from "@/service/adminAPI";
import dayjs from "dayjs";

const ManagerRevenues = () => {
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pass an object containing startDate and endDate
  const { data, isLoading, isError, isSuccess } =
    useGetOrderStartEndQuery({
      startDate,
      endDate,
    });


  const today = new Date().toISOString().split("T")[0];



  useEffect(() => {
    if (isError) {
      toast.error(t("revenues.loadError"));
    }
  }, [isError]);

  return (
    <div className="size-full">
      <div className="h-16 flex w-full items-center px-10 bg-gradient-to-r from-primary-100 to-primary-400">
        <h3 className="text-white font-bold text-xl">{t("revenues.title")}</h3>
       
      </div>

      <div className="p-6">
        <div className="flex justify-end gap-4 mb-4 ">
          <div>
            <p className="font-bold mb-2 text-lg">{t("revenues.startDate")}</p>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={today}
              className="w-48 h-10 border border-[#7C3AED] rounded-2xl p-2 text-sm"
            />
          </div>
          <div>
            <p className="font-bold mb-2 text-lg">{t("revenues.endDate")}</p>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate }
              max={today}
              className="w-48 h-10 border border-[#7C3AED] rounded-2xl p-2 text-sm "
            />
          </div>
        </div>

        {/* Show loading state while fetching data */}
        {isLoading && <p>{t("common.loadingData")}</p>}

        {/* Render error message if the API call fails */}
        {isError && (
          <p className="text-red-500">{t("revenues.loadFail")}</p>
        )}

        {/* Display table when data is available */}
        {isSuccess && data?.result?.length > 0 && (
          <Table className="mt-5">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[10%]">{t("table.stt")}</TableHead>
                <TableHead className="text-center w-[30%]">
                  {t("revenues.phone")}
                </TableHead>
                <TableHead className="text-center w-[20%]">{t("revenues.table")}</TableHead>
                <TableHead className="text-center w-[20%]">{t("revenues.date")}</TableHead>
                <TableHead className="text-center w-[20%]">
                  {t("revenues.total")}
                </TableHead>
                <TableHead className="text-center w-[10%]">{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.result.map((item, index) => (
                <TableRow key={item._id}>
                  <TableCell className="text-center">
                    <div className="flex items-center gap-2">
                      <span>{index + 1}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span>{item.userName}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span>{item.tableName}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span>{dayjs(item.orderTime).format("DD/MM/YYYY")}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span>
                      {Number(
                        typeof item?.totalPrice === "number"
                          ? item?.totalPrice
                          : item?.totalPrice.$numberDecimal
                      ).toLocaleString("vi-VN")}{" "}
                      VNĐ
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <button className="flex items-center gap-1 bg-[#ACACAC] hover:bg-slate-500 text-white px-3 py-1 rounded-2xl">
                      <Trash2 size={16} /> {t("common.delete")}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Display message if no data is found */}
        {isSuccess && data?.result?.length === 0 && (
          <p>{t("revenues.noData")}</p>
        )}
      </div>
    </div>
  );
};

export default ManagerRevenues;

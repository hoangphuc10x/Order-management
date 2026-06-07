import { useState, useEffect } from "react";
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
      toast.error("Có lỗi xảy ra khi tải dữ liệu.");
    }
  }, [isError]);

  return (
    <div className="size-full">
      <div className="h-16 flex w-full items-center px-10 bg-gradient-to-r from-primary-100 to-primary-400">
        <h3 className="text-white font-bold text-xl">Quản lý doanh thu</h3>
       
      </div>

      <div className="p-6">
        <div className="flex justify-end gap-4 mb-4 ">
          <div>
            <p className="font-bold mb-2 text-lg">Ngày bắt đầu</p>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={today}
              className="w-48 h-10 border border-[#7C3AED] rounded-2xl p-2 text-sm"
            />
          </div>
          <div>
            <p className="font-bold mb-2 text-lg">Ngày kết thúc</p>
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
        {isLoading && <p>Đang tải dữ liệu...</p>}

        {/* Render error message if the API call fails */}
        {isError && (
          <p className="text-red-500">Không thể tải dữ liệu doanh thu.</p>
        )}

        {/* Display table when data is available */}
        {isSuccess && data?.result?.length > 0 && (
          <Table className="mt-5">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[10%]">STT</TableHead>
                <TableHead className="text-center w-[30%]">
                  Số điện thoại
                </TableHead>
                <TableHead className="text-center w-[20%]">Bàn</TableHead>
                <TableHead className="text-center w-[20%]">Ngày</TableHead>
                <TableHead className="text-center w-[20%]">
                  Thành tiền
                </TableHead>
                <TableHead className="text-center w-[10%]">Chức năng</TableHead>
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
                      <Trash2 size={16} /> Xóa
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Display message if no data is found */}
        {isSuccess && data?.result?.length === 0 && (
          <p>Không có dữ liệu doanh thu cho ngày này.</p>
        )}
      </div>
    </div>
  );
};

export default ManagerRevenues;

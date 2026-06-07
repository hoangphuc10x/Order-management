import { X } from "lucide-react";
import Loading from "../Loading";
import { useGetOreredOfTableQuery } from "@/service/orderApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/Table";
interface TableDetailProps {
  setSelectedTable: (table: null | string) => void;
  id: string;
}

const TableDetailAdmin = ({ setSelectedTable, id }: TableDetailProps) => {
  const { data, isLoading } = useGetOreredOfTableQuery(id);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
      <div className="bg-white w-[900px] max-w-full h-[579px] shadow-lg overflow-auto mb-[80px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-100 to-primary-400  text-white text-lg font-bold h-[10%] p-4 flex justify-center items-center relative ">
          <span className="">Thông tin bàn</span>
          <X
            size={24}
            className="cursor-pointer absolute right-4"
            onClick={() => setSelectedTable(null)}
          />
        </div>
        {/* Body */}
        <div className="flex-1 flex flex-col px-6 h-[90%]">
          <Table className="mt-5 border-b-2 max-h-[80%]">
            <TableHeader className="text-sm text-[#949494]">
              <TableRow>
                <TableHead className="text-center w-[5%]">STT</TableHead>
                <TableHead className="text-center w-[30%]">Tên món</TableHead>
                <TableHead className="text-center w-[5%]">Số lượng</TableHead>
                <TableHead className="text-center w-[40%]">Ghi chú</TableHead>
                <TableHead className="text-center w-[15%]">
                  Trạng thái
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-y-auto">
              {data?.order.orderItems.map((item, index) => (
                <TableRow className="font-medium" key={item._id}>
                  <TableCell className="text-center">
                    <span className="text-justify">{index + 1}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-justify">{item.name}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-justify text-primary-100">
                      {item.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-justify text-primary-100">
                      {item?.note}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`text-[2vw] lg:text-xs font-medium ${
                        item.status === "PENDING"
                          ? "text-slate-500"
                          : item.status === "PROCESSING"
                          ? "text-primary-100"
                          : item.status === "COMPLETED"
                          ? "text-blue-500"
                          : "text-green-500"
                      }`}
                    >
                      {item.status === "PENDING"
                        ? "Đang chờ"
                        : item.status === "PROCESSING"
                        ? "Đang chế biến"
                        : item.status === "COMPLETED"
                        ? "Đã xong"
                        : "Đã phục vụ"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
export default TableDetailAdmin;

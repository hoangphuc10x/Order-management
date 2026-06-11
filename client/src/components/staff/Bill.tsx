import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/Table";
import { X } from "lucide-react";
import qr from "../../assets/QR.jpg";
import { useEffect } from "react";
import { toast } from "sonner";
import { OrderedOfTable, useUpdateOrderMutation } from "@/service/orderApi";
import { STATUS } from "@/enum/status";
import { formatMoneyVND } from "../format/FormatMoney";
import { useTranslation } from "react-i18next";

const Bill = ({
  setSelectedTable,
  data,
}: {
  data: OrderedOfTable;
  setSelectedTable: (table: null | string) => void;
}) => {
  const { t } = useTranslation();
  const [updateOrder, { isSuccess }] = useUpdateOrderMutation();
  useEffect(() => {
    if (isSuccess) {
      setSelectedTable(null);
      toast.success(t("tableDetail.confirmSuccess"));
    }
  }, [isSuccess, setSelectedTable]);
  const handleExportInvoice = (id: string) => {
    updateOrder({ id, status: STATUS.COMPLETED });
  };
  return (
    <div className=" bg-white sm:w-[60vw]  shadow-lg flex flex-col gap-2 border-2 border-primary-100 pb-2  w-full h-full sm:h-screen min-h-screen ">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-100 to-primary-400  text-white text-lg font-bold sm:h-[10%] h-[5%] p-4 flex justify-center items-center relative ">
        <span className="">{t("bill.title")}</span>
        <X
          size={24}
          className="cursor-pointer absolute right-4"
          onClick={() => setSelectedTable(null)}
        />
      </div>
      {/* Body */}
      <div className=" flex flex-col sm:px-6 px-1 max-h-[60%] flex-1  ">
        <Table className="mt-5 border-b-2 max-h-[70%] overflow-y-scroll">
          <TableHeader className="text-sm text-[#949494]">
            <TableRow className="h-fit">
              <TableHead className=" w-[50%]">{t("table.name")}</TableHead>
              <TableHead className="text-center w-[25%]">{t("table.quantity")}</TableHead>
              <TableHead className="text-center w-[25%]">{t("bill.price")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-y-auto">
            {data?.order.orderItems.map((item) => (
              <TableRow className="font-medium h-fit" key={item._id}>
                <TableCell>
                  <span className="text-justify">{item.name}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-justify text-primary-100">
                    {item.quantity}
                  </span>
                </TableCell>
                <TableCell className="text-center text-slate-500 font-normal">
                  <span className=" line-clamp-2 !overflow-y-auto">
                    {formatMoneyVND(
                      Number(
                        typeof item.price === "number"
                          ? item.price
                          : item.price?.$numberDecimal
                      )
                    )}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="w-full flex flex-col gap-1 border-2 border-primary-100 rounded-lg mt-8 px-2 py-1 text-xs lg:text-base">
          <span>{t("cart.paymentInfo")}</span>
          <div className="flex justify-between">
            <span>{t("bill.foodTotalLabel")}</span>
            <span>
              {formatMoneyVND(
                Number(
                  typeof data.order.totalPrice === "number"
                    ? data.order.totalPrice
                    : data.order.totalPrice?.$numberDecimal
                )
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t("bill.discountLabel")}</span>
            {data.order.discountPercent ? (
              <span className="text-primary-100">
                {data.order.discountPercent} %
              </span>
            ) : (
              <span className="text-primary-100">
                {data.order.discountAmount} VNĐ
              </span>
            )}
          </div>
          <div className="flex justify-between">
            <span>{t("cart.total")}</span>
            <span>
              {formatMoneyVND(
                Number(
                  typeof data.order.totalPrice === "number"
                    ? data.order.totalPrice - (data.order.discountAmount ?? 0)
                    : Number(data.order.totalPrice?.$numberDecimal) -
                        (data.order.discountAmount ?? 0)
                )
              )}
            </span>
          </div>
        </div>
      </div>
      <div className="flex-col flex ">
        <div className="flex justify-center items-center w-full">
          <img src={qr} alt="" className="size-60 sm:size-40" />
        </div>
        <div className=" border-t-2 py-3">
          <div className="flex justify-center w-full my-4 sm:my-1">
            <button
              className="btn !text-white"
              onClick={() =>
                data?.order._id && handleExportInvoice(data.order._id)
              }
            >
              {t("common.complete")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bill;

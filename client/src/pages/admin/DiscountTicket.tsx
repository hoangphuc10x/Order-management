import CreateDiscountForm from "@/components/admin/CreateDiscountForm";
import Alert from "@/components/Alert";
import Loading from "@/components/Loading";
import {
  Discount,
  useDeleteDiscountMutation,
  useGetAllDiscountsQuery,
  useUpdateDiscountMutation,
} from "@/service/adminAPI";
import Panigatation from "@/ui/Panigatation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/Table";
import dayjs from "dayjs";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const DiscountTicket = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [discounts, setDiscounts] = useState<Discount[]>([]);

  const { data, isLoading, isSuccess, refetch } = useGetAllDiscountsQuery();
  const [deleteDiscount] = useDeleteDiscountMutation();
  const [updateDiscount] = useUpdateDiscountMutation();

  const ITEMS_PER_PAGE = 7;
  useEffect(() => {
    if (data?.discounts) {
      const startIndex = currentPage * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      setDiscounts(data.discounts.slice(startIndex, endIndex));
    }
  }, [isSuccess, data, currentPage]);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const handleDelete = async (id: string) => {
    const res = await deleteDiscount({ id });
    if (res.data?.success) {
      refetch();
      toast.success(t("discount.deleteSuccess"));
    } else {
      toast.error(t("discount.deleteFail"));
    }
  };
  const handleUpdate = async (id: string, active: boolean) => {
    const res = await updateDiscount({ id, active: !active });
    if (res.data?.success) {
      refetch();
      toast.success(t("discount.updateSuccess"));
    } else {
      toast.error(t("discount.updateFail"));
    }
  };
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="w-full h-full">
      <div className="h-16 flex w-full justify-between items-center px-10 bg-gradient-to-r from-primary-100 to-primary-400">
        <h3 className="text-white font-bold text-xl">{t("discount.title")}</h3>
        <button
          className="flex gap-1 py-1 px-3 items-center text-white border bg-primary-100 hover:bg-yellow-400 border-[#6D28D9] rounded-xl"
          onClick={() => setShowForm(true)}
        >
          <Plus size={20} />
          {t("discount.createTitle")}
        </button>
      </div>

      <div className="p-6">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[10%]">{t("discount.code")}</TableHead>
              <TableHead className="text-center w-[10%]">
                {t("discount.valueHeader")}{" "}
              </TableHead>
              <TableHead className="text-center w-[10%]">{t("discount.min")}</TableHead>
              <TableHead className="text-center w-[10%]">{t("discount.maxDiscount")}</TableHead>
              <TableHead className="text-center w-[15%]">
                {t("discount.createdAt")}
              </TableHead>
              <TableHead className="text-center w-[15%]">{t("discount.expiry")}</TableHead>
              <TableHead className="text-center w-[10%]">{t("table.quantity")}</TableHead>
              <TableHead className="text-center w-[10%]">{t("discount.remaining")}</TableHead>
              <TableHead className="text-center w-[10%]">{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(discounts || []).map((dis, index) => (
              <TableRow key={index} className="text-center">
                <TableCell>{dis.code}</TableCell>
                <TableCell>
                  {dis.value} {dis.type === "percentage" ? "%" : "VNĐ"}
                </TableCell>
                <TableCell>{dis.minOrderValue}</TableCell>
                <TableCell>{dis.maxDiscount}</TableCell>
                <TableCell>
                  {dayjs(dis.startDate).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell>{dayjs(dis.endDate).format("DD/MM/YYYY")}</TableCell>
                <TableCell>{dis.usageLimit === null ? t("discount.unlimited") : dis.usageLimit}</TableCell>
                <TableCell>
                  {Number(dis.usageLimit) - Number(dis.usedCount)}
                </TableCell>
                <TableCell className="flex justify-center gap-1">
                  <div
                    className={`flex items-center gap-1  hover:bg-slate-500 text-white px-2 py-1 rounded-2xl justify-center ${
                      dis.active ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    <Alert
                      btn1={t("common.cancel")}
                      btn2={dis.active ? t("discount.turnOff") : t("discount.turnOn")}
                      title={dis.active ? t("discount.turnOffTitle") : t("discount.turnOnTitle")}
                      open={dis.active ? t("discount.turnOff") : t("discount.turnOn")}
                      handleBtn2={() =>
                        handleUpdate(dis._id as string, dis.active as boolean)
                      }
                      handleBtn1={() => {}}
                    />
                  </div>
                  <div className="flex items-center gap-1 bg-[#ACACAC] hover:bg-slate-500 text-white px-2 py-1 rounded-2xl">
                    <Alert
                      btn1={t("common.cancel")}
                      btn2={t("common.delete")}
                      description={t("discount.deleteDesc")}
                      title={t("common.confirmDelete")}
                      Icon={Trash2}
                      hover={t("common.delete")}
                      handleBtn2={() => handleDelete(dis._id as string)}
                      handleBtn1={() => {}}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {showForm && (
        <CreateDiscountForm
          setShowForm={setShowForm}
          refetch={refetch} // set show form  = false
        />
      )}
      <Panigatation
        pageCount={Math.ceil((data?.discounts?.length || 0) / ITEMS_PER_PAGE)}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default DiscountTicket;

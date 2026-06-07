import Loading from "@/components/Loading";
import { STATUS } from "@/enum/status";
import { socket } from "@/provider/SocketProvider";
import { addOrderId, clearOrder } from "@/redux/slices/orderCurrentSlice";
import { useGetOreredQuery, useUpdateOrderMutation } from "@/service/orderApi";
import {
  ClipboardList,
  CookingPot,
  HandCoins,
  UserRoundCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

const OrderedTablePage = () => {
  const { id } = useParams<{ id: string }>();
  const [isCanceled, setIsCanceled] = useState(false);
  const { data, isLoading, refetch, isSuccess, isError } = useGetOreredQuery(
    id || ""
  );
  const [updateOrder] = useUpdateOrderMutation();
  const dispatch = useDispatch();

  console.log("data", data);

  useEffect(() => {
    if (data?.order?._id) {
      dispatch(addOrderId({ id: data.order._id }));
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError || data?.order?.status === "CANCELLED") {
      setIsCanceled(true);
    }
  }, [isError, data]);

  useEffect(() => {
    socket.on("orderStatusChanged", (data) => {
      console.log("orderStatusChanged", data);
      if (data) {
        if (
          data.status === STATUS.COMPLETED ||
          data.status === STATUS.CANCELLED
        ) {
          dispatch(clearOrder());
        }
        refetch();
      }
    });
    socket.on("orderItemStatusUpdated", (data) => {
      console.log("orderItemStatusUpdated", data);
      if (data) {
        refetch();
      }
    });
    return () => {
      socket.off("orderStatusChanged");
      socket.off("orderItemStatusUpdated");
    };
  }, []);

  const handlePaymentRequest = async (id: string) => {
    const res = await updateOrder({
      id,
      status: STATUS.BILL_REQUESTED,
    }).unwrap();
    if (res.success) {
      toast.success("Đã gửi yêu cầu tính tiền");
    }
  };
  if (isLoading) return <Loading />;

  return (
    <div className="w-full">
      {isCanceled ? (
        <div className="flex gap-1">
          <span>Đơn hàng đã bị hủy, xin mời bạn </span>
          <Link to="/menu" className="text-primary-100">
            đặt lại !
          </Link>
        </div>
      ) : (
        <div className="w-full flex items-center flex-col lg:gap-6 gap-3 mt-6 px-2 md:px-4 lg:px-10">
          <div className="xl:w-[30vw] w-[70vw] flex flex-col items-center gap-2">
            {data?.order?.status === STATUS.PENDING ? (
              <span className="font-bold text-[3.5vw] lg:text-[1.7vw]">
                Đang chờ xác nhận
              </span>
            ) : data?.order?.status === STATUS.CONFIRMED ? (
              <span className="font-bold text-[3.5vw] lg:text-[1.7vw]">
                Món ăn đang được chế biến
              </span>
            ) : (
              <span className="font-bold text-[3.5vw] lg:text-[1.7vw]">
                Cảm ơn quý khách
              </span>
            )}

            <div className="flex gap-1 items-center w-full ">
              <ClipboardList className="size-[4vw] lg:size-[2vw] text-primary-100 " />
              <div
                className={`relative flex-1 lg:h-[5px] h-[3px] bg-gray-300 overflow-hidden ${
                  data?.order?.status === STATUS.PENDING
                    ? "animated-border"
                    : "bg-primary-100"
                }`}
              ></div>
              <UserRoundCheck
                className={`size-[4vw] lg:size-[2vw] ${
                  data?.order?.status !== STATUS.PENDING
                    ? " text-primary-100"
                    : "text-slate-500"
                } `}
              />
              <div
                className={`relative flex-1 lg:h-[5px] h-[3px] bg-gray-300 overflow-hidden ${
                  data?.order?.status === STATUS.PENDING
                    ? ""
                    : data?.order?.status === STATUS.CONFIRMED ||
                      data?.order?.status === STATUS.PREPARING
                    ? "animated-border"
                    : "bg-primary-100"
                }`}
              ></div>
              <CookingPot
                className={`size-[4vw] lg:size-[2vw] ${
                  data?.order?.status === STATUS.ALL_SERVED ||
                  data?.order?.status === STATUS.BILL_REQUESTED ||
                  data?.order?.status === STATUS.COMPLETED
                    ? " text-primary-100"
                    : "text-slate-500"
                } `}
              />
              <div
                className={`relative flex-1 lg:h-[5px] h-[3px] bg-gray-300 overflow-hidden ${
                  data?.order?.status === STATUS.ALL_SERVED
                    ? "animated-border"
                    : data?.order?.status === STATUS.BILL_REQUESTED ||
                      data?.order?.status === STATUS.COMPLETED
                    ? "bg-primary-100"
                    : ""
                }`}
              ></div>
              <HandCoins
                className={`size-[4vw] lg:size-[2vw] ${
                  data?.order?.status === STATUS.BILL_REQUESTED ||
                  data?.order?.status === STATUS.COMPLETED
                    ? " text-primary-100"
                    : "text-slate-500"
                } `}
              />
            </div>
          </div>
          <div className="flex flex-col xl:w-[50vw] gap-4 border-2 border-primary-100 p-2 rounded w-full ">
            <h3 className="font-bold text-[3vw] xl:text-[1.2vw] lg:text-[1.5vw] underline ">
              Danh sách các món ăn đã đặt
            </h3>
            {data?.order.orderItems.map((item) => (
              <div
                key={item.itemId}
                className="flex gap-2 items-center justify-center border-b-2"
              >
                <div className="flex flex-col flex-1 justify-center gap-4">
                  <div className="flex justify-between items-center ">
                    <div className="flex gap-1 flex-col sm:flex-row">
                      <div className="flex gap-1 items-center">
                        <span className="text-[2vw] lg:text-xs text-primary-100 font-bold">
                          x{item.quantity}
                        </span>
                        <span className="xl:text-[1vw] text-[3vw] lg:text-[1.5vw]">
                          {item.name}{" "}
                        </span>
                        <span
                          className={`text-[2vw] lg:text-xs font-medium ${
                            item.status === STATUS.PENDING
                              ? "text-slate-500"
                              : item.status === STATUS.PROCESSING
                              ? "text-primary-100"
                              : item.status === STATUS.COMPLETED
                              ? "text-blue-500"
                              : "text-green-500"
                          }`}
                        >
                          {item.status === STATUS.PENDING
                            ? "Đang chờ"
                            : item.status === STATUS.PROCESSING
                            ? "Đang chế biến"
                            : item.status === STATUS.COMPLETED
                            ? "Đã xong"
                            : "Đã phục vụ"}
                        </span>
                      </div>
                    </div>
                    <span className="xl:text-[1vw] text-[3vw] lg:text-[1.5vw]">
                      {Number(
                        typeof item.price === "number"
                          ? item.price
                          : item.price.$numberDecimal
                      ).toLocaleString("vi-VN")}{" "}
                      VNĐ
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex flex-col gap-2">
              <div className="w-full bg-primary-100 rounded px-2 py-1 flex justify-between xl:text-[1vw] text-[3vw] lg:text-[1.5vw]">
                {data?.order?.status === "COMPLETED"
                  ? "Tổng tiền"
                  : "Tổng tiền tạm tính"}

                <span className="font-bold">
                  {Number(
                    typeof data?.order.totalPrice === "number"
                      ? data?.order.totalPrice
                      : data?.order.totalPrice.$numberDecimal
                  ).toLocaleString("vi-VN")}{" "}
                  VNĐ
                </span>
              </div>
              {data?.order.status === STATUS.ALL_SERVED && (
                <button
                  className="btn !text-black w-fit !bg-green-500"
                  onClick={() =>
                    data.order._id && handlePaymentRequest(data.order._id)
                  }
                >
                  Yêu cầu tính tiền
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderedTablePage;

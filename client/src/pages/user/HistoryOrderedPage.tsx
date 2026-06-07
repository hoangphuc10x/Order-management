import { useUserInfo } from "@/hook/auth";
import { useGetOreredByUserIdQuery } from "@/service/orderApi";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const HistoryOrderedPage = () => {
  const { _id } = useUserInfo();

  const { data } = useGetOreredByUserIdQuery(_id || "");

  return (
    <div className="w-full flex flex-col justify-center p-2 ">
      <div className="lg:w-[50vw] flex flex-col w-full gap-2">
        {data?.order.filter(
          (order) => order.status !== "CANCELLED" && order.status !== "COMPLETED"
        ).length !== 0 && (
          <div className="flex flex-col gap-2 w-full">
            <h3 className="font-bold">Đang hoạt động</h3>
            <div className="flex flex-1 w-full flex-col gap-2">
              {data?.order
                .filter(
                  (order) =>
                    order.status !== "CANCELLED" && order.status !== "COMPLETED"
                )
                .map((order) => (
                  <Link
                    to={`/ordered/${order._id}`}
                    key={order._id}
                    className=" animated-border-order flex flex-col px-2 py-1  w-full"
                  >
                    <div>
                      Thời gian đặt:{" "}
                      <span className="text-primary-100 ">
                        {dayjs(order.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                      </span>
                    </div>
                    <div>
                      <span>{order.orderItems[0].name} ...</span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}
        <div className="flex flex-col flex-1 ">
          <h3 className="font-bold">Gần đây</h3>
          {data?.order.filter((order) => order.status === "COMPLETED")
            .length ? (
            <div className="flex flex-col gap-2 w-full">
              {data?.order
                .filter((order) => order.status === "COMPLETED")
                .map((order) => (
                  <Link
                    to={`/ordered/${order._id}`}
                    key={order._id}
                    className=" border-2 border-secondary-100  flex flex-col px-2 py-1 rounded-lg  w-full"
                  >
                    <div>
                      Thời gian đặt:{" "}
                      <span className="text-primary-100">
                        {dayjs(order.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                      </span>
                    </div>
                    <div>
                      <span>{order.orderItems[0].name} ...</span>
                    </div>
                  </Link>
                ))}
            </div>
          ) : (
            <div className="text-secondary-100">
              Không có đơn hàng nào trước đây
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryOrderedPage;

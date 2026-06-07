import CartItem from "@/components/user/CartItem";
import { useUserInfo } from "@/hook/auth";
import { useTableInfo } from "@/hook/table";
import { clearCart } from "@/redux/slices/orderSlice";
import { RootState } from "@/redux/store";
import { useCreateOrderMutation } from "@/service/orderApi";
import { LogOut } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector((state: RootState) => {
    const foundItem = state.orderItem.items;
    return foundItem;
  });

  const id = useSelector((state: RootState) => {
    return state.orderId.id;
  });

  const { _id: userId } = useUserInfo();
  const { _id: tableId, tableNumber } = useTableInfo();

  const orderItems = items.map((item) => ({
    itemId: item.id,
    quantity: item.quantity,
    price: item.price,
    note: item.note,
  }));

  const total = (items || []).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const [createOrder, { isSuccess, isError, data }] = useCreateOrderMutation();

  useEffect(() => {
    if (isSuccess && data.newOrder._id) {
      dispatch(clearCart());
      navigate(`/ordered/${data.newOrder._id}`);
      toast.success("Gửi yêu cầu gọi món thành công !");
    }
    if (isError) {
      toast.error("Gửi yêu cầu gọi món thất bại !");
    }
  }, [isSuccess, isError, data]);

  const handleSubmid = () => {
    console.log("orderItem", orderItems);
    if (!userId) {
      toast.error("Vui lòng đăng nhập!");
      return;
    }
    if (orderItems.length) {
      if (id) {
        createOrder({
          tableId,
          orderId: id,
          userId,
          totalPrice: total,
          orderItems: orderItems,
        });
      } else {
        createOrder({
          tableId,
          userId,
          totalPrice: total,
          orderItems: orderItems,
        });
      }
    } else {
      toast.error("Bạn chưa có món nào trong giỏ hàng !");
    }
  };

  return (
    <div className="xl:w-[50vw] sm:px-5 flex flex-col items-center py-4 w-full px-2 gap-5">
      <h3 className="font-bold lg:text-2xl text-xl text-primary-100">
        Các món đã chọn
      </h3>
      <div className="w-full">
        <div className=" w-fit border-b-2 text-xs lg:text-base border-black">
          <span>Gọi món tại bàn:</span>
          <span className="font-bold text-primary-100"> {tableNumber}</span>
        </div>
        <div className="flex flex-col gap-3 mt-3 text-xs lg:text-base">
          <div className="flex justify-between items-center border-2 border-primary-100 rounded-lg px-2 py-1">
            <div className="">
              <span className="font-medium">Món đã chọn</span>
              <span className="text-primary-100"> {items.length || 0}</span>
            </div>
            <Link
              to="/menu"
              className="px-2 py-1 rounded-lg bg-primary-100 text-white"
            >
              Thêm món +
            </Link>
          </div>
          <div className="flex flex-col gap-1 border-2 border-primary-100 rounded-lg p-2">
            {items.length ? (
              (items || []).map((item) => (
                <CartItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  quantity={item.quantity}
                  note={item.note}
                  imageUrl={item.imageUrl}
                />
              ))
            ) : (
              <p className="text-red-600">Chưa có món nào trong giỏ!</p>
            )}
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col font-medium  gap-1 border-2 border-primary-100 rounded-lg px-2 py-1 text-xs lg:text-base">
        <span>Thông tin thanh toán</span>
        <div className="flex justify-between">
          <span>Tổng tiền món ăn</span>
          <span className="text-primary-100">
            {total.toLocaleString("vi-VN")} VNĐ
          </span>
        </div>
        <div className="flex justify-between">
          <span>Tổng tiền</span>
          <span className="text-primary-100">
            {total.toLocaleString("vi-VN")} VNĐ
          </span>
        </div>
      </div>
      <button
        onClick={handleSubmid}
        className="bg-primary-100 text-white py-1 px-2 rounded-lg mt-4 flex gap-1 items-center text-xs lg:text-base hover:bg-primary-400"
      >
        Gửi yêu cầu gọi món <LogOut className="lg:size-[1.1vw] size-[3vw]" />
      </button>
    </div>
  );
};

export default CartPage;

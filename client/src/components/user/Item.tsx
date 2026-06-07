import { Minus, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "@/redux/slices/orderSlice";
import { RootState } from "@/redux/store";
import { Link } from "react-router-dom";

interface ItemProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  note?: string;
  isAvailable: boolean;
}
const Item = (item: ItemProps) => {
  const dispatch = useDispatch();

  const quantity = useSelector((state: RootState) => {
    const foundItem = state.orderItem.items.find(
      (cartItem) => cartItem.id === item.id
    );
    return foundItem ? foundItem.quantity : 0;
  });

  const handleAddOrderClick = (item: ItemProps) => {
    dispatch(addToCart({ ...item, quantity: quantity + 1 }));
  };

  const handleMinusOrderClick = (item: ItemProps) => {
    dispatch(removeFromCart({ ...item, quantity: quantity - 1 }));
  };
  return (
    <div className="relative">
      <div
        className={`w-full h-full absolute bg-slate-500/50 rounded-xl z-10 ${
          item.isAvailable ? "hidden" : "block"
        }`}
      ></div>
      <div className="flex flex-col items-center sm:w-72  rounded-xl bg-primary-100  sm:text-[1.5vw] text-[1.6vh] gap-2 shadow-xl drop-shadow-lg relative pb-10 sm:h-[410px] h-72 z-0 w-48 border-2 border-primary-200">
        <Link to={`/menu/${item.id}`} className="w-full h-2/3">
          <img
            src={item.imageUrl || "https://placehold.co/600x400"}
            alt=""
            className="w-full h-full rounded-t-xl object-cover"
          />
        </Link>
        <span className="font-bold text-center px-2 ">{item.name}</span>
        <span>{item.price.toLocaleString("vi-VN")} VNĐ</span>
        <div className="flex justify-end items-center w-full absolute bottom-2 px-4">
          {quantity === 0 ? (
            <button
              className="flex  justify-end items-end   "
              onClick={() => handleAddOrderClick(item)}
            >
              <Plus color="#FBBC05" className="p-1 bg-black rounded-lg" />
            </button>
          ) : (
            <div className="flex w-full justify-end items-end flex-1 ">
              <div className="w-fit flex gap-2 justify-center items-center border-primary-300 bg-white rounded-xl ">
                <button
                  className="flex w-fit justify-end items-end "
                  onClick={() => handleMinusOrderClick(item)}
                >
                  <Minus color="#D9D9D9" className="p-1 " />
                </button>
                <span className="text-xs lg:text-sm">{quantity}</span>
                <button
                  className="flex w-fit justify-end items-end "
                  onClick={() => handleAddOrderClick(item)}
                >
                  <Plus color="#D9D9D9" className="p-1 " />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Item;

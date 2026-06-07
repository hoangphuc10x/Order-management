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
      <div className="group flex flex-col sm:w-72 w-48 rounded-2xl bg-white sm:text-[1.5vw] text-[1.6vh] shadow-md hover:shadow-xl relative pb-12 sm:h-[410px] h-72 z-0 border border-gray-200 overflow-hidden transition-all duration-200">
        <Link to={`/menu/${item.id}`} className="w-full h-2/3 overflow-hidden block">
          <img
            src={item.imageUrl || "https://placehold.co/600x400"}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <div className="flex flex-col flex-1 px-3 pt-2">
          <span className="font-bold text-gray-800 line-clamp-1">{item.name}</span>
          <span className="text-gray-500">
            {item.price.toLocaleString("vi-VN")} VNĐ
          </span>
        </div>
        <div className="flex justify-end items-center w-full absolute bottom-3 px-4">
          {quantity === 0 ? (
            <button
              className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-primary-100 to-primary-400 rounded-full hover:opacity-90 shadow-md transition-opacity"
              onClick={() => handleAddOrderClick(item)}
            >
              <Plus className="text-white" size={18} />
            </button>
          ) : (
            <div className="flex gap-3 justify-center items-center bg-gradient-to-br from-primary-100 to-primary-400 text-white rounded-full px-2 py-1 shadow-md">
              <button onClick={() => handleMinusOrderClick(item)}>
                <Minus size={16} />
              </button>
              <span className="text-xs lg:text-sm">{quantity}</span>
              <button onClick={() => handleAddOrderClick(item)}>
                <Plus size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Item;

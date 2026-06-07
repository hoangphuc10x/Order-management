import { removeItems } from "@/redux/slices/orderSlice";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
const CartItem = ({
  quantity,
  price,
  name,
  id,
  note,
  imageUrl,
}: {
  quantity: number;
  price: number;
  name: string;
  id: string;
  note?: string;
  imageUrl: string;
}) => {

  const dispatch = useDispatch();;

  const [swipeOffset, setSwipeOffset] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);


  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping || startX === null) return;
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;
    if (deltaX < 0) {
      setSwipeOffset(Math.max(deltaX, -60)); // giới hạn kéo trái
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    if (swipeOffset < -40) {
      setSwipeOffset(-60); // giữ lại nếu kéo đủ xa
    } else {
      setSwipeOffset(0); // quay về nếu không đủ
    }
    setStartX(null);
  };

  const handleReset = () => {
    setSwipeOffset(0);
  };
  return (
    <div className="relative w-full overflow-hidden">
      {/* Nút Xóa */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[50px]  bg-red-500 text-white flex items-center justify-center z-0 h-full hover:cursor-pointer"
        onClick={() => dispatch(removeItems({id}))}
      >
        <TrashIcon />
      </div>

      {/* Nội dung chính */}
      <div
        className="relative z-10 bg-white transition-transform duration-200 ease-in-out"
        style={{ transform: `translateX(${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleReset}
      >
        <div className="flex gap-2 items-center pb-2 justify-center border-b-2 w-full">
          <img
            src={imageUrl}
            alt=""
            className="lg:size-[10vw] size-[13vw] rounded-sm object-cover"
          />
          <div className="flex flex-col flex-1 justify-center gap-4 w-full">
            <div className="flex justify-between items-center">
              <div>
                <span>{name} </span>
                <span className="text-sm text-primary-100 font-bold">
                  x{quantity}
                </span>
              </div>
              <span className="font-medium text-primary-100">
                {(price * quantity).toLocaleString("vi-VN")} VNĐ
              </span>
            </div>
            <div className="flex w-[70%]">
              <Link to={`/menu/${id}`} className="text-primary-100">
                Chỉnh sửa
              </Link>
              {note && (
                <span className="ml-5 line-clamp-2 text-slate-500 flex-1">
                  *{`(${note})`}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;

import { Minus, Plus } from "lucide-react";
import { useGetMenuItemByIdQuery } from "@/service/menuItemApi";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "@/components/Loading";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { addToCart } from "@/redux/slices/orderSlice";
import { useTranslation } from "react-i18next";
const DetailItem = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  
  const { data, isLoading } = useGetMenuItemByIdQuery({ id: id || "" });

  const quantityInitial = useSelector((state: RootState) => {
    const foundItem = state.orderItem.items.find(
      (cartItem) => cartItem.id === id
    );
    return foundItem ? foundItem.quantity : 1;
  });

  const noticeInStore = useSelector((state: RootState) => {
    const foundItem = state.orderItem.items.find(
      (cartItem) => cartItem.id === id
    );
    return foundItem?.note || "";
  });

  const [quantity, setQuantity] = useState(quantityInitial);
  const [notice, setNotice] = useState<string>(noticeInStore);

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };
  if (isLoading) {
    return <Loading />;
  }

  const handleSubmitCart = () => {
    dispatch(
      addToCart({
        id: data?.result._id || "",
        name: data?.result.name || "",
        price: Number(data?.result?.price?.$numberDecimal) || 0,
        quantity: quantity,
        note: notice,
        imageUrl: data?.result.imageUrl || ""
      })
    );
    navigate("/cart");
  };

  return (
    <div className="flex-1 flex w-full flex-col gap-2 lg:px-6 pb-3">
      <div className="flex flex-col lg:flex-row lg:gap-6 gap-2 ">
        <img src={data?.result.imageUrl || "https://placehold.co/600x400"} alt="" className="lg:size-[40vw] w-full" />
        <div className="flex flex-col px-3 lg:px-10 lg:gap-6 gap-1">
          <div className="flex justify-between items-center font-bold lg:text-4xl text-primary-100">
            <h4>{data?.result?.name}</h4>
            <span>
              {Number(data?.result.price.$numberDecimal).toLocaleString(
                "vi-VN"
              )}{" "}
              VNĐ
            </span>
          </div>
          <span className="lg:text-xl lg:px-4 text-xs text-slate-500">
            {data?.result.description}
          </span>
          <div className="flex flex-col lg:gap-2 gap-1 lg:px-4 text-xs lg:text-base text-slate-500">
            <h3 className="italic">{t("detailItem.mainIngredients")}</h3>
            <span>
              Thịt heo: Thịt ba chỉ hoặc thịt mông được luộc chín vừa phải, giữ
              nguyên độ mềm ngọt và có lớp da giòn nhẹ.
            </span>
            <span>
              Bánh tráng: Loại bánh tráng phơi sương dẻo dai để cuốn, kết hợp
              với một lớp bánh ướt mềm mịn giúp tăng độ dẻo.
            </span>
            <span>
              Rau sống: Gồm nhiều loại rau tươi như xà lách, húng quế, diếp cá,
              rau thơm, dưa leo, chuối chát và giá đỗ.
            </span>
            <span>
              Nước chấm: Linh hồn của món ăn chính là mắm nêm – một loại mắm cá
              lên men pha chế cùng tỏi, ớt, dứa băm nhuyễn và đường, tạo nên vị
              mặn ngọt hài hòa.
            </span>
          </div>

          <textarea
            placeholder={t("detailItem.notePlaceholder")}
            className="border-2 rounded-lg outline-none px-2 py-1 flex-1 text-xs lg:text-base  resize-none border-primary-300"
            value={notice}
            onChange={(e) => setNotice(e.target.value)}
          />
          <div className="flex justify-around items-center mt-3 text-sm lg:text-base ">
            <div className="w-fit flex gap-2 justify-center items-center border-primary-300 bg-white rounded-xl border-2">
              <button
                className="flex w-fit justify-end items-end"
                onClick={handleDecrease}
              >
                <Minus color="#D9D9D9" className="p-1 " />
              </button>
              <span className="text-xs text-slate-500 font-bold">
                {quantity}
              </span>
              <button
                className="flex w-fit justify-end items-end"
                onClick={handleIncrease}
              >
                <Plus color="#D9D9D9" className="p-1 " />
              </button>
            </div>
            <div className=" bg-white text-primary-300 rounded-xl border-2 border-primary-300 px-2 hover:bg-primary-400">
              <button onClick={handleSubmitCart}>
                {quantityInitial
                  ? `${t("detailItem.updateCart")}: ${(
                      Number(data?.result.price.$numberDecimal) * quantity
                    ).toLocaleString("vi-VN")} VNĐ`
                  : `${t("detailItem.addToCart")}: ${(
                      Number(data?.result.price.$numberDecimal) * quantity
                    ).toLocaleString("vi-VN")} VNĐ`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailItem;

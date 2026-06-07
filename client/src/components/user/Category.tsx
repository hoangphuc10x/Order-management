import { ArrowRight } from "lucide-react";
import Item from "./Item";
import { FoodItem, useGetAllMenuItemsQuery } from "@/service/menuItemApi";
import { useEffect, useState } from "react";
import Loading from "../Loading";

const Category = ({
  categories,
  inputSearch,
}: {
  categories: string[];
  inputSearch: string;
}) => {
  const { data, isSuccess, isLoading, isFetching } = useGetAllMenuItemsQuery();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [isShowMore, setIsShowMore] = useState(false);

  const removeVietnameseTones = (str: string): string => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove diacritics
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  const currentItems = isShowMore ? foodItems : foodItems.slice(0, 8);

  useEffect(() => {
    if (isSuccess) {
      setFoodItems(
        data?.result.filter((item) => {
          const matchCategory =
            categories.length === 0 || categories.includes(item.categoryId);
          const matchSearch = removeVietnameseTones(
            item.name.toLowerCase()
          ).includes(removeVietnameseTones(inputSearch.toLowerCase()));
          return matchCategory && matchSearch;
        }) ?? []
      );
    }
  }, [data, isSuccess, isFetching, categories, inputSearch]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-4 lg:mt-[3vh] mt-[1vh] w-full items-center">
      <h3 className="font-bold text-[3vw] md:text-[2vw] lg:text-[1.5vw] text-primary-100">
        Sản phẩm
      </h3>
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6 flex-1 justify-items-center w-full">
        {currentItems.map((item) => (
          <Item
            key={item._id}
            id={item._id}
            name={item.name}
            price={item.price}
            imageUrl={item.imageUrl}
            isAvailable={item.isAvailable}
          />
        ))}
      </div>
      {foodItems.length > 8 && (
        <button
          className="lg:mt-5 flex gap-2 items-center lg:text-[1.3vw] text-[1.3vh] btn"
          onClick={() => setIsShowMore(!isShowMore)}
        >
          {isShowMore ? "Thu gọn" : "Xem thêm sản phẩm"}
          <ArrowRight size={20} />
        </button>
      )}
    </div>
  );
};

export default Category;

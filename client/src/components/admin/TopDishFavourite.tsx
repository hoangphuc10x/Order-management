import { BestSale, useGetItemsBestSaleQuery } from "@/service/adminAPI";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/Table";
import SortIcon from "@/icons/SortIcon";
import { useEffect, useState } from "react";

const TopDishFavourite = () => {
  const [favorite, setFavorite] = useState<BestSale[]>([]);
  const { data, isFetching } = useGetItemsBestSaleQuery();
  
  useEffect(() => {
    if (data?.result) {
      setFavorite(data.result);
    }
  }, [isFetching, data])

  const handleSort = () => {
    const sortedData = [...(data?.result || [])].sort((a, b) => {
      return Number(b.count) - Number(a.count);
    });
    setFavorite(sortedData);
  }

  console.log( "favorite", favorite);

  return (
    <div className="bg-white p-5 h-full rounded border-2">
      <div className="flex justify-between items-center text-text-100">
        <h3 className="text-xl font-medium">Top món ăn được yêu thích</h3>
        <div
          className="flex items-center text-[12px] font-bold px-3 py-1 bg-[#F6F6F6] rounded-xl gap-2 cursor-pointer hover:bg-secondary-100"
          onClick={() => {
            handleSort();
          }}
        >
          <span>Sắp xếp</span>
          <SortIcon />
        </div>
      </div>
      <Table className="mt-5">
        <TableHeader className="text-sm text-[#949494]">
          <TableRow>
            <TableHead className="text-center w-[5%]">STT</TableHead>
            <TableHead className="text-center w-[45%]">Tên món ăn</TableHead>
            <TableHead className="text-center w-[30%]">Loại món ăn</TableHead>
            <TableHead className="text-center w-[20%]">Số lượt đặt</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {favorite.slice(0, 5).map((item, index) => (
            <TableRow className="font-medium" key={index}>
              <TableCell className="text-center">
                <span>{index + 1}</span>
              </TableCell>
              <TableCell className="text-center">
                <span>{item?.name}</span>
              </TableCell>
              <TableCell className="text-center">
                <span>{item?.categoryName}</span>
              </TableCell>
              <TableCell className="text-center">
                <span>{item?.count}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TopDishFavourite;

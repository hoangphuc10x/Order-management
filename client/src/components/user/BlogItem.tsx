import { CalendarDays } from "lucide-react";
import blog from "../../assets/Blog.png";

const BlogItem = () => {
  return (
    <div className="w-full p-1 flex flex-col items-center bg-primary-100 ">
      <img className="w-fit " src={blog} alt="" />
      <h3 className="font-bold my-3">Ẩm thực đà nẵng lọt tóp thế giới</h3>
      <div className=" w-full flex justify-around mb-1">
        <span className="flex gap-1"><CalendarDays />October 28, 2023</span>
        <span>Đầu bếp Minh</span>
      </div>
      <span className="w-full p-1 line-clamp-4 h-1/4 border-slate-800 border overflow-hidden text-ellipsis">
        Đến với Đà Nẵng, du khách không thể bỏ qua cơ hội thưởng thức những món
        ăn đặc sản trứ danh, mang đậm hương vị của miền Trung. Ẩm thực Đà Nẵng
        là sự kết hợp hài hòa giữa hương vị dân dã
      </span>
      <button className="mt-2 mb-1 btn !text-primary-100 !bg-black">Đọc thêm</button>
    </div>
  );
};

export default BlogItem;

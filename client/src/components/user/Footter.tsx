import Contact from "@/icons/Contact";
import Logo from "@/icons/Logo";

const Footter = () => {
  return (
    <div className="relative w-full bg-primary-600 lg:py-16 mt-2 lg:mt-6">
      <div className="absolute left-6 lg:top-14  "><Logo width="150" height="40" /></div>
      <div className="h-fit  text-black grid lg:grid-cols-4 lg:grid-rows-1 lg:gap-2 w-full lg:px-16 px-10 pt-10 pb-20">
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-bold lg:text-lg">Liên Hệ</h3>
          <div className="flex lg:flex-col flex-row gap-8 lg:gap-3 text-slate-600 text-xs lg:text-sm  ">
            <span>Hotline: +(123) 456-7890</span>
            <span>Mail: foodorder@gmail.com</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-bold lg:text-lg">Hỗ trợ khách hàng</h3>
          <div className="flex lg:flex-col flex-row gap-8 lg:gap-3 text-slate-600 text-xs lg:text-sm">
            <span>Câu hỏi thường gặp</span>
            <span>Hướng dẫn thanh toán</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-bold lg:text-lg">Khu Vực</h3>
          <div className="flex lg:flex-col flex-row gap-8 lg:gap-3 text-slate-600 text-xs lg:text-sm">
            <span>Đà nẵng</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-bold lg:text-lg">Ứng Dụng & Đối Tác</h3>
          <div className="flex lg:flex-col flex-row gap-8 lg:gap-3 text-slate-600 text-xs lg:text-sm">
            <span>Tải ứng dụng</span>
            <span>Bản đồ vị trí nhà hàng</span>
          </div>
        </div>
      </div>
      <div className=" absolute lg:bottom-8 bottom-1 left-4 "> <Contact/></div>
    </div>
  );
};

export default Footter;


import background from "../../assets/BackgroundHomePage.png";
import Footter from "@/components/user/Footter";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col absolute top-0 w-full">
      <div className="relative h-fit w-full text-white leading-none">
          <img src={background} alt="" className="w-full block" />
          <div className="absolute w-full h-full flex flex-col top-0">
            <div className="w-full h-[50%] flex flex-col">

              {/* Ô tìm kiếm */}
              
            </div>

            {/* Tiêu đề trang */}
            <div className="flex-1 relative lg:text-[1.8vw] text-[2.7vw]  font-akaya">
              <span className="absolute top-3 lg:top-0 left-[20%]">
                {t("home.title")}
              </span>
              <span className="absolute top-[40%] left-1/2 lg:w-[30%] w-[45vw] transform -translate-x-1/2">
                {t("home.subtitle")}
              </span>
            </div>
          </div>
        </div>
      <Footter />
    </div>
  );
};

export default HomePage;

import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { useTranslation } from "react-i18next";
import Logo from "@/icons/Logo";

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 text-center bg-gradient-to-br from-primary-100 to-primary-400">
      <Link to="/" className="mb-10">
        <Logo className="w-[40vw] sm:w-[18vw] lg:w-[10vw]" fill="white" />
      </Link>

      <h1 className="text-white font-bold leading-none text-[28vw] sm:text-[18vw] lg:text-[12vw] drop-shadow-lg">
        404
      </h1>

      <h2 className="mt-2 text-white text-2xl sm:text-3xl font-semibold">
        {t("notFound.title")}
      </h2>

      <p className="mt-3 max-w-md text-white/80 text-sm sm:text-base">
        {t("notFound.description")}
      </p>

      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 bg-white text-primary-100 font-semibold rounded-lg px-6 py-3 shadow-md hover:opacity-90 transition-opacity"
      >
        <Home size={18} />
        {t("notFound.home")}
      </Link>
    </div>
  );
};

export default NotFoundPage;

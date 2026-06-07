import Contact from "@/icons/Contact";
import Logo from "@/icons/Logo";
import { useTranslation } from "react-i18next";

const FooterCol = ({ title, items }: { title: string; items: string[] }) => (
  <div className="flex flex-col gap-3">
    <h3 className="text-sm lg:text-base font-bold">{title}</h3>
    <ul className="flex flex-col gap-2 text-xs lg:text-sm text-white/75">
      {items.map((it) => (
        <li key={it} className="hover:text-white transition-colors cursor-pointer">
          {it}
        </li>
      ))}
    </ul>
  </div>
);

const Footter = () => {
  const { t } = useTranslation();
  return (
    <footer className="w-full bg-gradient-to-br from-primary-100 via-primary-300 to-primary-400 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-12">
        {/* Hàng trên: thương hiệu + các cột thông tin */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-3">
            <Logo width="150" height="40" fill="white" />
            <p className="text-sm text-white/75 leading-relaxed">
              {t("footer.slogan")}
            </p>
          </div>

          <FooterCol
            title={t("footer.contact")}
            items={[
              `${t("footer.hotline")}: +(123) 456-7890`,
              `${t("footer.email")}: foodorder@gmail.com`,
            ]}
          />
          <FooterCol
            title={t("footer.support")}
            items={[t("footer.faq"), t("footer.paymentGuide")]}
          />
          <FooterCol title={t("footer.area")} items={[t("footer.danang")]} />
          <FooterCol
            title={t("footer.partners")}
            items={[t("footer.downloadApp"), t("footer.map")]}
          />
        </div>

        {/* Đường kẻ phân cách */}
        <div className="h-px bg-white/20 my-8" />

        {/* Hàng dưới: mạng xã hội + bản quyền */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Contact />
          <p className="text-xs text-white/70">{t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footter;

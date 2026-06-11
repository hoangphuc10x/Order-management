import { Search, QrCode, Building2, Link2, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

const CreateQRPaymentPage = () => {
  const { t } = useTranslation();
  // Các điều kiện cần có trước khi có thể tạo QR thanh toán
  const REQUIREMENTS = [
    {
      Icon: Building2,
      title: t("qr.bankAccount"),
      desc: t("qr.bankAccountDesc"),
    },
    {
      Icon: Link2,
      title: t("qr.gateway"),
      desc: t("qr.gatewayDesc"),
    },
    {
      Icon: ShieldCheck,
      title: t("qr.verify"),
      desc: t("qr.verifyDesc"),
    },
  ];
  return (
    <div className="size-full overflow-y-auto">
      <div className="h-16 flex w-full items-center px-10 bg-gradient-to-r from-primary-100 to-primary-400">
        <h3 className="text-white font-bold text-xl whitespace-nowrap">
          {t("qr.title")}
        </h3>
        <div className="flex flex-1 justify-center">
          <div className="flex gap-4 items-center bg-white rounded-xl px-2 py-1 w-[20vw]">
            <Search size={20} color="#6F767E" />
            <input
              placeholder={t("common.search")}
              className="text-sm px-2 py-1 border-none outline-none w-full"
            />
          </div>
        </div>
      </div>

      {/* Trạng thái: chưa thể tạo QR + chú thích lý do */}
      <div className="flex justify-center px-6 py-12">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-secondary-100 flex items-center justify-center text-gray-400 mb-5">
            <QrCode size={40} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            {t("qr.cannotCreate")}
          </h2>
          <p className="mt-2 text-gray-500">
            {t("qr.cannotCreateDesc")}
          </p>

          <div className="mt-6 space-y-3 text-left">
            {REQUIREMENTS.map(({ Icon, title, desc }, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100"
              >
                <div className="shrink-0 w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-primary-100">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-700">{title}</p>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
                <span className="ml-auto self-center text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full whitespace-nowrap">
                  {t("qr.notConfigured")}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm text-gray-400">
            {t("qr.footer")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateQRPaymentPage;

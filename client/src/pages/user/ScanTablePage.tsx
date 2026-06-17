import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ScanLine } from "lucide-react";
import { toast } from "sonner";
import QrScanner from "@/components/QrScanner";

// Khách đã đăng nhập nhưng chưa quét bàn: hướng dẫn + mở camera quét QR đặt món.
const ScanTablePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);

  const handleScan = (text: string) => {
    setScanning(false);
    // Nội dung QR của bàn có dạng `${URL_CLIENT}/<slug>/check`.
    let path = text;
    try {
      path = new URL(text).pathname;
    } catch {
      // Không phải URL đầy đủ -> dùng nguyên chuỗi.
    }
    const match = path.match(/\/([^/]+)\/check/);
    if (match?.[1]) {
      navigate(`/${match[1]}/check`);
    } else {
      toast.error(t("scan.invalidQr"));
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-5 mt-16 px-6 text-center">
      <div className="size-24 rounded-full bg-secondary-100 flex items-center justify-center">
        <ScanLine className="size-12 text-primary-100" />
      </div>
      <h3 className="font-bold text-[5vw] lg:text-[1.8vw] text-primary-100">
        {t("scan.guideTitle")}
      </h3>
      <p className="text-slate-600 text-[3.5vw] lg:text-[1.1vw] max-w-[600px]">
        {t("scan.guideDesc")}
      </p>
      <button
        onClick={() => setScanning(true)}
        className="btn !text-white flex items-center gap-2 !px-6 !py-3 text-base"
      >
        <ScanLine size={20} />
        {t("scan.scanBtn")}
      </button>

      {scanning && (
        <QrScanner onScan={handleScan} onClose={() => setScanning(false)} />
      )}
    </div>
  );
};

export default ScanTablePage;

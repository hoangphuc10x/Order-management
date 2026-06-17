import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useTranslation } from "react-i18next";

const SCANNER_ID = "qr-scanner-region";

// Lớp phủ toàn màn hình mở camera (ưu tiên camera sau trên điện thoại) để quét QR.
const QrScanner = ({
  onScan,
  onClose,
}: {
  onScan: (text: string) => void;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const handledRef = useRef(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const scanner = new Html5Qrcode(SCANNER_ID);
    let active = true;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          if (handledRef.current) return;
          handledRef.current = true;
          scanner
            .stop()
            .catch(() => {})
            .finally(() => onScan(decodedText));
        },
        () => {
          // Bỏ qua lỗi giải mã từng khung hình.
        }
      )
      .catch((err) => {
        if (active) setError(t("scan.cameraError"));
        console.error("QR start error", err);
      });

    return () => {
      active = false;
      scanner
        .stop()
        .catch(() => {})
        .finally(() => {
          try {
            scanner.clear();
          } catch {
            // ignore
          }
        });
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[420px] flex flex-col items-center gap-4">
        <div
          id={SCANNER_ID}
          className="w-full aspect-square rounded-lg overflow-hidden bg-black"
        />
        {error ? (
          <p className="text-red-400 text-center text-sm px-4">{error}</p>
        ) : (
          <p className="text-white text-center text-sm">{t("scan.aiming")}</p>
        )}
        <button
          onClick={onClose}
          className="btn !bg-white !text-primary-100 border-2 border-primary-100"
        >
          {t("common.close")}
        </button>
      </div>
    </div>
  );
};

export default QrScanner;

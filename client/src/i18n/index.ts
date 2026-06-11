import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import vi from "./locales/vi";
import en from "./locales/en";
import ja from "./locales/ja";
import ko from "./locales/ko";
import zh from "./locales/zh";

// Danh sách ngôn ngữ hỗ trợ (dùng cho bộ chuyển ngôn ngữ)
export const LANGUAGES = [
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
] as const;

const resources = { vi, en, ja, ko, zh };

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "vi",
    supportedLngs: LANGUAGES.map((l) => l.code),
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;

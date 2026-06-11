import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe, ChevronDown, Check } from "lucide-react";
import { LANGUAGES } from "@/i18n";

interface Props {
  /** "light" cho header nền gradient (chữ trắng), "dark" cho nền trắng */
  variant?: "light" | "dark";
}

const LanguageSwitcher = ({ variant = "light" }: Props) => {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);

  const current =
    LANGUAGES.find((l) => i18n.language?.startsWith(l.code)) || LANGUAGES[0];

  const changeLang = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  const triggerClass =
    variant === "light"
      ? "text-white hover:bg-white/15"
      : "text-gray-700 hover:bg-slate-100";

  return (
    <div className="relative shrink-0">
      <button
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full cursor-pointer transition-colors ${triggerClass}`}
        onClick={() => setOpen(!open)}
        aria-label={t("misc.changeLanguage")}
      >
        <Globe size={18} />
        <span className="text-sm font-medium hidden sm:inline">
          {current.flag} {current.code.toUpperCase()}
        </span>
        <span className="text-sm sm:hidden">{current.flag}</span>
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-11 right-0 z-20 bg-white shadow-lg rounded-xl w-44 border border-gray-100 overflow-hidden py-1">
            {LANGUAGES.map((lang) => {
              const active = current.code === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => changeLang(lang.code)}
                  className={`flex items-center justify-between w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-slate-100 transition-colors ${
                    active ? "font-semibold text-primary-100" : ""
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{lang.flag}</span>
                    {lang.label}
                  </span>
                  {active && <Check size={16} className="text-primary-100" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;

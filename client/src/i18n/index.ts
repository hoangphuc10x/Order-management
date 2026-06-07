import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Danh sách ngôn ngữ hỗ trợ (dùng cho bộ chuyển ngôn ngữ)
export const LANGUAGES = [
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
] as const;

const resources = {
  vi: {
    translation: {
      nav: {
        home: "Trang chủ",
        menu: "Menu",
        blog: "Diễn đàn",
        history: "Lịch sử",
        login: "Đăng nhập",
        dashboard: "Tới trang quản lý",
        staff: "Tới trang chính",
        kitchen: "Tới bếp",
      },
      common: { logout: "Đăng xuất" },
      menu: {
        searchPlaceholder: "Tìm kiếm món ăn...",
        products: "Sản phẩm",
        showMore: "Xem thêm sản phẩm",
        collapse: "Thu gọn",
        clearFilter: "Xóa lọc",
        noFood: "Không tìm thấy món ăn nào",
      },
      home: {
        title: "Tinh hoa ẩm thực Đà Nẵng.",
        subtitle:
          "Nhà hàng mang đậm hương vị Đà Nẵng, giữ nguyên hương vị truyền thống.",
      },
      footer: {
        slogan: "Tinh hoa ẩm thực Đà Nẵng, mang đậm hương vị truyền thống.",
        contact: "Liên Hệ",
        support: "Hỗ trợ khách hàng",
        area: "Khu Vực",
        partners: "Ứng Dụng & Đối Tác",
        faq: "Câu hỏi thường gặp",
        paymentGuide: "Hướng dẫn thanh toán",
        danang: "Đà Nẵng",
        downloadApp: "Tải ứng dụng",
        map: "Bản đồ vị trí nhà hàng",
        hotline: "Hotline",
        email: "Email",
        rights: "© 2024 Food Order. Bảo lưu mọi quyền.",
      },
    },
  },
  en: {
    translation: {
      nav: {
        home: "Home",
        menu: "Menu",
        blog: "Blog",
        history: "History",
        login: "Login",
        dashboard: "Go to dashboard",
        staff: "Go to main page",
        kitchen: "Go to kitchen",
      },
      common: { logout: "Logout" },
      menu: {
        searchPlaceholder: "Search for food...",
        products: "Products",
        showMore: "Show more",
        collapse: "Collapse",
        clearFilter: "Clear filter",
        noFood: "No food found",
      },
      home: {
        title: "The essence of Da Nang cuisine.",
        subtitle:
          "A restaurant rich in Da Nang flavors, preserving the traditional taste.",
      },
      footer: {
        slogan:
          "The essence of Da Nang cuisine, rich in traditional flavors.",
        contact: "Contact",
        support: "Customer Support",
        area: "Area",
        partners: "Apps & Partners",
        faq: "FAQ",
        paymentGuide: "Payment guide",
        danang: "Da Nang",
        downloadApp: "Download app",
        map: "Restaurant location map",
        hotline: "Hotline",
        email: "Email",
        rights: "© 2024 Food Order. All rights reserved.",
      },
    },
  },
  ja: {
    translation: {
      nav: {
        home: "ホーム",
        menu: "メニュー",
        blog: "ブログ",
        history: "履歴",
        login: "ログイン",
        dashboard: "管理ページへ",
        staff: "メインページへ",
        kitchen: "キッチンへ",
      },
      common: { logout: "ログアウト" },
      menu: {
        searchPlaceholder: "料理を検索...",
        products: "商品",
        showMore: "もっと見る",
        collapse: "折りたたむ",
        clearFilter: "フィルター解除",
        noFood: "料理が見つかりません",
      },
      home: {
        title: "ダナン料理の真髄。",
        subtitle: "ダナンの味を大切にし、伝統の味を守るレストラン。",
      },
      footer: {
        slogan: "ダナン料理の真髄、伝統の味わい。",
        contact: "お問い合わせ",
        support: "カスタマーサポート",
        area: "エリア",
        partners: "アプリ＆パートナー",
        faq: "よくある質問",
        paymentGuide: "お支払いガイド",
        danang: "ダナン",
        downloadApp: "アプリをダウンロード",
        map: "レストランの地図",
        hotline: "ホットライン",
        email: "メール",
        rights: "© 2024 Food Order. 無断転載禁止。",
      },
    },
  },
  ko: {
    translation: {
      nav: {
        home: "홈",
        menu: "메뉴",
        blog: "블로그",
        history: "기록",
        login: "로그인",
        dashboard: "관리 페이지로",
        staff: "메인 페이지로",
        kitchen: "주방으로",
      },
      common: { logout: "로그아웃" },
      menu: {
        searchPlaceholder: "음식 검색...",
        products: "상품",
        showMore: "더 보기",
        collapse: "접기",
        clearFilter: "필터 지우기",
        noFood: "음식을 찾을 수 없습니다",
      },
      home: {
        title: "다낭 요리의 정수.",
        subtitle: "다낭의 맛을 담아 전통의 맛을 지키는 레스토랑.",
      },
      footer: {
        slogan: "다낭 요리의 정수, 전통의 풍미.",
        contact: "문의하기",
        support: "고객 지원",
        area: "지역",
        partners: "앱 & 파트너",
        faq: "자주 묻는 질문",
        paymentGuide: "결제 안내",
        danang: "다낭",
        downloadApp: "앱 다운로드",
        map: "레스토랑 위치 지도",
        hotline: "핫라인",
        email: "이메일",
        rights: "© 2024 Food Order. 모든 권리 보유.",
      },
    },
  },
  zh: {
    translation: {
      nav: {
        home: "首页",
        menu: "菜单",
        blog: "论坛",
        history: "历史",
        login: "登录",
        dashboard: "前往管理页",
        staff: "前往主页",
        kitchen: "前往厨房",
      },
      common: { logout: "退出登录" },
      menu: {
        searchPlaceholder: "搜索菜品...",
        products: "商品",
        showMore: "查看更多",
        collapse: "收起",
        clearFilter: "清除筛选",
        noFood: "未找到菜品",
      },
      home: {
        title: "岘港美食的精华。",
        subtitle: "一家充满岘港风味、保留传统口味的餐厅。",
      },
      footer: {
        slogan: "岘港美食的精华，浓郁的传统风味。",
        contact: "联系我们",
        support: "客户支持",
        area: "区域",
        partners: "应用与合作伙伴",
        faq: "常见问题",
        paymentGuide: "支付指南",
        danang: "岘港",
        downloadApp: "下载应用",
        map: "餐厅位置地图",
        hotline: "热线",
        email: "邮箱",
        rights: "© 2024 Food Order. 版权所有。",
      },
    },
  },
};

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

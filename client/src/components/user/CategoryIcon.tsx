import {
  Soup,
  Fish,
  PlusCircle,
  IceCreamBowl,
  Salad,
  CupSoda,
  Utensils,
} from "lucide-react";

// Map icon theo tên danh mục (không phụ thuộc _id trong DB)
const ICON_BY_NAME: { keywords: string[]; Icon: typeof Soup }[] = [
  { keywords: ["khai vị", "salad", "gỏi"], Icon: Salad },
  { keywords: ["món chính", "cơm", "mì", "phở", "bún"], Icon: Soup },
  { keywords: ["hải sản", "cá", "tôm"], Icon: Fish },
  { keywords: ["đồ uống", "nước", "thức uống", "drink"], Icon: CupSoda },
  { keywords: ["tráng miệng", "chè", "bánh", "kem"], Icon: IceCreamBowl },
  { keywords: ["thêm", "khác"], Icon: PlusCircle },
];

const CategoryIcon = ({ name = "" }: { name?: string }) => {
  const lower = name.toLowerCase();
  const IconComponent =
    ICON_BY_NAME.find((item) =>
      item.keywords.some((kw) => lower.includes(kw))
    )?.Icon ?? Utensils;

  return <IconComponent className="size-10 lg:size-20" />;
};

export default CategoryIcon;

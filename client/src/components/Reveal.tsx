import { motion } from "framer-motion";
import { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Độ trễ (giây) — dùng để tạo hiệu ứng so le theo index */
  delay?: number;
  /** Khoảng trượt lên (px) khi xuất hiện */
  y?: number;
  className?: string;
  /** Lặp lại mỗi lần cuộn tới (mặc định chỉ chạy 1 lần) */
  repeat?: boolean;
}

/**
 * Bọc phần tử để áp hiệu ứng "hiện dần + trượt lên" khi cuộn tới.
 */
const Reveal = ({
  children,
  delay = 0,
  y = 28,
  className,
  repeat = false,
}: RevealProps) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: !repeat, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;

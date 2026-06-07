import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className=" flex items-center justify-center min-h-28">
      {/* hieu ung loading khi dang tai du lieu len */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1 }}
      >
        <div className="w-10 h-10 rounded-full border-4 border-primary-100 border-t-transparent"></div>
      </motion.div>
    </div>
  );
};

export default Loading;
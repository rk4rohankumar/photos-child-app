import { motion } from "framer-motion";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";

const Loader = ({ label = "Loading images..." }) => {
  const reduced = usePrefersReducedMotion();
  return (
    <div
      className="flex flex-col items-center justify-center py-24"
      role="status"
      aria-live="polite"
    >
      {reduced ? (
        <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-300 rounded-full" />
      ) : (
        <motion.div
          className="w-16 h-16 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      <p className="text-lg font-semibold text-gray-700 mt-4">{label}</p>
    </div>
  );
};

export default Loader;

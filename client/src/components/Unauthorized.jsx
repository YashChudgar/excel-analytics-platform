import React from "react";
import { motion } from "framer-motion";

const Unauthorized = () => {
  return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-500 to-blue-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full text-center"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-red-600 mb-4">
          🚫 Unauthorized Access
        </h2>
        <p className="text-gray-700 text-base sm:text-lg">
          You do not have permission to view this page.
        </p>
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href="/"
          className="inline-block mt-6 px-6 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-medium transition-all duration-300 shadow-lg"
        >
          Go to Home
        </motion.a>
      </motion.div>
    </div>
  );
};

export default Unauthorized;

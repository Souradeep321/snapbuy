import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const TermsAndConditions = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    className="max-w-4xl mx-auto px-4 md:px-8 py-12 text-gray-800">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-zinc-900">
        Terms & Conditions
      </h1>

      <p className="mb-4 text-base md:text-lg leading-relaxed">
        Welcome to <span className="font-semibold">SnapBuy</span>. By using our website, you agree to comply with and be bound by the following terms and conditions.
      </p>

      <ul className="list-disc list-inside text-base space-y-3">
        <li>All content on this website is for general information and use only. It is subject to change without notice.</li>
        <li>Unauthorized use of this website may give rise to a claim for damages and/or be a criminal offense.</li>
        <li>Prices and availability of products are subject to change without notice.</li>
        <li>All product images are for illustrative purposes only and may differ from the actual product.</li>
      </ul>

      <p className="mt-6">
        For any queries, please <Link to="/contact" className="text-blue-600 underline">contact us</Link>.
      </p>
    </motion.div>
  );
};

export default TermsAndConditions;

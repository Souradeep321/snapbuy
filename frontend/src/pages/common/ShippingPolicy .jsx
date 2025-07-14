import { Link } from "react-router-dom";
import { motion } from "framer-motion";


const ShippingPolicy = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    className="max-w-4xl mx-auto px-4 md:px-8 py-12 text-gray-800">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-zinc-900">
        Shipping Policy
      </h1>

      <p className="mb-4 text-base md:text-lg leading-relaxed">
        At <span className="font-semibold">SnapBuy</span>, we ensure prompt and safe delivery of your orders.
      </p>

      <ul className="list-disc list-inside text-base space-y-3">
        <li>Orders are usually processed within 1–2 business days.</li>
        <li>Estimated delivery time is 4–7 business days depending on your location.</li>
        <li>You’ll receive tracking details via email once your order is shipped.</li>
        <li>We are not responsible for delays caused by third-party couriers or natural disasters.</li>
      </ul>

      <p className="mt-6">
        For special shipping requests, please <Link to="/contact" className="text-blue-600 underline">reach out to our team</Link>.
      </p>
    </motion.div>
  );
};

export default ShippingPolicy;

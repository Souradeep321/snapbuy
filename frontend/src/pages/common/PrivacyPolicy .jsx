import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    className="max-w-4xl mx-auto px-4 md:px-8 py-12 text-gray-800">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-zinc-900">
        Privacy Policy
      </h1>

      <p className="mb-4 text-base md:text-lg leading-relaxed">
        Your privacy is important to us. This policy explains how <span className="font-semibold">SnapBuy</span> collects, uses, and protects your personal information.
      </p>

      <ul className="list-disc list-inside text-base space-y-3">
        <li>We collect personal information such as name, email, and shipping address for order processing.</li>
        <li>Your data is kept secure and never sold to third parties.</li>
        <li>We may use your email to send order updates or promotional content. You can opt out anytime.</li>
        <li>Cookies are used to improve your shopping experience. You can disable them in your browser settings.</li>
      </ul>

      <p className="mt-6">
        Have questions? <Link to="/contact" className="text-blue-600 underline">Contact us</Link> and we'll be happy to help.
      </p>
    </motion.div>
  );
};

export default PrivacyPolicy;

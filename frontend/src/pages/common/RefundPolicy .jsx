import { Link } from "react-router-dom";
import {motion} from "framer-motion";

const RefundPolicy = () => {
  return (
    <motion.div 
     initial={{ opacity: 0, y: 30 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.6 }}
    className="max-w-4xl mx-auto px-4 md:px-8 py-12 text-gray-800">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-zinc-900">
        Refund & Cancellation Policy
      </h1>

      <p className="mb-6 text-base md:text-lg leading-relaxed">
        At <span className="font-semibold">SnapBuy</span>, customer satisfaction is our top priority.
        If you're not satisfied with your order or wish to cancel it, please read our policy below.
      </p>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3 text-zinc-800">Order Cancellation</h2>
        <p className="text-base leading-relaxed">
          You can cancel your order before it is shipped. Please contact our support team as soon as possible.
          We’ll review and cancel your order from our side after verifying the request.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3 text-zinc-800">Refund Policy</h2>
        <p className="text-base leading-relaxed mb-4">
          Once your cancellation is confirmed or a return is approved, we will initiate a refund
          to your original payment method within 5–7 business days.
        </p>
        <ul className="list-disc list-inside text-base space-y-2">
          <li>Product must be returned in its original condition and packaging.</li>
          <li>Refund requests should be made within 7 days of receiving the item.</li>
          <li>Shipping charges are non-refundable unless the return is due to our error.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3 text-zinc-800">Need Help?</h2>
        <p className="text-base leading-relaxed">
          For assistance, please <Link to="/contact" className="text-blue-600 underline">contact our team</Link> or
          reach us at <span className="text-gray-700 font-medium">support@snapbuy.com</span>.
        </p>
      </section>
    </motion.div>
  );
};

export default RefundPolicy;

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Package, Clock } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';


const PurchaseSuccess = () => {
  const navigate = useNavigate();
  const { width, height } = useWindowSize();
  const { orderId } = useParams(); // Assuming orderId is passed in URL params

  const [showConfetti, setShowConfetti] = useState(true);
  const [confettiVisible, setConfettiVisible] = useState(true);

  // Generate mock order number for demonstration
  const orderNumber = orderId;

  useEffect(() => {

    // Start confetti fade out after 4 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  // Remove confetti from DOM after fade-out animation
  useEffect(() => {
    if (!showConfetti) {
      const timeout = setTimeout(() => setConfettiVisible(false), 800);
      return () => clearTimeout(timeout);
    }
  }, [showConfetti]);

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleViewOrders = () => {
    navigate('/profile/orders');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Confetti Animation */}
      <AnimatePresence>
        {confettiVisible && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: showConfetti ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="fixed inset-0 pointer-events-none z-50"
          >
            <Confetti
              width={width}
              height={height}
              numberOfPieces={600}
              recycle={false}
              gravity={0.15}
              wind={0.005}
              initialVelocityX={3}
              initialVelocityY={-12}
              colors={['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899']}
              tweenDuration={8000}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-lg">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: 0.2
            }}
            className="flex justify-center mb-6"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </motion.div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.3
            }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center"
          >
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order Confirmed!
              </h1>
              <p className="text-gray-600 text-lg">
                Thank you for your purchase
              </p>
            </div>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center mb-3">
                <Package className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Order Number</span>
              </div>
              <p className="text-lg font-mono font-semibold text-gray-900">
                {orderNumber}
              </p>
            </div>

            {/* Status Information */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>Processing will begin within 24 hours</span>
              </div>
              <p className="text-sm text-gray-500">
                You'll receive an email confirmation shortly with tracking details.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.7
                }}
              >
                <Button
                  onClick={handleContinueShopping}
                >
                  <span className="flex items-center justify-center">
                    Continue Shopping
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </span>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.8
                }}
              >
                <button
                  onClick={handleViewOrders}
                  className="w-full px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 
                           rounded-lg font-medium transition-colors duration-200 
                           focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  View My Orders
                </button>
              </motion.div>
            </div>
          </motion.div>

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-gray-500">
              Need help? Contact our{' '}
              <button className="text-blue-600 hover:text-blue-700 underline font-medium">
                customer support
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};


export default PurchaseSuccess;
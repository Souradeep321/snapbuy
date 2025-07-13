import { useEffect } from 'react';
import { useRecommendedProductsQuery } from '../../store/productApi';
import { Link, useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { motion, useAnimation } from "framer-motion";
import Loader from '../common/Loader';
import { useSelector } from 'react-redux';
import { useAddToCartMutation } from '../../store/cartApi';
import {toast} from "react-hot-toast"

const TrendingProducts = () => {
  const { data, isLoading, error, isError } = useRecommendedProductsQuery();
  const products = data?.data;
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [addToCart] = useAddToCartMutation();

  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  if (isError) {
    return (
      <div
        className={`w-full  flex h-screen justify-center items-center`}
      >
        Error: {error.message}
      </div>
    );
  }

    const handleAddToCart = async (productId) => {
    if(!user && !isAuthenticated) {
      toast.error("Please login to add to cart");
      navigate("/login");
      return;
    }
    try {
      const res = await addToCart({ productId }).unwrap();
      toast.success("Added to cart");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add to cart");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
      }}
      className="px-6 md:px-20"
    >
      <div className="flex items-center justify-center mb-4">
        <h2 className="text-2xl font-semibold">Trending Now</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 bg-gray-50">
        {products?.map((product) => (
          <div key={product._id} className="relative group">
            <div className="relative mb-4 overflow-hidden h-72 bg-white rounded-xl">
              {product.coverImage?.url ? (
                <img
                  src={product.coverImage.url}
                  alt={product.name}
                  className="object-cover w-full h-full transition-transform duration-500 cursor-pointer group-hover:scale-105"
                  onClick={() => navigate(`/product/${product._id}`)}
                  loading="lazy"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-400">
                  <span>Product Image</span>
                </div>
              )}

              <div className="absolute px-2 py-1 text-xs font-medium rounded-full top-3 left-3 bg-white/90 backdrop-blur-sm">
                {product.subCategory || 'Fashion'}
              </div>

              <button
                className="absolute p-2 text-black transition-all duration-300 rounded-full shadow-sm opacity-0 top-3 right-3 bg-white/90 backdrop-blur-sm group-hover:opacity-100"
                aria-label={`Add ${product.name} to cart`}
                onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCart(product._id);
              }}
              >
                <svg
                  className="w-5 h-5 cursor-pointer"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>
            </div>

            <div className="px-1">
              <h2 className="font-medium text-gray-900 transition-colors cursor-pointer group-hover:text-gray-600">
                {product.name}
              </h2>
              <p className="text-sm text-gray-500">
                {product.color || "Various colors"}
              </p>
              <div className="flex items-center justify-between mt-2">
                <p className="font-semibold text-gray-900">₹ {product.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          to="/collection"
          className="inline-flex items-center px-6 py-3 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-full hover:bg-gray-50"
        >
          Load More Products
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </Link>
      </div>
    </motion.section>

  );
};

export default TrendingProducts;

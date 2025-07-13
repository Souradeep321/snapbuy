import React from "react";
import { useNavigate } from "react-router-dom";
import { useAddToCartMutation } from "../../store/cartApi";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [addToCart, { isLoading }] = useAddToCartMutation();
  const {user,isAuthenticated} = useSelector(state => state.auth);

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

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

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded shadow-md md:w-[230px] sm:w-48 w-[169px] overflow-hidden relative cursor-pointer"
    >
      {/* Image Section */}
      <div className="bg-gray-200 md:h-[300px] sm:h-60 h-44 flex items-center justify-center relative overflow-hidden">
        {product?.coverImage?.url ? (
          <img
            src={product.coverImage.url}
            alt={product?.name}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="text-gray-400 text-sm">No Image</span>
        )}

        {/* Hover Cart Section */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-10">
          <div className="flex items-center bg-black">
            <button
              className="flex-1 text-white text-sm font-medium py-3 hover:bg-gray-900 transition"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCart(product._id);
              }}
            >
              {isLoading ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="text-center py-3 space-y-1">
        <p className="text-xs md:text-sm text-gray-800 font-bold">
          {product?.name || "No Title"}
        </p>
        <p className="text-xs md:text-sm text-gray-800">
          {product?.description?.length > 40
            ? product.description.slice(0, 40) + "..."
            : product?.description || "No description"}
        </p>
        <p className="text-sm md:text-base font-semibold">
          ₹{product?.price || 0}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;

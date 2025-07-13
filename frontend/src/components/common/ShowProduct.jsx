// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useFeaturedProductsQuery, useGetProductByIdQuery } from '../../store/productApi';
// import { toast } from 'react-hot-toast';
// import Loader from './Loader';
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { ShoppingCart } from "lucide-react";
// import { motion } from "framer-motion";
// import ProductCard from './ProductCard';
// import { Star } from 'lucide-react';
// import { useAddToCartMutation } from '../../store/cartApi';
// import { useSelector } from 'react-redux';

// const ShowProduct = () => {
//   const { productId } = useParams();
//   const navigate = useNavigate();
//   const { user, isAuthenticated } = useSelector(state => state.auth);
//   const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
//   const { data, isLoading, error } = useFeaturedProductsQuery();
//   // const { data: product, isLoading, error, refetch } = useGetProductByIdQuery(productId);

//   const [selectedImage, setSelectedImage] = useState(null);
//   const [isMobileGalleryOpen, setIsMobileGalleryOpen] = useState(false);
//   const [review, setReview] = useState('');
//   const [rating, setRating] = useState(0);
//   const [showReviewInput, setShowReviewInput] = useState(false);
//   const [reviews, setReviews] = useState([]);
//   const [selectedSize, setSelectedSize] = useState(''); // New state for size selection

//   const products = data?.data || [];
//   const product = products.find(p => p._id === productId);

//   // Default sizes if product doesn't have sizes defined
//   const sizes = product?.sizes || ['S', 'M', 'L', 'XL'];
//   const images = product ? [product.coverImage, ...product.additionalImages] : [];

//   useEffect(() => {
//     setSelectedImage(null);
//     setIsMobileGalleryOpen(false);
//     window.scrollTo(0, 0);
//     // Select first size by default
//     if (sizes.length > 0) {
//       setSelectedSize(sizes[0]);
//     }
//   }, [productId]);

//   const handleAddToCart = async (productId, size) => {
//     if (!user && !isAuthenticated) {
//       toast.error("Please login to add to cart");
//       navigate("/login");
//       return;
//     }
//     try {
//       await addToCart({ productId, size }).unwrap();
//       toast.success("Added to cart");
//     } catch (error) {
//       toast.error(error?.data?.message || "Failed to add to cart");
//     }
//   };


//   const handleAddReview = () => {
//     if (!review.trim() || rating === 0) {
//       toast.error('Please add a rating and review text');
//       return;
//     }

//     const newReview = {
//       id: Date.now(),
//       user: "You",
//       rating,
//       text: review,
//       date: new Date().toLocaleDateString()
//     };

//     setReviews([...reviews, newReview]);
//     setReview('');
//     setRating(0);
//     setShowReviewInput(false);
//     toast.success('Review added successfully!');
//   };

//   if (isLoading) return <Loader />;
//   if (error) return <p className="text-red-500 text-center py-10">Failed to load product.</p>;
//   if (!product) return <p className="text-red-500 text-center py-10">Product not found.</p>;

//   const similarProducts = products
//     .filter(p =>
//       p._id !== product._id &&
//       p.category === product.category &&
//       p.gender?.toLowerCase() === product.gender?.toLowerCase()
//     )
//     .slice(0, 4);

//   const averageRating = reviews.length > 0
//     ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
//     : 0;

//   return (
//     <motion.div
//       key={productId}
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -10 }}
//       transition={{ duration: 0.3 }}
//       className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6"
//     >
//       {/* Product Content Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 ">
//         {/* Image Section */}
//         <div className=" top-4 self-start">
//           {/* Mobile trigger */}
//           <div className="md:hidden relative rounded-xl mb-4">
//             <img
//               src={selectedImage?.url || product.coverImage.url}
//               alt={product.name}
//               className="w-full h-72 object-contain rounded-xl shadow cursor-zoom-in"
//               onClick={() => setIsMobileGalleryOpen(true)}
//             />
//             <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
//               Tap to expand
//             </div>
//           </div>

//           {/* Desktop image */}
//           <div className="hidden md:block">
//             <img
//               src={selectedImage?.url || product.coverImage.url}
//               alt={product.name}
//               className="w-full max-h-[500px] object-contain rounded-xl shadow"
//             />
//           </div>

//           {/* Thumbnails */}
//           <div className="mt-4 flex gap-3 overflow-x-auto py-2">
//             {images.map((img, i) => (
//               <img
//                 key={img.public_id}
//                 src={img.url}
//                 alt={`thumb-${i}`}
//                 onClick={() => setSelectedImage(img)}
//                 className={`h-16 w-16 min-w-[64px] object-contain rounded-lg cursor-pointer border-2 ${(selectedImage?.url === img.url) || (!selectedImage && i === 0)
//                   ? 'border-black'
//                   : 'border-gray-300'
//                   }`}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Product Details */}
//         <div className="space-y-5">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
//             <div className="flex items-center mt-2">
//               <div className="flex">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <Star
//                     key={star}
//                     size={18}
//                     fill={star <= averageRating ? "currentColor" : "none"}
//                     className={`${star <= averageRating ? 'text-yellow-400' : 'text-gray-300'}`}
//                   />
//                 ))}
//               </div>
//               <span className="text-gray-600 ml-2 text-sm">
//                 ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
//               </span>
//             </div>
//           </div>

//           <p className="text-xl font-semibold text-gray-900">₹{product.price}</p>

//           <p className="text-gray-700">{product.description}</p>

//           {/* Size Selection */}
//           <div className="space-y-3">
//             <h3 className="font-medium text-gray-900">Select Size</h3>
//             <div className="flex flex-wrap gap-2">
//               {sizes.map((size) => (
//                 <Button
//                   key={size}
//                   variant={selectedSize === size ? "default" : "outline"}
//                   className={`h-10 w-10 p-0 rounded-full font-medium ${selectedSize === size ? 'bg-black text-white' : ''
//                     }`}
//                   onClick={() => setSelectedSize(size)}
//                 >
//                   {size}
//                 </Button>
//               ))}
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-3 pt-2">
//             <Button
//               className="px-8 py-5 font-medium flex-1 md:flex-none"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleAddToCart(product._id, selectedSize); // ✅ pass size
//               }}
//             >
//               <ShoppingCart size={18} className="mr-2" />
//               {isLoading ? 'Adding...' : 'Add to Cart'}
//             </Button>

//             <Button
//               variant="outline"
//               className="px-8 py-5 font-medium flex-1 md:flex-none"
//               onClick={async (e) => {
//                 e.stopPropagation();
//                 await handleAddToCart(product._id, selectedSize);
//                 navigate("/cart");
//               }}
//             >
//               Buy Now
//             </Button>
//           </div>

//           <div className={`text-sm p-3 rounded-lg ${product.countInStock > 0
//             ? 'bg-green-100 text-green-700'
//             : 'bg-red-100 text-red-700'
//             }`}>
//             {product.countInStock > 0
//               ? `✓ In Stock: ${product.countInStock} available`
//               : '✗ Currently out of stock'}
//           </div>
//         </div>
//       </div>

//       {/* Tabs Section */}
//       <div className="mt-12 md:mt-16 border-t border-gray-200 pt-8">
//         <Tabs defaultValue="description">
//           <TabsList className="w-full flex border-b bg-transparent p-0">
//             <TabsTrigger
//               value="description"
//               className="py-4 px-6 text-base font-medium data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:text-black"
//             >
//               Product Details
//             </TabsTrigger>
//             <TabsTrigger
//               value="reviews"
//               className="py-4 px-6 text-base font-medium data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:text-black"
//             >
//               Ratings & Reviews
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="description" className="mt-6 px-1">
//             <div className="prose max-w-none">
//               <h3 className="font-semibold text-lg mb-3">About this product</h3>
//               <p className="text-gray-700">{product.description}</p>

//               <h3 className="font-semibold text-lg mt-6 mb-3">Specifications</h3>
//               <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                 <li className="flex justify-between py-2 border-b">
//                   <span className="text-gray-600">Category</span>
//                   <span className="font-medium">{product.category}</span>
//                 </li>
//                 <li className="flex justify-between py-2 border-b">
//                   <span className="text-gray-600">Gender</span>
//                   <span className="font-medium">{product.gender || 'Unisex'}</span>
//                 </li>
//                 <li className="flex justify-between py-2 border-b">
//                   <span className="text-gray-600">Material</span>
//                   <span className="font-medium">Premium Cotton</span>
//                 </li>
//                 <li className="flex justify-between py-2 border-b">
//                   <span className="text-gray-600">Care Instructions</span>
//                   <span className="font-medium">Machine Wash</span>
//                 </li>
//               </ul>
//             </div>
//           </TabsContent>

//           <TabsContent value="reviews" className="mt-6 px-1">
//             <div className="flex flex-col md:flex-row gap-8">
//               <div className="md:w-1/3">
//                 <div className="bg-gray-50 rounded-xl p-6 text-center">
//                   <div className="text-5xl font-bold text-gray-900">{averageRating}</div>
//                   <div className="flex justify-center mt-2">
//                     {[1, 2, 3, 4, 5].map((star) => (
//                       <Star
//                         key={star}
//                         size={20}
//                         fill={star <= averageRating ? "currentColor" : "none"}
//                         className={`${star <= averageRating ? 'text-yellow-400' : 'text-gray-300'} mx-0.5`}
//                       />
//                     ))}
//                   </div>
//                   <p className="text-gray-600 mt-2">
//                     {reviews.length} review{reviews.length !== 1 ? 's' : ''}
//                   </p>
//                   <Button
//                     className="mt-4 w-full"
//                     onClick={() => setShowReviewInput(!showReviewInput)}
//                   >
//                     {showReviewInput ? 'Cancel Review' : 'Write a Review'}
//                   </Button>
//                 </div>
//               </div>

//               <div className="md:w-2/3">
//                 {showReviewInput && (
//                   <div className="bg-white border rounded-xl p-5 mb-6">
//                     <h3 className="font-medium text-lg mb-4">Write your review</h3>
//                     <div className="mb-4">
//                       <p className="text-gray-700 mb-2">Your Rating</p>
//                       <div className="flex">
//                         {[1, 2, 3, 4, 5].map((star) => (
//                           <Star
//                             key={star}
//                             size={24}
//                             fill={star <= rating ? "currentColor" : "none"}
//                             className={`${star <= rating ? 'text-yellow-400' : 'text-gray-300'} cursor-pointer mr-1`}
//                             onClick={() => setRating(star)}
//                           />
//                         ))}
//                       </div>
//                     </div>
//                     <textarea
//                       className="w-full border rounded-lg p-3 text-sm h-32"
//                       placeholder="Share your experience with this product..."
//                       value={review}
//                       onChange={(e) => setReview(e.target.value)}
//                     />
//                     <div className="flex justify-end mt-4">
//                       <Button
//                         className="px-6"
//                         onClick={handleAddReview}
//                         disabled={!review.trim() || rating === 0}
//                       >
//                         Submit Review
//                       </Button>
//                     </div>
//                   </div>
//                 )}

//                 {reviews.length > 0 ? (
//                   <div className="space-y-5">
//                     {reviews.map((rev) => (
//                       <div key={rev.id} className="border-b pb-5">
//                         <div className="flex justify-between">
//                           <h4 className="font-medium">{rev.user}</h4>
//                           <span className="text-gray-500 text-sm">{rev.date}</span>
//                         </div>
//                         <div className="flex mt-1 mb-2">
//                           {[1, 2, 3, 4, 5].map((star) => (
//                             <Star
//                               key={star}
//                               size={16}
//                               fill={star <= rev.rating ? "currentColor" : "none"}
//                               className={`${star <= rev.rating ? 'text-yellow-400' : 'text-gray-300'} mr-0.5`}
//                             />
//                           ))}
//                         </div>
//                         <p className="text-gray-700">{rev.text}</p>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-10">
//                     <p className="text-gray-500">No reviews yet. Be the first to review!</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>

//       {/* Similar Products */}
//       <div className="mt-16">
//         <h3 className="text-xl font-bold mb-6 text-center">You May Also Like</h3>
//         <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
//           {similarProducts.map((p) => (
//             <ProductCard key={p._id} product={p} />
//           ))}
//         </div>
//       </div>

//       {/* Mobile Image Modal */}
//       {isMobileGalleryOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col items-center justify-center md:hidden p-4">
//           <button
//             className="absolute top-5 right-5 text-white text-4xl z-10"
//             onClick={() => setIsMobileGalleryOpen(false)}
//           >
//             &times;
//           </button>
//           <div className="w-full h-[70vh] flex items-center justify-center">
//             <img
//               src={selectedImage?.url || product.coverImage.url}
//               alt={product.name}
//               className="max-w-full max-h-full object-contain"
//             />
//           </div>
//           <div className="flex gap-3 mt-4 overflow-x-auto py-2 px-1 w-full max-w-[95vw]">
//             {images.map((img, i) => (
//               <img
//                 key={img.public_id}
//                 src={img.url}
//                 alt={`thumb-${i}`}
//                 onClick={() => setSelectedImage(img)}
//                 className={`h-14 w-14 min-w-[56px] object-contain rounded cursor-pointer border-2 ${selectedImage?.url === img.url ? 'border-white' : 'border-gray-500'
//                   }`}
//               />
//             ))}
//           </div>
//         </div>
//       )}
//     </motion.div>
//   );
// };

// export default ShowProduct;

// ShowProduct.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  useFeaturedProductsQuery, 
  useGetProductByIdQuery,
  useAddReviewMutation,
  useEditReviewMutation,
  useDeleteReviewMutation
} from '../../store/productApi';
import { toast } from 'react-hot-toast';
import Loader from './Loader';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from './ProductCard';
import { Star } from 'lucide-react';
import { useAddToCartMutation } from '../../store/cartApi';
import { useSelector } from 'react-redux';

const ShowProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [addToCart] = useAddToCartMutation();
  
  // Fetch featured products for similar items
  const { data: featuredProductsData, isLoading: isFeaturedLoading } = useFeaturedProductsQuery();
  const featuredProducts = featuredProductsData?.data || [];
  
  // Fetch current product
  const { 
    data: productData, 
    isLoading: isProductLoading, 
    error: productError, 
    refetch: refetchProduct 
  } = useGetProductByIdQuery(productId);
  
  const product = productData?.data;
  
  // Review mutations
  const [addReview] = useAddReviewMutation();
  const [editReview] = useEditReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMobileGalleryOpen, setIsMobileGalleryOpen] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M'); // Default size

  // Initialize selected image and size
  useEffect(() => {
    if (product) {
      setSelectedImage(product.coverImage);
      window.scrollTo(0, 0);
      
      // Set first size if available
      if (product.sizes?.length) {
        setSelectedSize(product.sizes[0]);
      }
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add to cart");
      navigate("/login");
      return;
    }
    
    try {
      await addToCart({ 
        productId, 
        size: selectedSize 
      }).unwrap();
      toast.success("Added to cart");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add to cart");
    }
  };

  const handleAddReview = async () => {
    if (!reviewText.trim() || reviewRating === 0) {
      toast.error('Please add a rating and review text');
      return;
    }

    try {
      await addReview({ 
        productId, 
        reviewData: { 
          rating: reviewRating, 
          comment: reviewText 
        } 
      }).unwrap();
      
      toast.success('Review added successfully!');
      setReviewText('');
      setReviewRating(0);
      refetchProduct();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to add review');
    }
  };

  const handleEditReview = async () => {
    if (!reviewText.trim() || reviewRating === 0 || !editingReviewId) {
      toast.error('Please complete your review');
      return;
    }

    try {
      await editReview({
        productId,
        reviewData: {
          rating: reviewRating,
          comment: reviewText
        }
      }).unwrap();
      
      toast.success('Review updated!');
      setEditingReviewId(null);
      setReviewText('');
      setReviewRating(0);
      refetchProduct();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update review');
    }
  };

  const handleDeleteReview = async () => {
    try {
      await deleteReview( productId ).unwrap();
      toast.success('Review deleted');
      setEditingReviewId(null);
      refetchProduct();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete review');
    }
  };

  const isLoading = isFeaturedLoading || isProductLoading;
  
  if (isLoading) return <Loader />;
  if (productError) return <p className="text-red-500 text-center py-10">Failed to load product.</p>;
  if (!product) return <p className="text-red-500 text-center py-10">Product not found.</p>;

  // Prepare images array
  const images = [product.coverImage, ...(product.additionalImages || [])];
  
  // Get user's existing review
  const userReview = product.reviews?.find(
    r => r.user._id === user?._id
  );
  
  // Similar products (exclude current, same category/gender)
  const similarProducts = featuredProducts
    .filter(p => 
      p._id !== productId &&
      p.category === product.category &&
      p.gender?.toLowerCase() === product.gender?.toLowerCase()
    )
    .slice(0, 4);

  // Available sizes - use product sizes or default sizes
  const availableSizes = product.sizes || ['S', 'M', 'L', 'XL'];
  
  // Calculate average rating
  const averageRating = product.reviews?.length > 0
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0;

  return (
    <motion.div
      key={productId}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6"
    >
      {/* Product Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Image Section */}
        <div className="top-4 self-start">
          {/* Mobile trigger */}
          <div className="md:hidden relative rounded-xl mb-4">
            <img
              src={selectedImage?.url || product.coverImage.url}
              alt={product.name}
              className="w-full h-72 object-contain rounded-xl shadow cursor-zoom-in"
              onClick={() => setIsMobileGalleryOpen(true)}
            />
            <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
              Tap to expand
            </div>
          </div>

          {/* Desktop image */}
          <div className="hidden md:block">
            <img
              src={selectedImage?.url || product.coverImage.url}
              alt={product.name}
              className="w-full max-h-[500px] object-contain rounded-xl shadow"
            />
          </div>

          {/* Thumbnails */}
          <div className="mt-4 flex gap-3 overflow-x-auto py-2">
            {images.map((img, i) => (
              <img
                key={img.public_id}
                src={img.url}
                alt={`thumb-${i}`}
                onClick={() => setSelectedImage(img)}
                className={`h-16 w-16 min-w-[64px] object-contain rounded-lg cursor-pointer border-2 ${
                  (selectedImage?.url === img.url) || (!selectedImage && i === 0)
                    ? 'border-black'
                    : 'border-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    fill={star <= averageRating ? "currentColor" : "none"}
                    className={`${
                      star <= averageRating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 ml-2 text-sm">
                ({product.reviews?.length || 0} reviews)
              </span>
            </div>
          </div>

          <p className="text-xl font-semibold text-gray-900">₹{product.price}</p>
          <p className="text-gray-700">{product.description}</p>

          {/* Size Selection */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Select Size</h3>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  className={`h-10 w-10 p-0 rounded-full font-medium ${
                    selectedSize === size ? 'bg-black text-white' : ''
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              className="px-8 py-5 font-medium flex-1 md:flex-none"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              disabled={product.countInStock <= 0}
            >
              <ShoppingCart size={18} className="mr-2" />
              {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>

            <Button
              variant="outline"
              className="px-8 py-5 font-medium flex-1 md:flex-none"
              onClick={async (e) => {
                e.stopPropagation();
                await handleAddToCart();
                navigate("/cart");
              }}
              disabled={product.countInStock <= 0}
            >
              Buy Now
            </Button>
          </div>

          <div className={`text-sm p-3 rounded-lg ${
            product.countInStock > 0
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {product.countInStock > 0
              ? `✓ In Stock: ${product.countInStock} available`
              : '✗ Currently out of stock'}
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-12 md:mt-16 border-t border-gray-200 pt-8">
        <Tabs defaultValue="description">
          <TabsList className="w-full flex border-b bg-transparent p-0">
            <TabsTrigger
              value="description"
              className="py-4 px-6 text-base font-medium data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:text-black"
            >
              Product Details
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="py-4 px-6 text-base font-medium data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:text-black"
            >
              Ratings & Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6 px-1">
            <div className="prose max-w-none">
              <h3 className="font-semibold text-lg mb-3">About this product</h3>
              <p className="text-gray-700">{product.description}</p>

              <h3 className="font-semibold text-lg mt-6 mb-3">Specifications</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <li className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium capitalize">{product.category}</span>
                </li>
                <li className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Gender</span>
                  <span className="font-medium capitalize">{product.gender || 'Unisex'}</span>
                </li>
                <li className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Sub-Category</span>
                  <span className="font-medium capitalize">{product.subCategory}</span>
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6 px-1">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <div className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
                  <div className="flex justify-center mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={20}
                        fill={star <= averageRating ? "currentColor" : "none"}
                        className={`${
                          star <= averageRating ? 'text-yellow-400' : 'text-gray-300'
                        } mx-0.5`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mt-2">
                    {product.reviews?.length || 0} reviews
                  </p>
                  <Button
                    className="mt-4 w-full"
                    onClick={() => {
                      if (userReview) {
                        setEditingReviewId(userReview._id);
                        setReviewText(userReview.comment);
                        setReviewRating(userReview.rating);
                      } else {
                        setReviewText('');
                        setReviewRating(0);
                      }
                    }}
                    disabled={!isAuthenticated}
                  >
                    {isAuthenticated 
                      ? (userReview ? 'Edit Your Review' : 'Write a Review')
                      : 'Login to Review'}
                  </Button>
                </div>
              </div>

              <div className="md:w-2/3">
                {/* Review Form */}
                {isAuthenticated && (editingReviewId || !userReview) && (
                  <div className="bg-white border rounded-xl p-5 mb-6">
                    <h3 className="font-medium text-lg mb-4">
                      {editingReviewId ? 'Edit Your Review' : 'Write Your Review'}
                    </h3>
                    <div className="mb-4">
                      <p className="text-gray-700 mb-2">Your Rating</p>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={24}
                            fill={star <= reviewRating ? "currentColor" : "none"}
                            className={`${
                              star <= reviewRating ? 'text-yellow-400' : 'text-gray-300'
                            } cursor-pointer mr-1`}
                            onClick={() => setReviewRating(star)}
                          />
                        ))}
                      </div>
                    </div>
                    <textarea
                      className="w-full border rounded-lg p-3 text-sm h-32"
                      placeholder="Share your experience with this product..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                    />
                    <div className="flex justify-end gap-2 mt-4">
                      {editingReviewId && (
                        <Button 
                          variant="destructive"
                          onClick={handleDeleteReview}
                        >
                          Delete Review
                        </Button>
                      )}
                      <Button
                        variant="outline" 
                        onClick={() => {
                          setEditingReviewId(null);
                          setReviewText('');
                          setReviewRating(0);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={editingReviewId ? handleEditReview : handleAddReview}
                        disabled={!reviewText.trim() || reviewRating === 0}
                      >
                        {editingReviewId ? 'Update Review' : 'Submit Review'}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Reviews List */}
                {product.reviews?.length > 0 ? (
                  <div className="space-y-5">
                    {product.reviews.map((review) => (
                      <div key={review._id} className="border-b pb-5">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {review.user.avatar?.url ? (
                              <img 
                                src={review.user.avatar.url} 
                                alt={review.user.username}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                            )}
                            <div className="ml-3">
                              <h4 className="font-medium">{review.user.username}</h4>
                              <div className="flex mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    size={16}
                                    fill={star <= review.rating ? "currentColor" : "none"}
                                    className={`${
                                      star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                                    } mr-0.5`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-gray-500 text-sm">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 mt-3">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="mt-16">
          <h3 className="text-xl font-bold mb-6 text-center">You May Also Like</h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {similarProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Mobile Image Modal */}
      {isMobileGalleryOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col items-center justify-center md:hidden p-4">
          <button
            className="absolute top-5 right-5 text-white text-4xl z-10"
            onClick={() => setIsMobileGalleryOpen(false)}
          >
            &times;
          </button>
          <div className="w-full h-[70vh] flex items-center justify-center">
            <img
              src={selectedImage?.url || product.coverImage.url}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="flex gap-3 mt-4 overflow-x-auto py-2 px-1 w-full max-w-[95vw]">
            {images.map((img, i) => (
              <img
                key={img.public_id}
                src={img.url}
                alt={`thumb-${i}`}
                onClick={() => setSelectedImage(img)}
                className={`h-14 w-14 min-w-[56px] object-contain rounded cursor-pointer border-2 ${
                  selectedImage?.url === img.url ? 'border-white' : 'border-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ShowProduct;

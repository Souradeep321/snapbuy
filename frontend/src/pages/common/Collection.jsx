import React from 'react'
import ProductCard from '../../components/common/ProductCard'
import { useFeaturedProductsQuery } from '../../store/productApi';
import Loader from '../../components/common/Loader';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const Collection = () => {
  const { gender, category, subCategory } = useParams();

  const { data, isLoading, error } = useFeaturedProductsQuery();
  const products = data?.data || [];

  if (isLoading) return <Loader />
  if (error) return <div className="text-red-500 text-center py-10">Failed to load products.</div>;


  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-50 min-h-screen mt-2">

      {category === 'collection' && (
        <div className="flex justify-center py-4 bg-gray-300">
          <h2 className="text-xl font-semibold">Featured Collection</h2>
        </div>
      )}
      {/* Product Grid */}
      <div className="lg:max-w-[1280px] w-full mx-auto flex flex-wrap gap-4 justify-center">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </motion.section>
  )
}

export default Collection





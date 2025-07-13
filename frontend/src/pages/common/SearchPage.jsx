import React from 'react'
import { useSelector } from 'react-redux';
import { useFeaturedProductsQuery } from '../../store/productApi';
import Loader from '../../components/common/Loader';
import { motion } from 'framer-motion';
import ProductCard from '../../components/common/ProductCard';

const SearchPage = () => {
  const searchQuery = useSelector(state => state.searchProduct.searchQuery);
  const { data, isLoading, error } = useFeaturedProductsQuery();

  const products = data?.data || [];

  const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/gi, '');
  const query = normalize(searchQuery);

  const filteredProducts = products.filter(product => {
    const name = normalize(product.name);
    const description = normalize(product.description || '');
    const category = normalize(product.category || '');
    const subCategory = normalize(product.subCategory || '');
    return name.includes(query) || description.includes(query) || category.includes(query) || subCategory.includes(query);
  });




  if (isLoading) return <Loader />
  if (error) return <div className="text-red-500 h-screen text-center py-10">Failed to load products.</div>;

  if (filteredProducts.length === 0) {
    return <div className="text-center py-10 h-screen">No products found for "{searchQuery}"</div>;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-50 min-h-screen mt-2">
      <div className="lg:max-w-[1280px] w-full mx-auto flex flex-wrap gap-4 justify-center">
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

    </motion.section>
  )
}

export default SearchPage
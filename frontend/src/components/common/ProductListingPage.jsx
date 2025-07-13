import { useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import NoProductsFound from './NoProductFound';
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";


const ProductListingPage = ({ products }) => {
  const { gender, category, subCategory } = useParams();
  const navigate = useNavigate();
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.3 });

  const clothingButtons = ['shirts', 'pants', 'jackets', 'tshirts'];
  const footwearButtons = ['sneakers', 'boots',];

  const subCategoryButtons =
    category === 'footwear' ? footwearButtons : clothingButtons;

  const handleNavigate = (subCat) => {
    navigate(`/${gender}/${category}/${subCat}`);
  };

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  useEffect(() => {
  controls.start("visible");
}, [controls]);


  if (!products || products.length === 0) {
    return (
      <NoProductsFound />
    )
  }

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
      }}
      className="bg-gray-50 min-h-screen mt-3">
      {/* Subcategory Buttons */}

      {category && category !== 'collection' && (
        <div className="flex md:justify-end justify-center flex-wrap gap-5 mb-3 px-6">
          {subCategoryButtons.map((subCat) => (
            <Button
              key={subCat}
              variant={subCategory === subCat ? 'default' : 'outline'}
              className={`rounded-xl max-w-[120px] px-4 py-2 text-sm font-light bg-zinc-50 transition-all duration-200 ${subCategory === subCat
                ? 'shadow-md'
                : 'hover:shadow hover:bg-muted/40'
                }`}
              onClick={() => handleNavigate(subCat)}
            >
              {subCat}
            </Button>
          ))}
        </div>
      )}


      {products.length === 0 && (
        <div className="text-center py-10 text-red-500 text-lg font-medium">
          No products found.
        </div>
      )}

      {/* Product Grid */}
      <div className="lg:max-w-[1280px] w-full mx-auto flex flex-wrap gap-4 justify-center">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </motion.section>
  );
};

export default ProductListingPage;

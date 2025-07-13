// pages/common/ProductListingPageWrapper.jsx
import { useParams } from "react-router-dom";
import { useGetProductsQuery } from "../../store/productApi";
import ProductListingPage from "../../components/common/ProductListingPage";
import Loader from "../../components/common/Loader";
import NoProductsFound from "../../components/common/NoProductFound";

const ProductListingPageWrapper = () => {
  const { gender, category, subCategory } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    gender,
    category,
    subCategory,
  });

  if (isLoading) return <Loader />;

  if (error) return <NoProductsFound />;

  return <ProductListingPage products={data?.data || []} />;
};

export default ProductListingPageWrapper;

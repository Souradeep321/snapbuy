import React from 'react'
import { useSelector } from 'react-redux'
import ProductListingPage from '../../components/common/ProductListingPage';
import { useGetProductsQuery } from '../../store/productApi';
import Loader from '../../components/common/Loader';


const Mens = () => {
  const { coupon } = useSelector((state) => state.coupon);
  console.log('coupon', coupon)

  

  const {data, isLoading} = useGetProductsQuery({});
  console.log('data?.data', data?.data)

  const products = data?.data || []

  if (isLoading) return <Loader />

  return (
    <div>
      <ProductListingPage products={products} />
    </div>
  )
}

export default Mens
import { use, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useRemoveCartItemMutation, useUpdateCartItemQuantityMutation } from '../../store/cartApi';
import { toast } from "react-hot-toast"
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/common/Loader';

const CartPage = ({ cartItems, isLoading, error }) => {
  const navigate = useNavigate();
  const [discountedTotal, setDiscountedTotal] = useState(null);

  const [updateCartQuantity, { isLoading: updateQuantityLoading }] = useUpdateCartItemQuantityMutation();
  const [removeCartItem, { isLoading: removeCartItemLoading }] = useRemoveCartItemMutation();
  const { user, isAuthenticated } = useSelector(state => state.auth);


  const total = (cartItems ?? []).reduce((sum, item) => sum + item.totalPrice, 0);


  const handleUpdateQuantity = async (productId, quantity, size) => {
    if (quantity < 1) return; // ✅ prevent invalid update

    if (!user && !isAuthenticated) {
      toast.error('Please login to modify the cart');
      return;
    }

    try {
      await updateCartQuantity({ productId, quantity, size }).unwrap();
      toast.success('Product quantity updated');
    } catch (error) {
      console.error('Error updating/removing cart:', error);
      toast.error('Failed to update cart');
    }
  };



  console.log('cartItems', cartItems)


  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 font-poppins flex flex-col items-center justify-center">
        <p className="text-3xl font-playfair font-bold text-gray-900 mb-2 flex items-center justify-center gap-4">
          <ShoppingBag size={24} />
          Login to view your cart
        </p>
        <Button
          variant="default"
          onClick={() => navigate('/login')}
        >
          Login
        </Button>
      </div>
    )
  }

  if (isLoading) return <Loader />


  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 font-poppins flex flex-col items-center justify-center">
        <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-2 flex items-center justify-center gap-4">
          <ShoppingBag size={24} />
          YOUR SHOPPING BAG IS EMPTY
        </h1>
        <p className="text-gray-500 mb-4">Looks like you haven't added anything to your cart yet.</p>
        <Button
          variant="default"
          onClick={() => navigate('/collection')}
        >
          Start Shopping
        </Button>
      </div>
    );
  }




  return (
    <div className="px-4 md:px-20 py-10 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">Shopping Bag</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cart List */}
        <div className="flex-1 bg-white p-6 rounded-xl shadow-sm">
          {(cartItems ?? []).map(({ _id, product, quantity, totalPrice, size }) => (
            <div key={_id} className="flex items-center gap-4 border-b py-4">
              <img
                src={product.coverImage}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-md"
                onClick={() => navigate(`/product/${product._id}`)}
              />
              <div className="flex-1">
                <h4 className="text-md font-semibold">{product.name}</h4>
                <p className="text-sm text-gray-500">Category: {product.subCategory}</p>
                <p className="text-sm text-gray-500">Size: {size}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleUpdateQuantity(product._id, quantity - 1, size)}
                    disabled={updateQuantityLoading}
                  >
                    -
                  </Button>

                  <span className="text-sm">{quantity}</span>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleUpdateQuantity(product._id, quantity + 1, size)}
                    disabled={updateQuantityLoading}
                  >
                    +
                  </Button>
                </div>
              </div>
              <div className="text-right flex flex-col gap-12">
                <p className="font-bold text-amber-500">${totalPrice.toFixed(2)}</p>
                <Trash2 className="text-red-500 cursor-pointer"
                  onClick={async () => {
                    try {
                      await removeCartItem({ productId: product._id, size }).unwrap();
                      toast.success('Product removed from cart');
                    } catch (error) {
                      toast.error('Failed to remove product from cart');
                      console.error('Error removing product from cart:', error);
                    }
                  }} />
              </div>

            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="w-full lg:w-[350px] bg-white p-6 rounded-xl shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Cart Total</h3>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>
                ${discountedTotal !== null ? discountedTotal.toFixed(2) : total.toFixed(2)}
              </span>
            </div>
            <Button
              onClick={() => navigate('/checkout')}
              className="w-full mt-4"
            >
              Proceed to Checkout
            </Button>
          </div>


        </div>
      </div>
    </div>
  );
};

export default CartPage;

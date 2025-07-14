import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import conf from '../../conf/conf';
import { useClearCartMutation, useGetCartItemsQuery } from '../../store/cartApi';
import Loader from '../../components/common/Loader';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from '../../lib/axios';
import { useSelector } from 'react-redux';

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
  country: z.string().min(2, "Country is required")
});

const Checkout = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, isAuthenticated } = useSelector(state => state.auth);

  const {
    data: cartData,
    isLoading: cartLoading,
    refetch: refetchCartItems
  } = useGetCartItemsQuery(undefined, {
    skip: !isAuthenticated
  });

  const [clarcart] = useClearCartMutation();

  const cartItems = cartData?.data || [];

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address?.address || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      postalCode: user?.address?.postalCode || '',
      country: user?.address?.country || 'India'
    },
  });

  // Calculate cart totals
  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  const handlePayment = async (values) => {
    if (!cartItems?.length) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }

    if (total < 1) {
      toast.error('Order total must be at least ₹1');
      return;
    }

    setIsProcessing(true);
    try {
      // Step 1: Create Razorpay order
      const { data: razorpayOrder } = await axios.post('/orders/create-payment-order');

      // Step 2: Open Razorpay payment modal
      const options = {
        key: conf.razorpayKeyId,
        amount: Math.round(total * 100),
        currency: 'INR',
        name: 'Snapbuy',
        description: 'Payment for your order',
        order_id: razorpayOrder.data.id,
        handler: async function (response) {
          if (!response?.razorpay_payment_id || !response?.razorpay_signature) {
            toast.error('Incomplete payment data received');
            setIsProcessing(false);
            return;
          }

          try {
            // Format shipping address correctly
            const shippingAddress = {
              fullName: values.fullName,
              email: values.email,
              phone: values.phone,
              address: values.address,
              city: values.city,
              state: values.state,
              postalCode: values.postalCode,
              country: values.country
            };

            // Verify payment and create order
            const res = await axios.post('/orders/verify', {
              razorpay_order_id: razorpayOrder.data.id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              shippingAddress
            });

            console.log('Order verification response:', res.data);

            if (!res.data.success) throw new Error(res.data.message);

            toast.success('Order placed successfully!');
            await clarcart().unwrap();// Clear cart after successful order
            await refetchCartItems();
            console.log('Cart cleared after order');
            navigate(`/purchase-success/${res?.data?.data?._id}`);
          } catch (err) {
            toast.error(err?.response?.data?.message || 'Order verification failed');
            console.error('Order verification failed:', err);
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: values.fullName,
          email: values.email,
          contact: values.phone,
        },
        theme: { color: '#4f46e5' },
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error?.response?.data?.message || 'Payment failed');
      setIsProcessing(false);
    }
  };

  if (cartLoading) return <Loader />;

  if (!cartItems.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-3xl font-bold mb-4">Your cart is empty</p>
        <Button onClick={() => navigate('/collection')}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Form */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handlePayment)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main Street" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Mumbai" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="Maharashtra" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="400001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="India" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isProcessing || cartLoading}
                  className="w-full mt-6"
                >
                  {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Proceed to Payment
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Cart Items */}
            <div className="space-y-2">
              <h3 className="font-medium">Your Items</h3>
              <div className="border rounded-lg divide-y">
                {cartItems.map(item => (
                  <div key={item._id} className="flex p-4">
                    <img
                      src={item.product.coverImage}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-gray-500">₹{item.product.price} × {item.quantity}</p>
                      {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                    </div>
                    <div className="font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>No shipping charges required. ₹{shippingFee.toFixed(2)}</span>
              </div>

              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;
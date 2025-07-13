import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetAllOrdersQuery, useGetMyOrdersQuery } from '../../store/orderApi';
import Loader from '../common/Loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const SingleOrder = () => {
    const { orderId } = useParams();
    const { user } = useSelector(state => state.auth);
    const isAdmin = user?.role === 'admin';

    const {
        data: ordersData,
        isLoading,
        isError,
    } = isAdmin ? useGetAllOrdersQuery() : useGetMyOrdersQuery();

    const order = ordersData?.data?.find(order => order._id === orderId);


    if (isLoading) return <Loader />;

    if (!order) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Order Not Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-destructive">The order you're looking for doesn't exist or has been removed.</p>
                        <Button className="mt-4" asChild>
                            <a href="/profile/orders">Back to Orders</a>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Order status tracking
    const statusSteps = ['processing', 'shipped', 'delivered'];
    const cancelled = order.orderStatus === 'cancelled';
    const currentStatusIndex = statusSteps.indexOf(order.orderStatus);

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case 'processing': return 'bg-blue-500';
            case 'shipped': return 'bg-yellow-500';
            case 'delivered': return 'bg-green-500';
            case 'cancelled': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Order #{order._id.slice(-6).toUpperCase()}</h1>
                    <p className="text-gray-500">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <Badge className={`${getStatusColor(order.orderStatus)} text-white px-3 py-1`}>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                </Badge>
            </div>

            {/* Order Tracking */}
            {!cancelled ? (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Order Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between relative pb-8">
                            {/* Progress line */}
                            <div className="absolute top-4 left-4 right-4 h-1 bg-gray-200 z-0">
                                <div
                                    className={`h-full bg-primary transition-all duration-500`}
                                    style={{
                                        width: `${(currentStatusIndex + 1) * 33}%`
                                    }}
                                ></div>
                            </div>

                            {statusSteps.map((status, index) => (
                                <div key={status} className="relative z-10 flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index <= currentStatusIndex
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-200 text-gray-500'
                                        }`}>
                                        {index <= currentStatusIndex ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <span className="text-sm font-bold">{index + 1}</span>
                                        )}
                                    </div>
                                    <span className="mt-2 text-sm font-medium capitalize">
                                        {status}
                                    </span>
                                    {index === currentStatusIndex && (
                                        <span className="mt-1 text-xs text-gray-500">
                                            Current status
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="mb-6 bg-red-50 border-red-200">
                    <CardHeader>
                        <CardTitle className="text-red-600">Order Cancelled</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-red-700">
                            This order was cancelled on {formatDate(order.updatedAt)}.
                            Please contact support if you believe this was a mistake.
                        </p>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Order Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-medium text-gray-500">Order ID</h3>
                            <p>{order._id}</p>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-500">Order Date</h3>
                            <p>{formatDate(order.createdAt)}</p>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-500">Last Updated</h3>
                            <p>{formatDate(order.updatedAt)}</p>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-500">Total Amount</h3>
                            <p className="text-lg font-bold">₹{order.totalPrice.toFixed(2)}</p>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-500">Payment Method</h3>
                            <p className="capitalize">{order.paymentInfo.method}</p>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-500">Payment Status</h3>
                            <p className="capitalize">{order.paymentInfo.status}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Shipping Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Shipping Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-medium text-gray-500">Recipient</h3>
                            <p>{order.shippingAddress.fullName}</p>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-500">Email</h3>
                            <p>{order.shippingAddress.email}</p>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-500">Phone</h3>
                            <p>{order.shippingAddress.phone}</p>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-500">Address</h3>
                            <p>{order.shippingAddress.address}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                            <p>{order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Order Items */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {order.orderItems.map((item, index) => (
                            <div key={index} className="flex items-center border-b pb-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-4">
                                    {item.product.coverImage?.url ? (
                                        <img
                                            src={item.product.coverImage.url}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-xs text-gray-500">No image</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium">{item.product.name}</h3>
                                    <p className="text-gray-500">Size: {item.size || 'N/A'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">₹{item.product.price.toFixed(2)}</p>
                                    <p className="text-gray-500">Qty: {item.quantity}</p>
                                    <p className="font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-between pt-4">
                            <div className="text-lg font-medium">Total</div>
                            <div className="text-lg font-bold">₹{order.totalPrice.toFixed(2)}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-4">
                {user && user?.role === 'admin' ? (<Button variant="outline" asChild>
                    <Link to="/admin/orders">Back to Orders</Link>
                </Button>)
                    : (
                        <Button variant="outline" asChild>
                            <Link to="/profile/orders">Back to My Orders</Link>
                        </Button>
                    )}
            </div>
        </motion.div>
    );
};

export default SingleOrder;


import React, { useState } from 'react';
import { useDeleteOrderMutation, useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '../../store/orderApi';
import Loader from '../common/Loader';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

const statuses = ["processing", "shipped", "delivered", "cancelled"];

const Orders = () => {
  const navigate = useNavigate();
  const { data: orders, isLoading } = useGetAllOrdersQuery();
  const [updateOrderStatus, { isLoading: updateLoading }] = useUpdateOrderStatusMutation();
  const [deleteOrder, { isLoading: deleteLoading }] = useDeleteOrderMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const data = orders?.data || [];

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus }).unwrap();
      toast.success("Status updated");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  const filteredOrders = data.filter((order) => {
    const orderIdMatch = order._id.toLowerCase().includes(searchTerm.toLowerCase());
    const customerMatch = order.user.username.toLowerCase().includes(searchTerm.toLowerCase());
    return orderIdMatch || customerMatch;
  });

  if (isLoading) return <Loader />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">All Orders</h2>
        <Input
          type="text"
          placeholder="Search by customer or order ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-72"
        />
      </div>

      <div className="grid grid-cols-7 gap-4 bg-gray-100 p-3 rounded-md font-medium text-sm text-gray-600">
        <span>Order ID</span>
        <span>Customer</span>
        <span>Date</span>
        <span>Total</span>
        <span>Payment</span>
        <span>Status</span>
        <span>Action</span>
      </div>

      {filteredOrders && filteredOrders.map((order) => (
        <Card key={order._id} className="grid grid-cols-7 gap-4 p-4 mt-2 items-center text-sm hover:bg-gray-50 transition cursor-pointer">
          <span className="font-semibold text-primary">#{order._id.slice(-6)}</span>
          <span>{order.user.username}</span>
          <span>{format(new Date(order.createdAt), 'dd MMM, yyyy')}</span>
          <span>₹{order.totalPrice}</span>
          <span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${order?.paymentInfo?.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {order.paymentInfo.status}
            </span>
          </span>
          <Select
            defaultValue={order?.orderStatus}
            onValueChange={(value) => handleStatusChange(order._id, value)}
            disabled={updateLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-4 items-center">
            <Button size="sm" onClick={() => navigate(`/admin/orders/${order._id}`)}>
              View
            </Button>
            <Trash2
              className="w-5 h-5 text-red-500 cursor-pointer"
              onClick={async (e) => {
                e.preventDefault();
                toast.loading("Deleting order...");
                try {
                  await deleteOrder(order._id).unwrap();
                  toast.success("Order deleted successfully");
                } catch (error) {
                  toast.error(error?.data?.message || "Failed to delete order");
                }
              }}
            />
          </div>
        </Card>
      ))}

      {filteredOrders.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No orders found.</p>
      )}
    </motion.div>
  );
};

export default Orders;

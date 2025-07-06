import React from 'react';
import {
  ArrowUp,
  ArrowDown,
  ShoppingBag,
  CreditCard,
  Package,
  Users
} from 'react-feather';
import SalesChart from './SalesChart';
import Loader from '../Loader';
import { motion } from 'framer-motion';
import { useGetAnalyticsQuery } from '../../../store/analyticsApi';

const DashboardHome = () => {
   const { data, isLoading } = useGetAnalyticsQuery();

  if (isLoading) return <Loader />;
  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex space-x-2">
          {/* <button className="px-4 py-2 text-sm bg-white border rounded-md hover:bg-gray-50">
            This Week
          </button>
          <button className="px-4 py-2 text-sm bg-white border rounded-md hover:bg-gray-50">
            This Month
          </button> */}
        </div>
      </div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Total Sales</h3>
              <p className="text-2xl font-bold mt-1">${data?.data?.totalSales || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
              <CreditCard className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="flex items-center text-green-500">
              <ArrowUp size={16} />
              <span className="text-sm ml-1">+12.00%</span>
            </div>
            <span className="text-gray-500 text-sm ml-2">this week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
              <p className="text-2xl font-bold mt-1">{data?.data?.totalOrders || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
              <ShoppingBag className="text-orange-600" size={24} />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="flex items-center text-red-500">
              <ArrowDown size={16} />
              <span className="text-sm ml-1">-2.00%</span>
            </div>
            <span className="text-gray-500 text-sm ml-2">this week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
              <p className="text-2xl font-bold mt-1">{data?.data?.totalProducts || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
              <Package className="text-green-600" size={24} />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="flex items-center text-green-500">
              <ArrowUp size={16} />
              <span className="text-sm ml-1">+2.00%</span>
            </div>
            <span className="text-gray-500 text-sm ml-2">this week</span>
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20}}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white p-6 rounded-xl shadow-sm border min-h-[300px]">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Statistics</h3>
        <div className="h-[280px]">
          {/* <SalesChart data={data?.data?.dailySales || []} /> */}
          <SalesChart dailySales={data?.data?.dailySales || []} />
        </div>
      </motion.div>


      {/* Recent Orders Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
          <button className="text-blue-600 text-sm hover:underline">View All</button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Replace this with dynamic data later */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">2223</td>
                <td className="px-6 py-4 text-sm text-gray-500">Devon Lane</td>
                <td className="px-6 py-4 text-sm text-gray-500">devon@example.com</td>
                <td className="px-6 py-4 text-sm text-gray-500">$778.35</td>
                <td className="px-6 py-4">
                  <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Delivered
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">07/05/2023</td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

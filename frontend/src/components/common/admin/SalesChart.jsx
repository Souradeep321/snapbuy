
// import React from 'react';
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
// } from 'recharts';

// const SalesChart = ({ data }) => {
//   const formattedData = data.map((item) => ({
//     day: `${item._id.day}/${item._id.month}`,
//     sales: item.total
//   }));

//   return (
//     <div className="h-full w-full">
//       <ResponsiveContainer width="100%" height="100%">
//         <LineChart data={formattedData}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="day" />
//           <YAxis tickFormatter={(val) => `₹${val / 1000}k`} />
//           <Tooltip formatter={(value) => `₹${value}`} />
//           <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default SalesChart;


import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesChart = ({ dailySales }) => {
  // Sort by date in ascending order
  const sortedSales = [...dailySales].sort((a, b) => {
    const dateA = new Date(a._id.year, a._id.month - 1, a._id.day);
    const dateB = new Date(b._id.year, b._id.month - 1, b._id.day);
    return dateA - dateB;
  });

  // Prepare chart data
  const labels = sortedSales.map(sale => {
    const date = new Date(sale._id.year, sale._id.month - 1, sale._id.day);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  });

  const salesData = sortedSales.map(sale => sale.total);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Daily Revenue (₹)',
        data: salesData,
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        borderRadius: 6,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => `₹${context.parsed.y.toLocaleString()}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value.toLocaleString()}`
        },
        title: {
          display: true,
          text: 'Revenue (₹)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };

  return (
    <div className="w-full h-80">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default SalesChart;
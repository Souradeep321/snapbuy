// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from '@/components/ui/card';
// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableRow,
//   TableHead,
//   TableCell,
// } from '@/components/ui/table';
// import { Switch } from '@/components/ui/switch';
// import { Button } from '@/components/ui/button';
// import Loader from '../Loader';
// import { Trash2 } from 'lucide-react';
// import { format } from 'date-fns';

// const ProductList = ({ products, productsLoading, onDelete }) => {
//   if (productsLoading) return <Loader />;

//   return (
//     <div className="container mx-auto px-4 py-6 overflow-x-auto h-screen">
//       <Card className="bg-zinc-100 border border-gray-200 shadow-lg">
//         <CardHeader>
//           <CardTitle className="text-zinc-900 text-xl">All Products</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="text-zinc-900">Product</TableHead>
//                   <TableHead className="text-zinc-900">Gender</TableHead>
//                   <TableHead className="text-zinc-900">Category</TableHead>
//                   <TableHead className="text-zinc-900">Sub-category</TableHead>
//                   <TableHead className="text-zinc-900">Stock</TableHead>
//                   <TableHead className="text-zinc-900">Price</TableHead>
//                   <TableHead className="text-zinc-900">Featured</TableHead>
//                   <TableHead className="text-zinc-900">Ratings</TableHead>
//                   <TableHead className="text-zinc-900">Created At</TableHead>
//                   <TableHead className="text-zinc-900">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {products?.map((product) => (
//                   <TableRow
//                     key={product._id}
//                     className="hover:bg-gray-200 transition-colors"
//                   >
//                     <TableCell className="flex items-center gap-4">
//                       <img
//                         src={product.coverImage.url}
//                         alt={product.name}
//                         className="w-12 h-12 rounded-md object-cover border"
//                       />
//                       <div>
//                         <p className="font-semibold text-zinc-600 text-sm">
//                           {product.name.length > 10 ? product.name.slice(0, 10) + '…' : product.name}
//                         </p>
//                       </div>
//                     </TableCell>
//                     <TableCell className="text-zinc-600 text-sm capitalize">
//                       {product.gender}
//                     </TableCell>
//                     <TableCell className="text-zinc-600 text-sm">
//                       {product.category}
//                     </TableCell>
//                     <TableCell className="text-zinc-600 text-sm">
//                       {product.subCategory}
//                     </TableCell>
//                     <TableCell className="text-zinc-600 text-sm">
//                       {product.countInStock}
//                     </TableCell>
//                     <TableCell className="text-emerald-400 font-semibold text-sm">
//                       ₹{product.price}
//                     </TableCell>
//                     <TableCell>
//                       <Switch
//                         checked={product.isFeatured}
//                         // onCheckedChange={() => toggleFeatured(product._id)}
//                         className="bg-gray-700 data-[state=checked]:bg-yellow-400"
//                       />
//                     </TableCell>
//                     <TableCell className="text-zinc-600 text-sm">
//                       {product.ratings || 0}
//                     </TableCell>
//                     <TableCell className="text-zinc-600 text-xs">
//                       {format(new Date(product.createdAt), 'dd MMM yyyy')}
//                     </TableCell>
//                     <TableCell >
//                       {/* <Button
//                         variant="destructive"
//                         size="sm"
//                         onClick={() => onDelete?.(product._id)}
//                         className="text-sm"
//                       >
//                         Delete
//                       </Button> */}
//                       <Trash2 className="w-5 h-5 text-red-500" />
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ProductList;


import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import Loader from '../Loader';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { useDeleteProductMutation, useGetAllProductsQuery, useToggleFeaturedProductMutation } from '../../../store/productApi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ProductList = () => {
  const { data: products, isLoading: productsLoading } = useGetAllProductsQuery();
  const [deleteProduct, { isLoading: deleteLoading }] = useDeleteProductMutation();
  const [toggleFeatured, { isLoading: toggleLoading }] = useToggleFeaturedProductMutation();


  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');

  if (productsLoading) return <Loader />;

  const filteredProducts = products?.data.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter
      ? product.category === categoryFilter
      : true;
    const matchesGender = genderFilter
      ? product.gender === genderFilter
      : true;

    return matchesSearch && matchesCategory && matchesGender;
  });

  const uniqueCategories = [...new Set(products?.data.map(p => p.category))];
  const uniqueGenders = [...new Set(products?.data.map(p => p.gender))];

  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODRkYmJhM2RlMGVjMWU3YzNiYWU0NDgiLCJlbWFpbCI6InNvdXJhZGVlcGhhenJhOTNAZ21haWwuY29tIiwiaWF0IjoxNzUxNzM2ODQ5LCJleHAiOjE3NTE3MzY5MDl9.JDz3zhyjY6nb8dCFzsvo4sg7guutylYJiYacSxyxues

  //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODRkYmJhM2RlMGVjMWU3YzNiYWU0NDgiLCJlbWFpbCI6InNvdXJhZGVlcGhhenJhOTNAZ21haWwuY29tIiwiaWF0IjoxNzUxNzM2ODQ5LCJleHAiOjE3NTE3MzY5MDl9.JDz3zhyjY6nb8dCFzsvo4sg7guutylYJiYacSxyxues

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="container mx-auto px-4 py-6 overflow-x-auto h-screen">
      <Card className="bg-zinc-100 border border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-zinc-900 text-xl">All Products</CardTitle>
        </CardHeader>
        <CardContent>

          {/* 🔍 Search & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <Input
              placeholder="Search product name..."
              className="max-w-sm bg-white text-zinc-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 rounded-md border border-gray-300 bg-white text-zinc-700"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="px-4 py-2 rounded-md border border-gray-300 bg-white text-zinc-700"
            >
              <option value="">All Genders</option>
              {uniqueGenders.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* 🧾 Product Table */}
          <div className="overflow-x-auto ">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-zinc-900">Product</TableHead>
                  <TableHead className="text-zinc-900">Gender</TableHead>
                  <TableHead className="text-zinc-900">Category</TableHead>
                  <TableHead className="text-zinc-900">Sub-category</TableHead>
                  <TableHead className="text-zinc-900">Stock</TableHead>
                  <TableHead className="text-zinc-900">Price</TableHead>
                  <TableHead className="text-zinc-900">Featured</TableHead>
                  <TableHead className="text-zinc-900">Ratings</TableHead>
                  <TableHead className="text-zinc-900">Created At</TableHead>
                  <TableHead className="text-zinc-900">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts?.map((product) => (
                  <TableRow
                    key={product._id}
                    className="hover:bg-gray-200 transition-colors"
                  >
                    <TableCell className="flex items-center gap-4">
                      <img
                        src={product.coverImage.url}
                        alt={product.name}
                        className="w-12 h-12 rounded-md object-cover border"
                      />
                      <div>
                        <p className="font-semibold text-zinc-600 text-sm">
                          {product.name.length > 20
                            ? product.name.slice(0, 20) + '…'
                            : product.name}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-600 text-sm capitalize">
                      {product.gender}
                    </TableCell>
                    <TableCell className="text-zinc-600 text-sm">
                      {product.category}
                    </TableCell>
                    <TableCell className="text-zinc-600 text-sm">
                      {product.subCategory}
                    </TableCell>
                    <TableCell className="text-zinc-600 text-sm">
                      {product.countInStock}
                    </TableCell>
                    <TableCell className="text-emerald-400 font-semibold text-sm">
                      ₹{product.price}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={product.isFeatured}
                        // onCheckedChange={() => toggleFeatured(product._id)}
                        onCheckedChange={async (e) => {
                          try {
                            await toggleFeatured(product._id).unwrap();
                          } catch (error) {
                            toast.error(error?.data?.message || "Failed to toggle featured");
                          }
                        }}
                        className="bg-gray-700 data-[state=checked]:bg-yellow-400"
                      />
                    </TableCell>
                    <TableCell className="text-zinc-600 text-sm">
                      {product.ratings || 0}
                    </TableCell>
                    <TableCell className="text-zinc-600 text-xs">
                      {format(new Date(product.createdAt), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell>
                      <Trash2
                        onClick={async (e) => {
                          e.preventDefault();
                          try {
                            await deleteProduct(product._id).unwrap();
                          } catch (error) {
                            toast.error(error?.data?.message || "Failed to delete product");
                          }
                        }}
                        className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductList;

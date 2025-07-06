// src/components/CreateProduct.js
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateProductsMutation } from '../../../store/productApi';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const CreateProduct = () => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();
  const [createProduct, { isLoading }] = useCreateProductsMutation();

  // State for image previews
  const [coverImage, setCoverImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);

  // Available categories and subcategories
  const categories = [
    { value: 'clothing', label: 'Clothing' },
    { value: 'footwear', label: 'Footwear' },
  ];

  const subCategories = {
    clothing: [
      { value: 'shirts', label: 'Shirts' },
      { value: 'pants', label: 'Pants' },
      { value: 'tshirts', label: 'T-shirts' },
      { value: 'jackets', label: 'Jackets' },
    ],
    footwear: [
      { value: 'sneakers', label: 'Sneakers' },
      { value: 'boots', label: 'Boots' },
      { value: 'sandals', label: 'Sandals' },
      { value: 'heels', label: 'Heels' },
    ],
  };

  const genders = [
    { value: 'male', label: 'Men' },
    { value: 'female', label: 'Women' },
    { value: 'unisex', label: 'Unisex' },
  ];

  // Handle cover image selection
  const handleCoverImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCoverImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle additional images selection
  const handleAdditionalImages = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        newImages.push(reader.result);
        if (newImages.length === files.length) {
          setAdditionalImages(prev => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove additional image
  const removeAdditionalImage = (index) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
  };

  // Form submission handler
  const onSubmit = async (data) => {
    try {
      // Create FormData to handle file uploads
      const formData = new FormData();

      // Append text fields
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', data.price);
      formData.append('category', data.category);
      formData.append('subCategory', data.subCategory);
      formData.append('gender', data.gender);
      formData.append('countInStock', data.countInStock);

      // Append cover image
      const coverImageFile = document.querySelector('input[name="coverImage"]').files[0];
      formData.append('coverImage', coverImageFile);

      // Append additional images
      const additionalImageFiles = document.querySelector('input[name="additionalImages"]').files;
      for (let i = 0; i < additionalImageFiles.length; i++) {
        formData.append('additionalImages', additionalImageFiles[i]);
      }

      // Call the mutation
      await createProduct(formData).unwrap();

      // Reset form after successful submission
      reset();
      setCoverImage(null);
      setAdditionalImages([]);

      // Clear file inputs
      document.querySelector('input[name="coverImage"]').value = '';
      document.querySelector('input[name="additionalImages"]').value = '';


    } catch (error) {
      toast.error('Failed to create product');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className='max-w-[1200px]  mx-auto'
    >
      <Card className="w-full  mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Product Name */}
            <div>
              <Label htmlFor="name" className="mb-2 block">Product Name *</Label>
              <Input
                id="name"
                {...register('name', { required: 'Product name is required' })}
                placeholder="Enter product name"
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="mb-2 block">Description *</Label>
              <Textarea
                id="description"
                {...register('description', { required: 'Description is required' })}
                placeholder="Enter product description"
                rows={4}
                className={errors.description ? 'border-destructive' : ''}
              />
              {errors.description && (
                <p className="text-destructive text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price */}
              <div>
                <Label htmlFor="price" className="mb-2 block">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register('price', {
                    required: 'Price is required',
                    min: { value: 0.01, message: 'Price must be greater than 0' }
                  })}
                  placeholder="0.00"
                  className={errors.price ? 'border-destructive' : ''}
                />
                {errors.price && (
                  <p className="text-destructive text-sm mt-1">{errors.price.message}</p>
                )}
              </div>

              {/* Stock Quantity */}
              <div>
                <Label htmlFor="countInStock" className="mb-2 block">Stock Quantity *</Label>
                <Input
                  id="countInStock"
                  type="number"
                  {...register('countInStock', {
                    required: 'Stock quantity is required',
                    min: { value: 0, message: 'Stock cannot be negative' }
                  })}
                  placeholder="Enter quantity"
                  className={errors.countInStock ? 'border-destructive' : ''}
                />
                {errors.countInStock && (
                  <p className="text-destructive text-sm mt-1">{errors.countInStock.message}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <Label htmlFor="gender" className="mb-2 block">Gender</Label>
                <Select onValueChange={(value) => setValue('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genders.map(gender => (
                      <SelectItem key={gender.value} value={gender.value}>
                        {gender.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <Label htmlFor="category" className="mb-2 block">Category *</Label>
                <Select
                  onValueChange={(value) => {
                    setValue('category', value);
                    setValue('subCategory', '');
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-destructive text-sm mt-1">{errors.category.message}</p>
                )}
              </div>

              {/* Subcategory */}
              <div>
                <Label htmlFor="subCategory" className="mb-2 block">Subcategory *</Label>
                <Select onValueChange={(value) => setValue('subCategory', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {subCategories[watch('category') || []]?.map(subCat => (
                      <SelectItem key={subCat.value} value={subCat.value}>
                        {subCat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subCategory && (
                  <p className="text-destructive text-sm mt-1">{errors.subCategory.message}</p>
                )}
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <Label htmlFor="coverImage" className="mb-2 block">Cover Image *</Label>
              <Input
                id="coverImage"
                type="file"
                accept="image/*"
                {...register('coverImage', { required: 'Cover image is required' })}
                onChange={handleCoverImage}
                className={errors.coverImage ? 'border-destructive' : ''}
              />
              {errors.coverImage && (
                <p className="text-destructive text-sm mt-1">{errors.coverImage.message}</p>
              )}

              {coverImage && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-32 h-32 object-cover rounded-md border"
                  />
                </div>
              )}
            </div>

            {/* Additional Images */}
            <div>
              <Label htmlFor="additionalImages" className="mb-2 block">Additional Images</Label>
              <Input
                id="additionalImages"
                type="file"
                accept="image/*"
                multiple
                {...register('additionalImages')}
                onChange={handleAdditionalImages}
              />

              {additionalImages.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <div className="flex flex-wrap gap-3">
                    {additionalImages.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img}
                          alt={`Additional preview ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={() => removeAdditionalImage(index)}
                          className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto"
              >
                {isLoading ? 'Creating...' : 'Create Product'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CreateProduct;
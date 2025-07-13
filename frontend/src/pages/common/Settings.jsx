import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux';
import {  EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import { changeCurrentPassword } from '../../store/userReducer';

const Settings = () => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmitPassword = async (data) => {
    try {
      dispatch(changeCurrentPassword(data));
      reset();
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'Failed to change password. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Manage your account information and security</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Change Password Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4">
                  {/* Current Password */}
                  <div className="space-y-2 relative">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      type={showCurrent ? 'text' : 'password'}
                      id="currentPassword"
                      {...register('currentPassword', {
                        required: 'Current password is required'
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-[38px] text-gray-500"
                      tabIndex={-1}
                    >
                      {showCurrent ? <EyeOpenIcon /> : <EyeClosedIcon />}
                    </button>
                    {errors.currentPassword && (
                      <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="space-y-2 relative">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      type={showNew ? 'text' : 'password'}
                      id="newPassword"
                      {...register('newPassword', {
                        required: 'New password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-[38px] text-gray-500"
                      tabIndex={-1}
                    >
                      {showNew ? <EyeOpenIcon /> : <EyeClosedIcon />}
                    </button>
                    {errors.newPassword && (
                      <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2 relative">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      type={showConfirm ? 'text' : 'password'}
                      id="confirmPassword"
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: value =>
                          value === watch('newPassword') || 'Passwords do not match'
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-[38px] text-gray-500"
                      tabIndex={-1}
                    >
                      {showConfirm ? <EyeOpenIcon /> : <EyeClosedIcon />}
                    </button>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full">
                    Change Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Account Info Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-600">Username</Label>
                  <p className="text-gray-900 font-medium">{user?.username}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Email</Label>
                  <p className="text-gray-900 font-medium">{user?.email}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Account Type</Label>
                  <p className="text-gray-900 font-medium capitalize">{user?.role}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Member Since</Label>
                  <p className="text-gray-900 font-medium">
                    {new Date(user?.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default Settings;



// import { useForm } from 'react-hook-form';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import axios from '../../lib/axios';
// import { toast } from "react-hot-toast";
// import { useDispatch, useSelector } from 'react-redux';
// import { changeCurrentPassword } from '../../store/userReducer';
// import { ReloadIcon, EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";


// const Settings = () => {
//   const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
//   const dispatch = useDispatch();
//   const { user } = useSelector(state => state.auth);
  

//   const onSubmitPassword = async (data) => {
//     try {
//       await axios.patch('/auth/update-profile', data);
//       toast.success('Password changed successfully');
//       reset();
//     } catch (error) {
//       console.error('Error changing password:', error);
//       if (error.response?.data?.message) {
//         toast.error(error.response.data.message);
//       } else {
//         toast.error('Failed to change password. Please try again.');
//       }
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <CardHeader>
//         <CardTitle>Profile Settings</CardTitle>
//         <CardDescription>Manage your account information and security</CardDescription>
//       </CardHeader>

//       <CardContent>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <div>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Change Password</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="currentPassword">Current Password</Label>
//                     <Input
//                       type="password"
//                       id="currentPassword"
//                       {...register('currentPassword', {
//                         required: 'Current password is required'
//                       })}
//                     />
//                     {errors.currentPassword && (
//                       <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="newPassword">New Password</Label>
//                     <Input
//                       type="password"
//                       id="newPassword"
//                       {...register('newPassword', {
//                         required: 'New password is required',
//                         minLength: {
//                           value: 6,
//                           message: 'Password must be at least 6 characters'
//                         }
//                       })}
//                     />
//                     {errors.newPassword && (
//                       <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="confirmPassword">Confirm Password</Label>
//                     <Input
//                       type="password"
//                       id="confirmPassword"
//                       {...register('confirmPassword', {
//                         required: 'Please confirm your password',
//                         validate: value =>
//                           value === watch('newPassword') || 'Passwords do not match'
//                       })}
//                     />
//                     {errors.confirmPassword && (
//                       <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
//                     )}
//                   </div>

//                   <Button type="submit" className="w-full">
//                     Change Password
//                   </Button>
//                 </form>
//               </CardContent>
//             </Card>
//           </div>

//           <div>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Account Information</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <Label className="text-gray-600">Username</Label>
//                   <p className="text-gray-900 font-medium">{user?.username}</p>
//                 </div>
//                 <div>
//                   <Label className="text-gray-600">Email</Label>
//                   <p className="text-gray-900 font-medium">{user?.email}</p>
//                 </div>
//                 <div>
//                   <Label className="text-gray-600">Account Type</Label>
//                   <p className="text-gray-900 font-medium capitalize">{user?.role}</p>
//                 </div>
//                 <div>
//                   <Label className="text-gray-600">Member Since</Label>
//                   <p className="text-gray-900 font-medium">
//                     {new Date(user?.createdAt).toLocaleDateString('en-US', {
//                       year: 'numeric',
//                       month: 'long',
//                       day: 'numeric'
//                     })}
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </CardContent>
//     </div>
//   );
// };

// export default Settings;
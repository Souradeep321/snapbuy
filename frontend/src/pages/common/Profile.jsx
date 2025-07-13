import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '../../lib/axios';
import { logout } from '../../store/userReducer';
import { useDispatch } from 'react-redux';

const Profile = () => {
  const { user } = useSelector(state => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Added navigate hook
  const fileInputRef = useRef(null);

  // State for avatar preview and loading
  const [tempAvatar, setTempAvatar] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(user?.avatar?.url || '');

  // Clean up temporary URLs on unmount
  useEffect(() => {
    return () => {
      if (tempAvatar) {
        URL.revokeObjectURL(tempAvatar);
      }
    };
  }, [tempAvatar]);

  // Update avatar when user data changes
  useEffect(() => {
    if (user?.avatar?.url) {
      setCurrentAvatar(user.avatar.url);
    }
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPEG, or WebP)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast.error('Please select an image smaller than 2MB');
      return;
    }

    try {
      setAvatarLoading(true);

      // Create temporary preview
      const previewUrl = URL.createObjectURL(file);
      setTempAvatar(previewUrl);

      // Prepare form data
      const formData = new FormData();
      formData.append('avatar', file);

      // Upload avatar
      const response = await axios.patch('/auth/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Update avatar with new URL
      setCurrentAvatar(response.data.data.avatar.url);
      toast.success('Avatar updated successfully');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error(error.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setAvatarLoading(false);
      setTempAvatar(null); // Clear preview after upload
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await dispatch(logout()).unwrap(); // Ensure logout is successful
      navigate("/");
    } catch (error) {
      toast.error(error.message || 'Failed to logout');
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white shadow-md p-4 flex flex-col">
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <Avatar
              className="w-24 h-24 cursor-pointer"
              onClick={handleAvatarClick}
            >
              {avatarLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-full">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : (
                <>
                  <AvatarImage
                    src={tempAvatar || currentAvatar}
                    alt="Profile"
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gray-200">
                    {user?.username?.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </>
              )}
            </Avatar>

            {!avatarLoading && (
              <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>
          <h2 className="mt-4 text-xl font-semibold">{user?.username}</h2>
          <p className="text-gray-600">{user?.email}</p>
        </div>

        <nav className="space-y-1 flex-1">
          <Button
            asChild
            variant={location.pathname.includes('settings') ? 'default' : 'ghost'}
            className="w-full justify-start"
          >
            <Link to="settings">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Profile Settings
            </Link>
          </Button>

          <Button
            asChild
            variant={location.pathname.includes('orders') ? 'default' : 'ghost'}
            className="w-full justify-start"
          >
            <Link to="orders">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              Order History
            </Link>
          </Button>

          <Button
            asChild
            variant={location.pathname.includes('notifications') ? 'default' : 'ghost'}
            className="w-full justify-start"
          >
            <Link to="notifications">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              Notifications
            </Link>
          </Button>
        </nav>
        
        {/* Logout button at the bottom */}
        <div className="mt-auto">
          <Button
            variant="ghost"
            className="w-full justify-start mt-4"
            onClick={handleLogout}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        <Outlet context={{ user }} />
      </div>
    </div>
  );
};

export default Profile;

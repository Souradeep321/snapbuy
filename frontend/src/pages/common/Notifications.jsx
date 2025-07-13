import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useDeleteAllNotificationsMutation, useDeleteNotificationMutation, useGetNotificationsQuery, useMarkAsReadMutation } from '../../store/notificationApi';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const Notifications = () => {
  const { data, isLoading, error, refetch } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [deleteAllNotifications] = useDeleteAllNotificationsMutation();
  
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const notifications = data?.data || [];

  // Format date to human-readable format
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Toggle notification selection
  const toggleNotification = (id) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  // Select all notifications
  const selectAllNotifications = () => {
    if (selectedNotifications.length === notifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map(n => n._id));
    }
  };

  // Mark selected notifications as read
  const handleMarkAsRead = async () => {
    if (selectedNotifications.length === 0) return;
    
    try {
      await Promise.all(
        selectedNotifications.map(id => 
          markAsRead(id).unwrap()
        )
      );
      toast.success('Notifications marked as read');
      refetch();
      setSelectedNotifications([]);
    } catch (error) {
      toast.error('Failed to mark notifications as read');
    }
  };

  // Delete selected notifications
  const handleDelete = async () => {
     // if (selectedNotifications.length === 0) return;
    
    // try {
    //   await Promise.all(
    //     selectedNotifications.map(id => 
    //       deleteNotification(id).unwrap()
    //     )
    //   );
    //   toast.success('Notifications deleted');
    //   refetch();
    //   setSelectedNotifications([]);
    // } catch (error) {
    //   toast.error('Failed to delete notifications');
    // }
    try {
      await deleteAllNotifications().unwrap();
      toast.success('All notifications deleted');
    } catch (error) {
      toast.error('Failed to delete notifications');
    }
  };

  // Mark single notification as read
  const handleSingleMarkAsRead = async (id) => {
    try {
      await markAsRead(id).unwrap();
      toast.success('Notification marked as read');
      refetch();
      setSelectedNotifications(prev => prev.filter(item => item !== id));
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  // Delete single notification
  const handleSingleDelete = async (id) => {
    try {
      await deleteNotification(id).unwrap();
      toast.success('Notification deleted');
      refetch();
      setSelectedNotifications(prev => prev.filter(item => item !== id));
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  if (isLoading) return <Loader />;

  if (error) return <div className="text-red-500 p-6">Error loading notifications</div>;

  if (notifications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-gray-900">No notifications</h3>
          <p className="mt-1 text-gray-500">You'll see notifications about your account activity here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              You have {notifications.filter(n => !n.isRead).length} unread notifications
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleMarkAsRead}
              disabled={selectedNotifications.length === 0}
            >
              Mark as read
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleDelete}
              disabled={selectedNotifications.length === 0}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={
                  notifications.length > 0 && 
                  selectedNotifications.length === notifications.length
                }
                onCheckedChange={selectAllNotifications}
              />
              <label 
                htmlFor="select-all" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Select all
              </label>
            </div>
          </div>
          
          <div className="divide-y">
            {notifications.map(notification => (
              <div 
                key={notification._id} 
                className={`p-4 ${notification.isRead ? 'bg-white' : 'bg-blue-50'}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center mt-1">
                    <Checkbox
                      checked={selectedNotifications.includes(notification._id)}
                      onCheckedChange={() => toggleNotification(notification._id)}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <h4 className="font-medium">
                        {notification.sender?.username || 'System Notification'}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>
                    
                    <p className="mt-1 text-sm">
                      {notification.message}
                    </p>
                    
                    <div className="mt-3 flex gap-2">
                      {!notification.isRead && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSingleMarkAsRead(notification._id)}
                        >
                          Mark as read
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSingleDelete(notification._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Notifications;

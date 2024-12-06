import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Bell, Info, AlertTriangle, X } from 'lucide-react';
import { 
  useGetNotificationsQuery, 
  useMarkAsReadMutation,
  useDeleteNotificationMutation 
} from '../../store/services/notificationService';

interface NotificationListProps {
  onClose: () => void;
}

const NotificationList: React.FC<NotificationListProps> = ({ onClose }) => {
  const { data: notifications, isLoading } = useGetNotificationsQuery(undefined, {
    pollingInterval: 30000, // Poll every 30 seconds
  });
  const [markAsRead] = useMarkAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const handleNotificationClick = async (id: string) => {
    try {
      await markAsRead(id).unwrap();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteNotification(id).unwrap();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'system':
        return <Bell className="h-5 w-5 text-indigo-500" />;
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b">
        Notifications
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {!notifications || notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() => handleNotificationClick(notification._id)}
              className={`px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-start gap-3 relative group ${
                notification.read ? 'opacity-75' : ''
              }`}
            >
              <div className="flex-shrink-0 mt-1">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              )}
              <button
                onClick={(e) => handleDelete(e, notification._id)}
                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationList;
import PropTypes from 'prop-types';
import Anchor from '@ui/anchor';
import { useState, useEffect } from 'react';
import LogoutButton from '@components/logout-button';
import axios from 'axios';
import { BellIcon } from '@heroicons/react/24/outline';

const UserDropdown = ({ ethBalance, auth, debts }) => {
  const [notifications, setNotifications] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const token = localStorage.getItem('token'); // جلب التوكن من التخزين المحلي
 const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // دالة لجلب الإشعارات الغير مقروءة
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/admin/unread-notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications(res.data);
console.log(res.data);
      setNotificationsCount(res.data.length);
    } catch (error) {
      console.error('خطأ في جلب الإشعارات:', error);
    }
  };

  // دالة لجعل إشعار مقروء
  const markAsRead = async (id) => {
    try {
      await axios.post(`${apiBaseUrl}/admin/mark-as-read/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // إزالة الإشعار من القائمة
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setNotificationsCount((prev) => prev - 1);
    } catch (error) {
      console.error('فشل في تعليم الإشعار كمقروء:', error);
    }
  };

  // التحديث المستمر للإشعارات
  useEffect(() => {
    fetchNotifications(); // أول تحميل
    const interval = setInterval(fetchNotifications, 30000); // كل 30 ثانية
    return () => clearInterval(interval); // تنظيف عند إلغاء التركيب
  }, []);

  return (
    <div className="icon-box">
      {/* أيقونة الإشعارات */}
      <div className="icon-box notification-icon">
        <Anchor path="#">
          <div className="notification-bell relative">
            <BellIcon className="w-7 h-7 text-red-600 my-notification" />
            {notificationsCount > 0 && (
              <span className="notification-count absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs px-2">
                {notificationsCount}
              </span>
            )}
          </div>
        </Anchor>
      </div>

      {/* القائمة المنسدلة */}
      <div className="rn-dropdown max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="rn-inner-top text-center text-gray-500 p-3">
            لا توجد إشعارات جديدة
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className="rn-inner-top border-b p-3 cursor-pointer hover:bg-gray-100"
              onClick={() => markAsRead(notification.id)}
            >
              {notification.data.message || 'إشعار جديد'}
              <div className="text-xs text-gray-400">
                {new Date(notification.created_at).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

UserDropdown.propTypes = {
  ethBalance: PropTypes.string,
  auth: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
  }),
  debts: PropTypes.string,
};

export default UserDropdown;

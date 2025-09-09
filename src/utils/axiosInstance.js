// utils/axiosInstance.js
import axios from 'axios';
import nookies from 'nookies';

// دالة للحصول على التوكن من الكوكيز
const getToken = () => {
  const cookies = nookies.get(); // استرجاع الكوكيز
  return cookies.token || null;
};

// إعداد axios لتمرير التوكن تلقائيًا في جميع الطلبات
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // إضافة base URL إذا كنت تستخدمه
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    const updatedConfig = { ...config }; // إنشاء نسخة من config
    if (token) {
      updatedConfig.headers.Authorization = `Bearer ${token}`; // إضافة التوكن إلى الهيدر
    }
    return updatedConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

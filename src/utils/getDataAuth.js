// utils/getDataAuth.js
import axiosInstance from './axiosInstance';

export const getData = async (endPoint, token) => {
  try {
    const result = await axiosInstance.get(`${endPoint}`, {
      headers: {
        Authorization: `Bearer ${token}`, // إرسال التوكن مع الطلب
      },
    });
    return {
      myItems: result?.data,
    };
  } catch (error) {
    console.error('Error fetching data:', error); // طباعة الأخطاء
    return {
      myItems: [],
    };
  }
};

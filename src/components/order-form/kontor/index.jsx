import React, { useState,useEffect } from 'react';
import Button from '@ui/button';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { useMobile } from '../../../context/MobileContext'; // استيراد هوك الـ Context

/* eslint-disable object-shorthand */

const OrderForm = ({ app }) => {
  const { mobile, setMobile } = useMobile(); // استهلاك القيمة من الـ Context
  const [user, setUser] = useState({});
  const [appField, setAppField] = useState({
    mobile: mobile, // استخدام القيمة من الـ Context
    user_id: '',
    tweetcell_kontor_id: app ? app.id : '',
    price: app ? app.price : '',
    count: app ? app.amount : '',
  });

  const storedToken = localStorage.getItem('token');
  const [currency, setCurrency] = useState('TL');

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const savedCurrency = localStorage.getItem('currency') || 'TL';
        setCurrency(savedCurrency.toUpperCase());
      }
    }, []);

  const changeAppFieldHandler = (e) => {
    const { name, value } = e.target;
    if (name === 'mobile') {
      setMobile(value); // تحديث القيمة في الـ Context عند تغيير الموبايل
    }
    setAppField((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(appField);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const result = await axios.post(
        `${apiBaseUrl}/tweetcell-kontor/order/${app.id}`,
        appField,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      toast.success(result.data.message);
      setAppField({
        mobile: '',
        user_id: '',
        tweetcell_kontor_id: app ? app.id : '',
        price: app ? app.price : '',
        count: app ? app.amount : '',
      });
    } catch (error) {
      if (error.response) {
        console.error('Error Data:', error.response.data);
        console.error('Error Status:', error.response.status);
        console.error('Error Headers:', error.response.headers);
      }
      toast.error('فشل في تسجيل الطلب، يرجى المحاولة مرة أخرى');
    }
  };

  return (
    <div className="form-wrapper-one registration-area">
      <form onSubmit={onSubmit}>
        <div className="tagcloud">
          <h3 className="mb--30">
            اتمام عملية الشراء
            <span className="mybutton-margin">السعر: {app.price}{currency}</span>
          </h3>
        </div>
        <div className="mb-5">
          <input
            className="withRadius"
            type="text"
            id="mobile"
            name="mobile"
            required
            placeholder=" رقم الموبايل"
            value={appField.mobile} // ربط قيمة الحقل بالقيمة من الـ Context
            onChange={changeAppFieldHandler}
          />
        </div>

        <Button type="submit" size="medium" className="mr--15">
          شراء
        </Button>
        <Button path="/" color="primary-alta" size="medium">
          الغاء الأمر
        </Button>
      </form>
      <br />
      <br />
      {app.note && (
        <div>
          <p>{app.note}</p>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default OrderForm;

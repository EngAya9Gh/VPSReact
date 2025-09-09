import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@ui/button';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { useRouter } from 'next/router'; // استيراد useRouter
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const OrderForm = ({ app }) => {
  const router = useRouter(); // استخدام useRouter
  const [user, setUser] = useState({});
  const [deviceInfo, setDeviceInfo] = useState({});
  const [appField, setAppField] = useState({
    user_id: '',
    player_no: '',
    tweetcell_id: app ? app.id : '',
    oyun_id: app ? app.player_no : '',
    price: app ? app.price : '',
    kupur: app ? app.amount : '',
    device_info: {}, // ابدأ بـ device_info فارغة
  });
  const [isDisabled, setIsDisabled] = useState(false); // حالة لتتبع ما إذا كان الزر معطلاً
  const [currency, setCurrency] = useState('TL');

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const savedCurrency = localStorage.getItem('currency') || 'TL';
        setCurrency(savedCurrency.toUpperCase());
      }
    }, []);


  // الحصول على التوكن من localStorage وتحديث السعر
  const storedToken = localStorage.getItem('token');

  useEffect(() => {
    // جلب بيانات المستخدم
    const getUserDataAndUpdatePrice = async () => {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axios.get(`${apiBaseUrl}/logged-in-user`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      setUser(response.data);
    };

    // جلب بيانات الجهاز مثل الاسم و IP
    const getDeviceInfo = async () => {
 const fp = await FingerprintJS.load();

  // Get the unique fingerprint of the user's device
  const result = await fp.get();

setDeviceInfo({
  userAgent: navigator.userAgent, // استخدام userAgent كمفتاح
  fingerprint: result.visitorId,  // استخدام visitorId كمفتاح
});};

    // استدعاء الدوال داخل useEffect
    getUserDataAndUpdatePrice();
    getDeviceInfo();
  }, []); 

  // تحديث حالة appField عند حصول البيانات
  useEffect(() => {
    if (user && Object.keys(deviceInfo).length > 0) {
      setAppField((prev) => ({
        ...prev,
        user_id: user.id,
        device_info: deviceInfo, // تحديث device_info
      }));
    }
  }, [user, deviceInfo]); // تحديث عندما تتغير user أو deviceInfo

  const changeAppFieldHandler = (e) => {
    const { name, value } = e.target;
      if (/^\d*\.?\d*$/.test(value)) {
      setAppField((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
   if (isDisabled) return; // إذا كان الزر معطلاً، لا نسمح بالضغط مرة أخرى

    setIsDisabled(true); // تعطيل الزر بعد الضغط عليه للمرة الأولى
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const result = await axios.post(
        `${apiBaseUrl}/tweetcell/order/${app.id}`,
        appField,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      toast.success(result.data.message);
      setTimeout(() => {
        router.push('/');
      }, 9000);
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
          <label htmlFor="player_no" className="form-label">
            الرقم
          </label>
          <input
            className="withRadius"
            type="text"
            id="player_no"
            name="player_no"
            required
            placeholder="ادخل الرقم "
            onChange={changeAppFieldHandler}
          />
        </div>

      <Button
          type="submit"
          size="medium"
          className="mr--15"
          disabled={isDisabled} // تعطيل الزر بعد الضغط عليه
        >
          {isDisabled ? 'جاري الإرسال...' : 'شراء'}
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

// Prop types validation
OrderForm.propTypes = {
  app: PropTypes.shape({
    id: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    note: PropTypes.string,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
  }),
};

export default OrderForm;

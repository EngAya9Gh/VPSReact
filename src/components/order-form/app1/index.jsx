import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@ui/button';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { useRouter } from 'next/router';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const OrderForm = ({ app }) => {
  const router = useRouter();
  const [user, setUser] = useState({});
  const [deviceInfo, setDeviceInfo] = useState({});
  const [selectedQty, setSelectedQty] = useState(null);
  const [finalPrice, setFinalPrice] = useState(app?.price || 0);

  const [appField, setAppField] = useState({
    user_id: '',
    product_id:app?.product_id || '',
    player_no: app?.player_no || '',
    tweetcell_id: app ? app.id : '',
    price: app ? app.price : '',
    qty: 1,
    device_info: {},
  });

  const [isDisabled, setIsDisabled] = useState(false);
  const [currency, setCurrency] = useState('TL');
  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // جلب العملة
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCurrency = localStorage.getItem('currency') || 'TL';
      setCurrency(savedCurrency.toUpperCase());
    }
  }, []);

  // جلب بيانات المستخدم + البصمة
  useEffect(() => {
    const getUserDataAndUpdatePrice = async () => {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axios.get(`${apiBaseUrl}/logged-in-user`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setUser(response.data);
    };

    const getDeviceInfo = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setDeviceInfo({ userAgent: navigator.userAgent, fingerprint: result.visitorId });
    };

    getUserDataAndUpdatePrice();
    getDeviceInfo();
  }, []);

  // تحديث الحقول عند توفر البيانات
  useEffect(() => {
    if (user && Object.keys(deviceInfo).length > 0) {
      setAppField((prev) => ({
        ...prev,
        user_id: user.id,
        device_info: deviceInfo,
      }));
    }
  }, [user, deviceInfo]);

  // حساب السعر النهائي عند تغيير الكمية
  useEffect(() => {
    const pricePerUnit = parseFloat(app.price) || 0;
    const qty = selectedQty || 1;

    if (Array.isArray(app.qty_values)) {
      setFinalPrice(pricePerUnit * qty);
    } else if (app.qty_values && typeof app.qty_values === 'object') {
      setFinalPrice(pricePerUnit * qty);
    } else {
      setFinalPrice(pricePerUnit);
    }

    setAppField((prev) => ({ ...prev, qty }));
  }, [selectedQty, app.price, app.qty_values]);

  const changeAppFieldHandler = (e) => {
    const { name, value } = e.target;
    setAppField((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isDisabled) return;

    setIsDisabled(true);
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const result = await axios.post(
        `${apiBaseUrl}/tweetcell/order/${app.id}`,
        appField,
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );

      toast.success(result.data.message);
      setTimeout(() => router.push('/'), 3000);
    } catch (error) {
      console.error('Error:', error);
      toast.error('فشل في تسجيل الطلب، يرجى المحاولة مرة أخرى');
    }
  };

  return (
    <div className="form-wrapper-one registration-area">
      <form onSubmit={onSubmit}>
        <h3 className="mb--30">
          اتمام عملية الشراء — السعر: {finalPrice.toFixed(2)} {currency}
        </h3>

        {/* إذا كانت player_no موجودة فقط أطلبه */}
        {app.player_no && (
          <div className="mb-5">
            <label htmlFor="player_no" className="form-label">ايدي اللاعب</label>
            <input
              className="withRadius"
              type="text"
              id="player_no"
              name="player_no"
              required
              placeholder="ايدي اللاعب"
              onChange={changeAppFieldHandler}
            />
          </div>
        )}

        {/* اختيار الكمية حسب نوع qty_values */}
        {Array.isArray(app.qty_values) && (
          <div className="mb-5">
            <label htmlFor="qty_select" className="form-label">اختر الكمية</label>
            <select
              id="qty_select"
              className="withRadius"
              onChange={(e) => setSelectedQty(parseInt(e.target.value, 10))}
            >
              <option value="">اختر</option>
              {app.qty_values.map((q) => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
          </div>
        )}

        {app.qty_values && typeof app.qty_values === 'object' && (
          <div className="mb-5">
            <label htmlFor="qty_input" className="form-label">
              أدخل الكمية (من {app.qty_values.min} إلى {app.qty_values.max})
            </label>
            <input
              id="qty_input"
              type="number"
              className="withRadius"
              min={app.qty_values.min}
              max={app.qty_values.max}
              onChange={(e) => setSelectedQty(parseInt(e.target.value, 10))}
            />
          </div>
        )}

        <Button type="submit" size="medium" disabled={isDisabled}>
          {isDisabled ? 'جاري الإرسال...' : 'شراء'}
        </Button>
      </form>
      <ToastContainer />
    </div>
  );
};

OrderForm.propTypes = {
  app: PropTypes.shape({
    id: PropTypes.any.isRequired,
    price: PropTypes.any.isRequired,
    player_no: PropTypes.any,
    qty_values: PropTypes.any,
  }).isRequired,
};

export default OrderForm;

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
  const [appField, setAppField] = useState({
    user_id: '',
    player_no: '',
    tweetcell_id: app ? app.id : '',
    oyun_id: app ? app.player_no : '',
    price: app ? app.price : '',
    kupur: app ? app.amount : '',
    device_info: {},
  });
  const [isDisabled, setIsDisabled] = useState(false);
  const [currency, setCurrency] = useState('TL');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCurrency = localStorage.getItem('currency') || 'TL';
      setCurrency(savedCurrency.toUpperCase());
    }
  }, []);

  const storedToken = localStorage.getItem('token');

  useEffect(() => {
    const getUserDataAndUpdatePrice = async () => {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axios.get(`${apiBaseUrl}/logged-in-user`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      setUser(response.data);
    };

    const getDeviceInfo = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setDeviceInfo({
        userAgent: navigator.userAgent,
        fingerprint: result.visitorId,
      });
    };

    getUserDataAndUpdatePrice();
    getDeviceInfo();
  }, []);

  useEffect(() => {
    if (user && Object.keys(deviceInfo).length > 0) {
      setAppField((prev) => ({
        ...prev,
        user_id: user.id,
        device_info: deviceInfo,
      }));
    }
  }, [user, deviceInfo]);

  const changeAppFieldHandler = (e) => {
    const { name, value } = e.target;
    setAppField((prev) => ({
      ...prev,
      [name]: value,
    }));
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
            <span className="mybutton-margin">
              السعر: {app.price}
              {currency}
            </span>
          </h3>
        </div>

        {/* عرض حقل أيدي اللاعب فقط إذا لم يكن موجود مسبقاً */}
        {app.param? (
          <div className="mb-5">
            <label htmlFor="player_no" className="form-label">
              ايدي اللاعب
            </label>
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
        ) : null}

        <Button
          type="submit"
          size="medium"
          className="mr--15"
          disabled={isDisabled}
        >
          {isDisabled ? 'جاري الإرسال...' : 'شراء'}
        </Button>
        <Button path="/" color="primary-alta" size="medium">
          الغاء الأمر
        </Button>
      </form>

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

OrderForm.propTypes = {
  app: PropTypes.shape({
    id: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    note: PropTypes.string,
    player_no: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};

export default OrderForm;

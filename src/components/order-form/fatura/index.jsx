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
    fatura_no: '',
    mobile: '',
    fatura_id: app ? app.id : '',
      price: app ? app.price : '',
    device_info: {}, // ابدأ بـ device_info فارغة
  });
  const [isDisabled, setIsDisabled] = useState(false); // حالة لتتبع ما إذا كان الزر معطلاً


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
    device_info: JSON.stringify(deviceInfo), 
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
        `${apiBaseUrl}/fatura/order/${app.id}`,
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
            <span className="mybutton-margin">السعر: {app.price}TL</span>
          </h3>
        </div>
        	<div className="mb-5">  
              <p>يرجى ارسال :صورة الفاتورةعبر الواتس بعد ارسال الطلب مباشرة ويرجى تزويدنا برقم الجوال الذي سيتم ارسال الصور من خلاله </p>
				</div>
              		<div className="mb-5">
             	<input
						className="withRadius"
						type="text"
						id="mobile"
						name="mobile"
						required
						placeholder=" رقم الهاتف الذي سيتم ارسال الصور من خلاله عبر الواتس اب "
						value={appField.mobile}
					            onChange={changeAppFieldHandler}

						
					/>
					
				</div>
        
        <div className="mb-5">
          <label htmlFor="fatura_no" className="form-label">
رقم الفاتورة
          </label>
          <input
            className="withRadius"
            type="text"
            id="fatura_no"
            name="fatura_no"
            required
            placeholder="رقم الفاتورة"
            onChange={changeAppFieldHandler}
          />
        </div>
         <div className="mb-5">
          <label htmlFor="price" className="form-label">
قيمة الفاتورة
          </label>
          <input
            className="withRadius"
            type="text"
            id="price"
            name="price"
            required
            placeholder="قيمة الفاتورة"
            onChange={changeAppFieldHandler}
          />
        </div>
<div className="icon-box1"><a href="https://api.whatsapp.com/send/?phone=905392065497&amp;text&amp;type=phone_number&amp;app_absent=0" target="_blank" rel="noopener noreferrer"><svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="#25D366"><path d="M12.004 2.004c-5.523 0-10 4.477-10 10 0 1.793.479 3.492 1.386 4.996l-1.48 5.481 5.634-1.471c1.452.826 3.104 1.292 4.88 1.292 5.523 0 10-4.477 10-10 0-5.522-4.477-10-10-10zm.041 18c-1.583 0-3.129-.407-4.496-1.172l-.321-.185-3.343.873.891-3.301-.209-.338c-.84-1.367-1.287-2.937-1.287-4.545 0-4.411 3.589-8 8-8 4.411 0 8 3.589 8 8 0 4.411-3.589 8-8 8zm4.45-5.714c-.247-.124-1.469-.726-1.698-.808-.229-.082-.396-.124-.564.123s-.647.808-.793.975c-.146.165-.29.185-.537.061-.247-.124-1.041-.383-1.981-1.22-.732-.652-1.227-1.457-1.37-1.705-.145-.248-.015-.383.109-.506.111-.11.247-.29.371-.435.124-.145.165-.248.248-.413.082-.165.041-.31-.021-.435-.061-.124-.564-1.353-.772-1.854-.204-.493-.411-.428-.564-.428-.146-.015-.311-.015-.478-.015-.166 0-.435.062-.663.31-.227.248-.863.841-.863 2.048s.884 2.372 1.008 2.537c.124.165 1.736 2.63 4.211 3.689.589.254 1.049.405 1.406.518.591.187 1.128.16 1.553.096.474-.071 1.468-.601 1.676-1.18.207-.579.207-1.075.145-1.18-.061-.103-.227-.165-.474-.289z"></path></svg></a></div>

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

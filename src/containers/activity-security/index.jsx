import React, { useEffect, useState } from "react"; 
import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const ActivityArea = ({ space, className }) => {
  const [qrCode, setQrCode] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [otp, setOtp] = useState('');
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [isEnabling, setIsEnabling] = useState(null); // لتحديد العملية (تفعيل/إلغاء)
  const router = useRouter();
  
  useEffect(() => {
    const checkTwoFactorStatus = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const result = await axios.get(`${apiBaseUrl}/twoFactorStatus`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        setIsTwoFactorEnabled(result.data.enabled);
      } catch (error) {
        console.error("Error checking two-factor status:", error);
      }
    };

    checkTwoFactorStatus();
  }, []);

  const handleCheckboxChange = async () => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const storedToken = localStorage.getItem('token');

      if (!isTwoFactorEnabled) {
        // تفعيل المصادقة الثنائية
        const result = await axios.post(`${apiBaseUrl}/enableTwoFactor`, {}, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        setQrCode(result.data.qrCode);
        setSecretKey(result.data.secretKey);
        setIsEnabling(true); // العملية هي تفعيل
      } else {
        // إلغاء المصادقة الثنائية
        setIsEnabling(false); // العملية هي إلغاء
      }
    } catch (error) {
      console.error("Error handling two-factor authentication:", error);
      toast.error('حدث خطأ أثناء تعديل حالة المصادقة الثنائية!');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const storedToken = localStorage.getItem('token');
      const response = await axios.post(`${apiBaseUrl}/verifyOtp`, 
        { otp, isEnabling }, // إرسال العملية مع رمز التحقق
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
      
        setIsTwoFactorEnabled(isEnabling); // تحديث الحالة بناءً على العملية
        setQrCode('');
        setSecretKey('');
        setIsEnabling(null); // إعادة الحالة الابتدائية
        localStorage.removeItem('token');
        router.replace('/login');
      } else {
        toast.error('رمز التحقق غير صحيح!');
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error('فشل التحقق من الرمز!');
    }
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(secretKey); // نسخ الرمز السري إلى الحافظة
    toast.success('تم نسخ الرمز السري!');
  };

  return (
    <div className={clsx('rn-activity-area', space === 1 && 'rn-section-gapTop', className)}>
      <div className="container">
        <div className="row mb--30">
          <div className="col-lg-12">
            <label className="checkbox-label">
              <input
                type="checkbox"
                className="mycheckbox"
                checked={isTwoFactorEnabled}
                onChange={handleCheckboxChange}
                disabled={isEnabling !== null} // تعطيل التغيير أثناء التفعيل أو الإلغاء
              />
              {isTwoFactorEnabled
                ? 'إلغاء تفعيل المصادقة الثنائية'
                : 'تفعيل المصادقة الثنائية Google Authenticator (  امسح رمز QR من خلال تطبيق غوغل أو انسخ الرمز السري اليه)'
              }
            </label>
          </div>
        </div>
        {isEnabling === true && (
          <div className="row g-12 activity-direction">
            <div className="col-lg-8 mb_dec--15">
              <div className="qr-code-container" dangerouslySetInnerHTML={{ __html: qrCode }} />
              <div className="secret-key-container mt--20">
                <label htmlFor="secretKey" className="secret-key-label">
                  <strong>الرمز السري:</strong>
                </label>
                <div className="d-flex">
                  <input
                    id="secretKey"
                    type="password" // تغيير النوع إلى "password" لإخفاء النص
                    value={secretKey}
                    readOnly
                    className="form-control secret-key-input withRadius"
                  />
                  <button
                    type="button"
                    onClick={handleCopyClick}
                    className="btn btn-outline-secondary ms-2"
                  >
                    نسخ
                  </button>
                </div>
              </div>
              <div className="otp-form-container mt--20">
                <form onSubmit={handleOtpSubmit}>
                  <label htmlFor="otp" className="otp-label">
                    <strong>ادخل رمز التحقق المكون من 6 أرقام:</strong>
                  </label>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="form-control otp-input mytextinput withRadius"
                    placeholder="6 أرقام"
                    required
                  />
                  <button type="submit" className="btn btn-success otp-submit-btn">
                    تحقق
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
        {isEnabling === false && (
          <div className="otp-form-container mt--20">
            <form onSubmit={handleOtpSubmit}>
              <label htmlFor="otp" className="otp-label">
                <strong>ادخل رمز التحقق المكون من 6 أرقام لتأكيد الإلغاء:</strong>
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="form-control otp-input withRadius"
                placeholder="6 أرقام"
                required
              />
              <button type="submit" className="btn btn-danger otp-submit-btn">
                إلغاء المصادقة الثنائية
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

ActivityArea.propTypes = {
  space: PropTypes.oneOf([1, 2]),
  className: PropTypes.string,
};

ActivityArea.defaultProps = {
  space: 1,
};

export default ActivityArea;

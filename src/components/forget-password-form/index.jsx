import React, { useState } from "react";
import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'axios';
import { toast } from 'react-toastify';

const ForgetPasswordForm = ({ space, className }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsSubmitting(true);
      const { data } = await axios.post(`${apiBaseUrl}/forgot-password`, {
        email,
        user_type: 'user',
      });

      if (data?.success) {
        toast.success(data.message || 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
        setSent(true);
        setCountdown(60);
        const t = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(t);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast.error(data?.message || 'حدث خطأ أثناء الإرسال');
      }
    } catch (error) {
      if (error.response?.data?.errors?.email) {
        toast.error(error.response.data.errors.email[0]);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('حدث خطأ أثناء إرسال البريد، يرجى المحاولة مرة أخرى');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={clsx('rn-activity-area', space === 1 && 'rn-section-gapTop', className)}>
      <div className="container">
        <div className="row mb--30">
          <div className="col-lg-12">
            {sent ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '48px', color: '#28a745', marginBottom: '20px' }}>✅</div>
                <p style={{ color: '#6c757d', marginBottom: '20px', lineHeight: '1.6' }}>
                  لقد تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.<br/>
                  يرجى التحقق من صندوق الوارد وصندوق الرسائل غير المرغوب فيها.
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={countdown > 0}
                  onClick={() => setSent(false)}
                  style={{ opacity: countdown > 0 ? 0.6 : 1 }}
                >
                  {countdown > 0 ? `إعادة الإرسال خلال ${countdown}ث` : 'إرسال مرة أخرى'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <label htmlFor="email" className="form-label">البريد الإلكتروني</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="withRadius"
                />
                <button type="submit" className="btn btn-primary mt-3" disabled={isSubmitting}>
                  {isSubmitting ? 'جارٍ الإرسال...' : 'إرسال رابط الاستعادة'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ForgetPasswordForm.propTypes = {
  space: PropTypes.oneOf([1, 2]),
  className: PropTypes.string,
};

ForgetPasswordForm.defaultProps = {
  space: 1,
};

export default ForgetPasswordForm;

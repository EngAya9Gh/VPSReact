import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useRouter } from 'next/router';


const LoginForm = ({ className }) => {
  const router = useRouter();
  const { token, email, type = 'user', redirect_to } = router.query;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debug logging for URL parameters
  useEffect(() => {
    console.log('URL Parameters:', { token, email, type, redirect_to });
  }, [token, email, type, redirect_to]);

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (password !== confirmPassword) {
          toast.error('كلمات المرور غير متطابقة.');
          return;
      }

      if (!token || !email) {
          toast.error('رابط إعادة تعيين كلمة المرور غير صالح.');
          return;
      }

      if (password.length < 8) {
          toast.error('يجب ألا تقل كلمة المرور عن 8 أحرف.');
          return;
      }

      setIsSubmitting(true);

      try {
          const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

          // Debug logging
          console.log('Reset password data:', {
              token: token ? 'present' : 'missing',
              email: email || 'missing',
              password: password ? 'present' : 'missing',
              password_confirmation: confirmPassword ? 'present' : 'missing'
          });

          const { data } = await axios.post(`${apiBaseUrl}/reset-password`, {
              token,
              email,
              password,
              password_confirmation: confirmPassword
          });

          if (data.success) {
              toast.success('تم إعادة تعيين كلمة المرور بنجاح.');

              // التوجيه بناءً على redirect_to أو نوع المستخدم
              if (redirect_to) {
                  router.push(redirect_to);
              } else {
                  const userType = data.user_type || type;
                  if (userType === 'admin') {
                      router.push('/login-test'); // صفحة دخول الإدارة
                  } else {
                      router.push('/login?reset=done'); // صفحة دخول المستخدمين العاديين
                  }
              }
          } else {
              toast.error(data.message || 'حدث خطأ. يرجى المحاولة لاحقًا.');
          }
      } catch (error) {
          console.error('Reset password error:', error.response?.data || error.message);

          if (error.response?.data?.errors) {
              // عرض أخطاء التحقق
              const errors = error.response.data.errors;
              Object.keys(errors).forEach((key) => {
                  errors[key].forEach((message) => toast.error(message));
              });
          } else if (error.response?.data?.message) {
              toast.error(error.response.data.message);
          } else if (error.response?.status === 422) {
              toast.error('البيانات المدخلة غير صحيحة. يرجى التحقق من جميع الحقول.');
          } else {
              toast.error('حدث خطأ أثناء إعادة تعيين كلمة المرور. يرجى المحاولة لاحقًا.');
          }
      } finally {
          setIsSubmitting(false);
      }
  };


    return (
        <div className={clsx('form-wrapper-one product-style-one', className)}>

            <p>أدخل كلمة المرور الجديدة لإعادة تعيين كلمة المرور.</p>
            <form onSubmit={handleSubmit}>
                <div className="mb-5">

                    <input
                        type="password"
                        id="password"
                        placeholder="أدخل كلمة المرور الجديدة"
                        required
                        className="withRadius"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isSubmitting}
                    />
                </div>
                <div className="mb-5">

                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="أدخل تأكيد كلمة المرور"
                        required
                        className="withRadius"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isSubmitting}
                    />
                </div>

                <div className="mb-3" style={{ fontSize: '14px', color: '#6c757d' }}>
                    <strong>متطلبات كلمة المرور:</strong>
                    <ul style={{ margin: '5px 0', paddingRight: '20px' }}>
                        <li>يجب ألا تقل عن 8 أحرف</li>
                        <li>يُفضل استخدام مزيج من الأحرف والأرقام والرموز</li>
                    </ul>
                </div>

                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'جارٍ الإرسال...' : 'إعادة تعيين'}
                </button>
            </form>
        </div>
    );
};

LoginForm.propTypes = {
    className: PropTypes.string,
};

export default LoginForm;

 import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Button from '@ui/button';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import nookies from 'nookies';
import axios from 'axios';

const LoginFormTest = ({ className }) => {
	const router = useRouter();
	const [userField, setUserField] = useState({ email: '', password: '' });
	const [rememberMe, setRememberMe] = useState(false);
	const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
	const [otp, setOtp] = useState('');
	const [userName, setUserName] = useState('');
    const [showPassword, setShowPassword] = useState(false); // ✅ حالة للتحكم بإظهار كلمة المرور
    const [showForgotPassword, setShowForgotPassword] = useState(false); // حالة لإظهار نموذج نسيان كلمة المرور
    const [forgotEmail, setForgotEmail] = useState(''); // البريد الإلكتروني لنسيان كلمة المرور
    const [forgotPasswordSent, setForgotPasswordSent] = useState(false); // حالة إرسال البريد
    const [countdown, setCountdown] = useState(0); // العداد الزمني
   const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const fetchCurrency = async (token) => {
    try {
    const res = await axios.get(`${apiBaseUrl}/user-currency`, {
    headers: {
    Authorization: `Bearer ${token}`,
    },
    });

    const currency = res.data.currency;

    // 🟢 خزّن العملة في localStorage
    localStorage.setItem('currency', currency);

    // ❓ إذا كنت تستعمل Store أو Context أيضاً
    // setCurrency(currency);

    } catch (err) {
    console.error("فشل في جلب العملة:", err);
    }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); // ✅ تبديل حالة الإظهار والإخفاء
    };

    // دالة لإرسال بريد نسيان كلمة المرور
    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${apiBaseUrl}/forgot-password`, {
                email: forgotEmail,
                user_type: 'admin', // تحديد نوع المستخدم الإداري
                redirect_to: router.asPath // إرسال المسار الحالي للعودة إليه بعد الإكمال
            });

            // إذا كان الرد ناجح
            if (data.success) {
                setForgotPasswordSent(true);
                setCountdown(60);
                toast.success(data.message || 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');

                // بدء العداد الزمني
                const timer = setInterval(() => {
                    setCountdown((prev) => {
                        if (prev <= 1) {
                            clearInterval(timer);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else {
                // إذا كان هناك خطأ في الرد
                toast.error(data.message || 'حدث خطأ أثناء إرسال البريد، يرجى المحاولة مرة أخرى');
            }

        } catch (error) {
            console.error('Forgot password error:', error);

            if (error.response?.data?.errors?.email) {
                // إذا كان هناك خطأ في البريد الإلكتروني
                toast.error(error.response.data.errors.email[0]);
            } else if (error.response?.data?.message) {
                // إذا كان هناك رسالة خطأ عامة
                toast.error(error.response.data.message);
            } else if (error.response?.status === 422) {
                // خطأ في التحقق من البيانات
                toast.error('يرجى التحقق من البريد الإلكتروني المدخل');
            } else {
                toast.error('حدث خطأ أثناء إرسال البريد، يرجى المحاولة مرة أخرى');
            }
        }
    };

    // دالة للعودة إلى نموذج تسجيل الدخول
    const handleBackToLogin = () => {
        setShowForgotPassword(false);
        setForgotPasswordSent(false);
        setForgotEmail('');
        setCountdown(0);
    };
    useEffect(() => {
      if (isTwoFactorEnabled) {
        setOtp(''); // تعيين الحقل إلى فارغ عندما يتم تفعيل المصادقة الثنائية
      }
    }, [isTwoFactorEnabled]);  // هذا سيحدث كلما تم تغيير حالة المصاد
	// استرجاع بيانات localStorage عند تحميل الصفحة في المتصفح
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const savedEmail = localStorage.getItem('savedEmail') || '';
			const savedPassword = localStorage.getItem('savedPassword') || '';
			setUserField({ email: savedEmail, password: savedPassword });
			setRememberMe(!!savedEmail);
		}
	}, []);

	const changeUserFieldHandler = (e) => {
		const { name, value } = e.target;
		setUserField((prev) => {
			const updatedField = { ...prev, [name]: value };

			// تحديث البيانات المحفوظة في التخزين المحلي إذا تم اختيار "تذكرني"
			if (rememberMe && typeof window !== 'undefined') {
				if (name === 'email') {
					localStorage.setItem('savedEmail', value);
				} else if (name === 'password') {
					localStorage.setItem('savedPassword', value);
				}
			}

			return updatedField;
		});
	};

	const handleOtpChange = (e) => {
		setOtp(e.target.value);
	};

	const handleRememberMeChange = (e) => {
		setRememberMe(e.target.checked);

		if (typeof window !== 'undefined') {
			if (e.target.checked) {
				// حفظ بيانات تسجيل الدخول
				localStorage.setItem('savedEmail', userField.email);
				localStorage.setItem('savedPassword', userField.password);
			} else {
				// حذف بيانات تسجيل الدخول
				localStorage.removeItem('savedEmail');
				localStorage.removeItem('savedPassword');
			}
		}
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
            const { data } = await axios.post(`${apiBaseUrl}/login`, userField);

			if (data?.token) {

                  localStorage.setItem('token', data.token);
                  const saveToken = (token) => {
                    nookies.set(null, 'token', data.token, {
                      maxAge: 30 * 24 * 60 * 60, // مدة صلاحية التوكن (30 يومًا)
                      path: '/', // المسار الذي يمكن الوصول للكوكيز منه
                    });
                  };
                  localStorage.setItem('savedEmail', userField.email);
                  localStorage.setItem('savedPassword', userField.password);
                  await fetchCurrency(data.token);
                  // التوجيه إلى صفحة تجريبية بدلاً من الرئيسية
                  router.replace('/login-test-success');
				toast.success('تم تسجيل الدخول بنجاح! (وضع تجريبي)');
			} else if (data?.two_factor_enabled && data?.name) {
				setIsTwoFactorEnabled(true);
				setUserName(data.name);
				toast.info('المصادقة الثنائية مطلوبة. يرجى إدخال رمز التحقق.');
			} else {
				toast.error('يرجى التاكد من البيانات المدخلة');
			}
		} catch (error) {
			toast.error('يرجى التاكد من البيانات المدخلة');
		}
	};

	const onOtpSubmit = async (e) => {
		e.preventDefault();
		try {
			const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
			const { data } = await axios.post(`${apiBaseUrl}/verifyOtpLogin`, {
				otp,
				name: userName,
			});

			if (data?.success) {
				   localStorage.setItem('token', data.token);
                    const saveToken = (token) => {
                           nookies.set(null, 'token', data.token, {
                           maxAge: 30 * 24 * 60 * 60, // مدة صلاحية التوكن (30 يومًا)
                                    path: '/', // المسار الذي يمكن الوصول للكوكيز منه
                                  });
                                };
                  localStorage.setItem('savedEmail', userField.email);
                  localStorage.setItem('savedPassword', userField.password);
                  await fetchCurrency(data.token);
				// التوجيه إلى صفحة تجريبية بدلاً من الرئيسية
				router.push('/login-test-success');
				toast.success('تم تسجيل الدخول بنجاح! (وضع تجريبي)');
			} else {
			toast.error(data?.message || 'رمز التحقق غير صحيح.'); // إذا كان هناك رسالة خطأ مخصصة من الخادم
			}
		} catch (error) {
				if (error.response) {

			// إظهار رسالة توست عند حدوث خطأ
			toast.error('رمز التحقق غير صحيح');
		} else {
			// في حال كان الخطأ عام (مثلاً فشل في الاتصال بالشبكة)
			toast.error('حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى.');
		}
		}
	};

	return (
		<div className={clsx('form-wrapper-one product-style-one', className)}>
			<h4 className="mycenter">
				{showForgotPassword
					? (forgotPasswordSent ? 'تم إرسال الرابط بنجاح!' : 'نسيان كلمة المرور')
					: (isTwoFactorEnabled ? 'إدخال رمز التحقق' : 'تسجيل الدخول - تجريبي')
				}
			</h4>
			{showForgotPassword ? (
				// نموذج نسيان كلمة المرور
				forgotPasswordSent ? (
					// واجهة النجاح
					<div style={{ textAlign: 'center', padding: '20px' }}>
						<div style={{ fontSize: '48px', color: '#28a745', marginBottom: '20px' }}>
							✅
						</div>
						<p style={{ color: '#6c757d', marginBottom: '20px', lineHeight: '1.6' }}>
							لقد تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.
							يرجى التحقق من صندوق الوارد وصندوق الرسائل غير المرغوب فيها.
						</p>
						<div style={{
							background: '#f8f9fa',
							borderRadius: '10px',
							padding: '15px',
							marginBottom: '20px'
						}}>
							<div style={{ marginBottom: '10px', color: '#495057' }}>
								⏰ الرابط صالح لمدة 60 دقيقة
							</div>
							<div style={{ color: '#495057' }}>
								📧 تم الإرسال إلى: <strong>{forgotEmail}</strong>
							</div>
						</div>
						<div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
							<Button
								type="button"
								size="medium"
								disabled={countdown > 0}
								onClick={() => {
									if (countdown === 0) {
										setForgotPasswordSent(false);
									}
								}}
								style={{
									opacity: countdown > 0 ? 0.6 : 1,
									cursor: countdown > 0 ? 'not-allowed' : 'pointer'
								}}
							>
								{countdown > 0 ? `إعادة الإرسال خلال ${countdown}ث` : 'إرسال مرة أخرى'}
							</Button>
							<Button
								type="button"
								size="medium"
								onClick={handleBackToLogin}
								style={{
									background: 'linear-gradient(45deg, #59C4BC, #637AAE)',
									border: 'none'
								}}
							>
								العودة لتسجيل الدخول
							</Button>
						</div>
					</div>
				) : (
					// نموذج إدخال البريد الإلكتروني
					<form onSubmit={handleForgotPassword}>
						<p style={{ color: '#6c757d', marginBottom: '20px', textAlign: 'center' }}>
							أدخل بريدك الإلكتروني لإرسال رابط الاستعادة
						</p>
						<div className="mb-5">
							<label htmlFor="forgotEmail" className="form-label">
								البريد الإلكتروني
							</label>
							<input
								type="email"
								id="forgotEmail"
								name="forgotEmail"
								placeholder="أدخل بريدك الإلكتروني"
								required
								className="withRadius"
								value={forgotEmail}
								onChange={(e) => setForgotEmail(e.target.value)}
							/>
						</div>
						<div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
							<Button type="submit" size="medium">
								إرسال رابط الاستعادة
							</Button>
							<Button
								type="button"
								size="medium"
								onClick={handleBackToLogin}
								style={{
									background: '#6c757d',
									border: 'none'
								}}
							>
								العودة
							</Button>
						</div>
					</form>
				)
			) : isTwoFactorEnabled ? (
				<form onSubmit={onOtpSubmit} autoComplete="off">
					<div className="mb-5">
						<label htmlFor="otp" className="form-label">
							رمز التحقق
						</label>
						<input
							type="text"
							id="otp"
							name="otp"
							placeholder="أدخل رمز التحقق"
							required
                            value={otp} // تأكد من أن قيمة otp فارغة في البداية
							className="withRadius"
							onChange={handleOtpChange}
						/>
					</div>
					<Button type="submit" size="medium" className="mr--15">
						تحقق
					</Button>
				</form>
			) : (
				<form onSubmit={onSubmit}>
					<div className="mb-5">
						<label htmlFor="email" className="form-label">
							البريد الإلكتروني
						</label>
						<input
							type="email"
							id="email"
							name="email"
							placeholder="البريد الإلكتروني"
							required
							autoComplete="username"
							className="withRadius"
							value={userField.email}
							onChange={changeUserFieldHandler}
						/>
					</div>


                <div className="mb-5" style={{ position: 'relative' }}>
                    <label htmlFor="password" className="form-label">كلمة المرور</label>
                    <input
                        type={showPassword ? 'text' : 'password'} // ✅ التحكم في نوع الحقل
                        name="password"
                        placeholder="أدخل كلمة المرور"
                        required
                        className="withRadius"
                        value={userField.password}
                        onChange={changeUserFieldHandler}
                    />

                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        style={{
                            position: 'absolute',
                            right: '45%',
                            top: '70%',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer',
                            border: 'none',
                            background: 'none'
                        }}
                    >
                        {showPassword ? '👁️' : '🙈'}
                    </button>
                </div>


					<div className="mb-5">
						<label className="form-check-label">
							<input
								type="checkbox"
								className="form-check-input mycheckbox"
								checked={rememberMe}
								onChange={handleRememberMeChange}
							/>
							تذكرني
						</label>
					</div>

					<Button type="submit" size="medium" className="mr--15">
						تسجيل الدخول (تجريبي)
					</Button>

					<div className="mt-3" style={{ textAlign: 'center' }}>
						<button
							type="button"
							onClick={() => setShowForgotPassword(true)}
							style={{
								background: 'none',
								border: 'none',
								color: '#59C4BC',
								textDecoration: 'underline',
								cursor: 'pointer',
								fontSize: '14px'
							}}
						>
							هل نسيت كلمة المرور؟
						</button>
					</div>
				</form>
			)}
		</div>
	);
};

LoginFormTest.propTypes = {
	className: PropTypes.string,
};

export default LoginFormTest;

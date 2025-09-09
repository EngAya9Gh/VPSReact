import { useState, useEffect } from 'react';
import Button from '@ui/button';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router'; // استيراد useRouter

const OrderForm = ({ service }) => {

   const router = useRouter(); // استخدام useRouter
	const [user, setUser] = useState({});
	  const [isDisabled, setIsDisabled] = useState(false); // حالة لتتبع ما إذا كان الزر معطلاً

	const storedToken = localStorage.getItem('token');

	// طباعة قيمة service للتحقق من البيانات
	useEffect(() => {
		if (service) {
			console.log('Service Data:', service);
			console.log('Service ID:', service.id);
			console.log('Service Name:', service.name);
			console.log('Service Category:', service.category);
			console.log('Category Name:', service.category?.name);
		}
	}, [service]);
    const [currency, setCurrency] = useState('TL');

        useEffect(() => {
          if (typeof window !== 'undefined') {
            const savedCurrency = localStorage.getItem('currency') || 'TL';
            setCurrency(savedCurrency.toUpperCase());
          }
        }, []);


	useEffect(() => {

		const getUserDataAndUpdatePrice = async () => {
			try {
				const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
				// جلب بيانات المستخدم
				const response = await axios.get(
					`${apiBaseUrl}/logged-in-user`,
					{
						headers: {
							Authorization: `Bearer ${storedToken}`
						}
					}
				);
				setUser(response.data);
				setServiceField((prevFields) => ({
					...prevFields,
					user_id: response.data.id,
						}));
			} catch (error) {
				console.error('Error fetching user data', error);
			}
		};

		getUserDataAndUpdatePrice();
	}, []);
	const [serviceField, setServiceField] = useState({
		username: '',
		email: '',
		password: '',
		note: '',
		ime: '',
		count: 1,
		price: service ?service.price : '',
		user_id: user ? user.id : '',
		service_id: service ? service.id : ''
	});
	const initialState = {
		username: '',
		email: '',
		password: '',
		note: '',
		ime: '',
		count: 1,
		price: service ?service.price : '',
		user_id: user ? user.id : '',
		service_id: service ? service.id : ''
	};




	// حساب السعر تلقائياً عند تغيير `count`
	useEffect(() => {
		const updatedPrice = serviceField.count * service.price;
		setServiceField((prevFields) => ({
			...prevFields,
			price: updatedPrice
		}));
	}, [serviceField.count, service.price]);

	const onSubmit = async (e) => {
		e.preventDefault();
  if (isDisabled) return; // إذا كان الزر معطلاً، لا نسمح بالضغط مرة أخرى

    setIsDisabled(true); // تعطيل الزر بعد الضغط عليه للمرة الأولى

	const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

	// تحديد الـ API endpoint حسب اسم الصنف
	const categoryName = service.category?.name;
	let apiEndpoint;

	if (categoryName === 'IMEI' || categoryName === 'SERVER') {
		apiEndpoint = `${apiBaseUrl}/service/order/${service.id}`;
		console.log('Using service/order endpoint for category:', categoryName);
	} else {
		apiEndpoint = `${apiBaseUrl}/service/orderits/${service.id}`;
		console.log('Using service/orderits endpoint for category:', categoryName);
	}

		try {
			const result = await axios.post(
				apiEndpoint,
				serviceField,
				{
					headers: {
						Authorization: `Bearer ${storedToken}`
					}
				}
			);

			toast.success(result.data.message);
             setTimeout(() => { router.push('/'); }, 3000);
		} catch (error) {
			if (error.response) {
				console.error('Error Data:', error.response.data);
				console.error('Error Status:', error.response.status);
				console.error('Error Headers:', error.response.headers);
				toast.error("حدث خطأ أثناء معالجة الطلب. يرجى المحاولة مرة أخرى.");
			}
		} finally {
			setIsDisabled(false); // إعادة تفعيل الزر في حالة الخطأ
		}

};

	return (
		<div className="form-wrapper-one registration-area">
			{/* عرض معلومات الخدمة للتطوير */}
			{process.env.NODE_ENV === 'development' && service && (
				<div style={{
					background: '#f0f0f0',
					padding: '10px',
					margin: '10px 0',
					borderRadius: '5px',
					fontSize: '12px'
				}}>
					<strong>معلومات الخدمة (للتطوير):</strong><br/>
					ID: {service.id}<br/>
					Name: {service.name}<br/>
					Category: {service.category?.name || 'غير محدد'}<br/>
					Type: {service.type}<br/>
					Price: {service.price}
				</div>
			)}

			<form onSubmit={onSubmit}>
				<div className="tagcloud">
					<h3 className="mb--30">
						اتمام عملية الشراء
						<span className="mybutton-margin">
							السعر: {service.price}{currency}
						</span>
					</h3>
				</div>
				{service.type === 2 && (
                    <>

				<div className="mb-5">

					<input
						className="withRadius"
						type="email"
						id="email"
						name="email"
						required
						placeholder=" ايميل"
						value={serviceField.email}
						onChange={(e) =>
							setServiceField({
								...serviceField,
								email: e.target.value
							})
						}
					/>
				</div>
				</>)}
				{service.type === 4 && (
                    <>

				<div className="mb-5">
					<label htmlFor="count" className="form-label">
						العدد
					</label>
					<input
						className="withRadius myinput25"
						type="number"
						id="count"
						name="count"
						required
						placeholder="العدد"
						value={serviceField.count}
						onChange={(e) =>
							setServiceField({
								...serviceField,
								count: e.target.value
							})
						}
					/>
                  		<label htmlFor="count" className="form-label mybutton-margin">
						السعر النهائي
					</label>
					<input
						className="withRadius myinput25 "
						type="number"
						id="price"
						name="price"
						required
						placeholder="الاجمالي"
						readOnly
						value={serviceField.price}
					/>
				</div>

				<div className="mb-5">

					<input
						className="withRadius"
						type="email"
						id="email"
						name="email"
						required
						placeholder="ايميل"
						value={serviceField.email}
						onChange={(e) =>
							setServiceField({
								...serviceField,
								email: e.target.value
							})
						}
					/>
				</div>

				<div className="mb-5">

					<input
						className="withRadius"
						type="text"
						id="note"
						name="note"
						required
						placeholder="معلومات اضافية"
						value={serviceField.note}
						onChange={(e) =>
							setServiceField({
								...serviceField,
								note: e.target.value
							})
						}
					/>
				</div>
				</>
				)}
				{service.type === 1 && (
				<div className="mb-5">

					<input
						className="withRadius"
						type="text"
						id="ime"
						name="ime"
						required
						placeholder="IME || SN || MOBILE  "
						value={serviceField.ime}
						onChange={(e) =>
							setServiceField({
								...serviceField,
								ime: e.target.value
							})
						}
					/>
				</div>)}
				{service.type === 3 && (
                    <>

          <div className="mb-5">
					<label htmlFor="username" className="form-label">
					اسم المستخدم
						</label>
					<input
						className="withRadius"
						type="text"
						id="username"
						name="username"
						required
						placeholder=""
						value={serviceField.username}
						onChange={(e) =>
							setServiceField({
								...serviceField,
								username: e.target.value
							})
						}
					/>
				</div>

				<div className="mb-5">
					<label htmlFor="note" className="form-label">
					معلومات اضافية
						</label>
					<input
						className="withRadius"
						type="text"
						id="note"
						name="note"
						required
						placeholder=""
						value={serviceField.note}
						onChange={(e) =>
							setServiceField({
								...serviceField,
								note: e.target.value
							})
						}
					/>
				</div>
				</>
				)}


				{(service.type === 2 || service.type === 5) && (
                    <>
				<div className="mb-5">

					<input
						className="withRadius"
						type="text"
						id="username"
						name="username"
						required
						placeholder="اسم المستخدم"
						value={serviceField.username}
						onChange={(e) =>
							setServiceField({
								...serviceField,
								username: e.target.value
							})
						}
					/>
				</div>

				<div className="mb-5">

					<input
						className="withRadius"
						type="text"
						id="password"
						name="password"
						required
						placeholder=" كلمة المرور "
						value={serviceField.password}
						onChange={(e) =>
							setServiceField({
								...serviceField,
								password: e.target.value
							})
						}
					/>
				</div>
				<div className="mb-5">

					<input
						className="withRadius"
						type="text"
						id="note"
						name="note"
						required
						placeholder="معلومات اضافية"
						value={serviceField.note}
						onChange={(e) =>
							setServiceField({
								...serviceField,
								note: e.target.value
							})
						}
					/>
				</div>
				</>
                )}
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
			<ToastContainer />
		</div>
	);
};

OrderForm.propTypes = {
	service: PropTypes.shape({
		price: PropTypes.number.isRequired,
		id: PropTypes.string.isRequired
	}).isRequired,
	user: PropTypes.shape({
		id: PropTypes.string.isRequired
	}).isRequired
};

export default OrderForm;

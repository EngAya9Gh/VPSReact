import { useState, useEffect } from 'react';
import Button from '@ui/button';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router'; // استيراد useRouter

const OrderForm = ({ service }) => {

   const router = useRouter(); // استخدام useRouter
	const [user, setUser] = useState({});

	const storedToken = localStorage.getItem('token');
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
	    kimlik: '',
		line_photo: '',
		mobile: '',
        last_mobile:'',
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
		console.log(serviceField);
     if(serviceField.price<=user.balance)
		{const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
		try {
			const result = await axios.post(
				`${apiBaseUrl}/service/orderits/${service.id}`,
				serviceField,
				{
					headers: {
						Authorization: `Bearer ${storedToken}`,
                       'Content-Type': 'multipart/form-data'
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
		}
	}
};

	return (
		<div className="form-wrapper-one registration-area">
			<form onSubmit={onSubmit}>
				<div className="tagcloud">
					<h3 className="mb--30">
						اتمام عملية الشراء
						<span className="mybutton-margin">
							السعر: {service.price}{currency}
						</span>
					</h3>
				</div>
				{service.type === 6 && (
                    <>

				<div className="mb-5">
              <p>يرجى ارسال :صورة الهوية وصورة الخط عبر الواتس بعد ارسال الطلب مباشرة ويرجى تزويدنا برقم الجوال الذي سيتم ارسال الصور من خلاله </p>
				</div>
              		<div className="mb-5">
	<input
						className="withRadius"
						type="text"
						id="mobile"
						name="mobile"
						required
						placeholder=" رقم الهاتف الذي سيتم ارسال الصور من خلاله عبر الواتس اب "
						value={serviceField.mobile}
						onChange={(e) =>
							setServiceField({
								...serviceField,
								mobile: e.target.value
							})
						}
					/>

				</div>
				</>)}
				{service.type ===8 && (
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
						className="withRadius myinput25"
						type="number"
						id="price"
						name="price"
						required
						placeholder="الاجمالي"
						readOnly
						value={serviceField.price}
					/>
				</div>


				</>
				)}
				{service.type === 7 && (
              <>


				<div className="mb-5">
              <p>يرجى ارسال :صورة الهوية وصورة الخط عبر الواتس بعد ارسال الطلب مباشرة ويرجى تزويدنا برقم الجوال الذي سيتم ارسال الصور من خلاله  بالاضافة الى تحديد رقم الهاتف للرقم الضائع </p>
				</div>
              		<div className="mb-5">
	                   <input
						className="withRadius"
						type="text"
						id="mobile"
						name="mobile"
						required
						placeholder=" رقم الهاتف الذي سيتم ارسال الصور من خلاله عبر الواتس اب "
						value={serviceField.mobile}
						onChange={(e) =>
							setServiceField({
								...serviceField,
								mobile: e.target.value
							})
						}
					/>

				</div>

				<div className="mb-5">

					<input
						className="withRadius"
						type="text"
						id="last_mobile"
						name="last_mobile"
						required
						placeholder=" رقم الهاتف الضائع "
						value={serviceField.last_mobile}
						onChange={(e) =>
							setServiceField({
								...serviceField,
								last_mobile: e.target.value
							})
						}
					/>
				</div>
       </>)}
          <div className="mb-5">

					<input
						className="withRadius"
						type="text"
						id="note"
						name="note"
						placeholder="  ملاحظة  "
						value={serviceField.note}
						onChange={(e) =>
							setServiceField({
								...serviceField,
								note :e.target.value
							})
						}
					/>
				</div>
<div className="icon-box1"><a href="https://api.whatsapp.com/send/?phone=905392065497&amp;text&amp;type=phone_number&amp;app_absent=0" target="_blank" rel="noopener noreferrer"><svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="#25D366"><path d="M12.004 2.004c-5.523 0-10 4.477-10 10 0 1.793.479 3.492 1.386 4.996l-1.48 5.481 5.634-1.471c1.452.826 3.104 1.292 4.88 1.292 5.523 0 10-4.477 10-10 0-5.522-4.477-10-10-10zm.041 18c-1.583 0-3.129-.407-4.496-1.172l-.321-.185-3.343.873.891-3.301-.209-.338c-.84-1.367-1.287-2.937-1.287-4.545 0-4.411 3.589-8 8-8 4.411 0 8 3.589 8 8 0 4.411-3.589 8-8 8zm4.45-5.714c-.247-.124-1.469-.726-1.698-.808-.229-.082-.396-.124-.564.123s-.647.808-.793.975c-.146.165-.29.185-.537.061-.247-.124-1.041-.383-1.981-1.22-.732-.652-1.227-1.457-1.37-1.705-.145-.248-.015-.383.109-.506.111-.11.247-.29.371-.435.124-.145.165-.248.248-.413.082-.165.041-.31-.021-.435-.061-.124-.564-1.353-.772-1.854-.204-.493-.411-.428-.564-.428-.146-.015-.311-.015-.478-.015-.166 0-.435.062-.663.31-.227.248-.863.841-.863 2.048s.884 2.372 1.008 2.537c.124.165 1.736 2.63 4.211 3.689.589.254 1.049.405 1.406.518.591.187 1.128.16 1.553.096.474-.071 1.468-.601 1.676-1.18.207-.579.207-1.075.145-1.18-.061-.103-.227-.165-.474-.289z"></path></svg></a></div>

				<Button type="submit" size="medium" className="mr--15">
					شراء
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

import { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@ui/button';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

const OrderForm = ({ className, program }) => {

	
	const [user, setUser] = useState({});
	
		// الحصول على التوكن من localStorage وتحديث السعر
		const storedToken = localStorage.getItem('token');
	useEffect(() => {

		const getUserDataAndUpdatePrice = async () => {
		
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
			
				
		}
		getUserDataAndUpdatePrice();
	}, []);
	const initialState = {
		price: program ? program.price : '',
		user_id: user ? user.id : '',
		program_id: program ? program.id : '',
		count: '0'
	};

	const [programField, setProgramField] = useState(initialState);
  const [isDisabled, setIsDisabled] = useState(false); // حالة لتتبع ما إذا كان الزر معطلاً


	const onSubmit = async (e) => {
		e.preventDefault();
        if (isDisabled) return; // إذا كان الزر معطلاً، لا نسمح بالضغط مرة أخرى

        setIsDisabled(true); // تعطيل الزر بعد الضغط عليه للمرة الأولى

		try {
			setProgramField((prev) => ({
				...prev,
				user_id: user ? user.id : '',
				
			}));
			console.log(programField);
			const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
		
			const result=	await axios.post(
				`${apiBaseUrl}/program/order/${program.id}`,
				programField,{
					headers: {
						Authorization: `Bearer ${storedToken}`
					}
				}
			
			);
		
			toast.success(result.data.message);
			setProgramField(initialState);
		} catch (error) {
			if (error.response) {
				// Display user-friendly error message
				toast.error(
					'حدث خطأ أثناء تسجيل طلبك. الرجاء المحاولة مرة أخرى.'
				);
			}
		}
	};

	return (
		<div className={`form-wrapper-one registration-area ${className}`}>
			<form onSubmit={onSubmit}>
				<div className="tagcloud">
					<h3 className="mb--30">
						اتمام عملية الشراء
						<span className="mybutton-margin">
							السعر: {program.price}
						</span>
					</h3>
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
			{program.note && (
				<div>
					<p>{program.note}</p>
				</div>
			)}
			<ToastContainer />
		</div>
	);
};

// Prop types validation
OrderForm.propTypes = {
	className: PropTypes.string,
	program: PropTypes.shape({
		id: PropTypes.string.isRequired,
		price: PropTypes.string.isRequired,
		note: PropTypes.string
	}).isRequired,
	user: PropTypes.shape({
		id: PropTypes.string
	})
};

export default OrderForm;

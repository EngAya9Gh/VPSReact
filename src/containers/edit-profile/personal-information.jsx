import Button from '@ui/button';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const PersonalInformation = ({ authUser, token }) => {
	const [user, setUser] = useState(authUser);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setUser({ ...user, [name]: value });
	};

	const updateUser = async (userId, updatedData) => {
		try {
			const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
			await axios.patch(`${apiBaseUrl}/users/${userId}`, updatedData, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});
			toast('تم التحديث بنجاح');
		} catch (error) {
			toast('فشل التحديث هناك معلومات خاطئة');
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		updateUser(user.id, user);
	};

	return (
		<div className="nuron-information">
			<form>
				<div className="mb-5">
					<label htmlFor="first_name" className="form-label">
						الاسم الأول
					</label>
					<input
						type="text"
						id="first_name"
						name="first_name"
						value={user.first_name}
						onChange={handleChange}
					/>
				</div>
				<div className="mb-5">
					<label htmlFor="last_name" className="form-label">
						الكنية
					</label>
					<input
						type="text"
						name="last_name"
						id="last_name"
						value={user.last_name}
						onChange={handleChange}
					/>
				</div>
				<div className="mb-5">
					<label htmlFor="name" className="form-label">
						اسم المستخدم
					</label>
					<input
						type="text"
						name="name"
						id="name"
						required
						value={user.name}
						onChange={handleChange}
					/>
				</div>
				<div className="mb-5">
					<label htmlFor="mobile" className="form-label">
						رقم الهاتف
					</label>
					<input
						type="text"
						name="mobile"
						id="mobile"
						required
						value={user.mobile}
						onChange={handleChange}
					/>
				</div>
				<div className="mb-5">
					<label htmlFor="email" className="form-label">
						البريد الالكتروني
					</label>
					<input
						type="email"
						id="email"
						name="email"
						required
						value={user.email}
						onChange={handleChange}
					/>
				</div>
				<div className="mb-5">
					<label htmlFor="nationality" className="form-label">
						الجنسية
					</label>
					<input
						type="text"
						id="nationality"
						name="nationality"
						required
						value={user.nationality}
						onChange={handleChange}
					/>
				</div>
		

				<Button
					type="submit"
					size="medium"
					onClick={handleSubmit}
					className="mr--15"
				>
					حفظ
				</Button>
			</form>
		</div>
	);
};

PersonalInformation.propTypes = {
	authUser: PropTypes.shape({
		id: PropTypes.string.isRequired,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		name: PropTypes.string,
		mobile: PropTypes.string,
		email: PropTypes.string,
		nationality: PropTypes.string,
		password: PropTypes.string,
		password_confirmation: PropTypes.string
	}).isRequired,
	token: PropTypes.string.isRequired
};

export default PersonalInformation;

import { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Button from '@ui/button';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import axios from 'axios';

const SignupForm = ({ agent_info, className }) => {
	
	 
	const [userField, setUserField] = useState({
		name: '',
		first_name: '',
		last_name: '',
		mobile: '',
		code: '',
		agent_id: '',
		role: '',
		nationality: '',
		email: '',
		password: '',
		password_confirmation: ''
	});

	const router = useRouter();
	const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

	const changeUserFieldHandler = (e) => {
		const { name, value } = e.target;
		setUserField((prev) => ({
			...prev,
			[name]: value
		}));
	};
	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			const agentInfoTrimmed = agent_info.replace(/\s+/g, '');
			const response = await axios.post(
				`${apiBaseUrl}/register/${agentInfoTrimmed}`,
				userField
			);
            if (response.data.error) {
				router.push('/');
			}
			if (response.data) {
				localStorage.setItem('token', response.data?.token);
				router.push('/');
			}
			toast(response.data.message || 'تم التسجيل بنجاح');
		} catch  (error) {
			console.log('Full error:', error); // عرض كل محتوى الخطأ
			if (error.response) {
					console.log('Error response data:', error.response.data);
					console.log('Error response status:', error.response.status);
			}   // التحقق إذا كان الخطأ من نوع 422 (خطأ تحقق) ويحتوي على بيانات أخطاء
        if (error.response && error.response.status === 422) {
            // التعامل مع الأخطاء المختلفة من الرسالة القادمة من السيرفر
            const errors = error.response.data.errors;

            // عرض كل خطأ في رسالة منفصلة
            Object.keys(errors).forEach((key) => {
                toast.error(errors[key][0]); // عرض رسالة الخطأ الخاصة بكل حقل
            });
        } else {
            // عرض رسالة خطأ عامة في حال حدوث خطأ آخر
            toast.error("حدث خطأ أثناء معالجة الطلب. يرجى المحاولة مرة أخرى.");
        }
    }
	};

	return (
		<div className={clsx('form-wrapper-one', className)}>
			<h4>إنشاء حساب جديد</h4>
			<form>
				<div className="mb-5">
					<label htmlFor="first_name" className="form-label">
						الاسم الأول
					</label>
					<input
						type="text"
							className='withRadius'
						id="first_name"
						name="first_name"
						onChange={changeUserFieldHandler}
					/>
				</div>

				<div className="mb-5">
					<label htmlFor="last_name" className="form-label">
						الكنية
					</label>
					<input
					className='withRadius'
						type="text"
						id="last_name"
						name="last_name"
						onChange={changeUserFieldHandler}
					/>
				</div>

				<div className="mb-5">
					<label htmlFor="name" className="form-label">
						اسم المستخدم
					</label>
					<input
						type="text"
						id="name"
						className='withRadius'
						name="name"
						required
						onChange={changeUserFieldHandler}
					/>
				</div>

				<div className="mb-5  m-label">
					<label htmlFor="mobile" className="form-label">
						رقم الهاتف
					</label>
					<input
						type="text"
						id="mobile"
						name="mobile"
						required
						className="myinput70 withRadius"
						onChange={changeUserFieldHandler}
					/>
					<select
						required
						className="myinput25 withRadius"
						name="code"
						onChange={changeUserFieldHandler}
					>
						<option value="+90">اختر البلد</option><option value="+90">اختر البلد</option>
                      <option value="+90">(+90) تركيا</option>
							<option value="+93">(+93) أفغانستان</option>
							<option value="+355">(+355) ألبانيا</option>
							<option value="+213">(+213) الجزائر</option>
							<option value="+376">(+376) أندورا</option>
							<option value="+244">(+244) أنغولا</option>
							<option value="+1264">(+1264) أنغويلا</option>
							<option value="+54">(+54) الأرجنتين</option>
							<option value="+374">(+374) أرمينيا</option>
							<option value="+297">(+297) أروبا</option>
							<option value="+61">(+61) أستراليا</option>
							<option value="+43">(+43) النمسا</option>
							<option value="+994">(+994) أذربيجان</option>
							<option value="+1242">(+1242) جزر البهاما</option>
							<option value="+973">(+973) البحرين</option>
							<option value="+880">(+880) بنغلاديش</option>
							<option value="+1246">(+1246) بربادوس</option>
							<option value="+375">(+375) بيلاروسيا</option>
							<option value="+32">(+32) بلجيكا</option>
							<option value="+501">(+501) بليز</option>
							<option value="+229">(+229) بنين</option>
							<option value="+1441">(+1441) برمودا</option>
							<option value="+975">(+975) بوتان</option>
							<option value="+591">(+591) بوليفيا</option>
							<option value="+387">(+387) البوسنة والهرسك</option>
							<option value="+267">(+267) بوتسوانا</option>
							<option value="+55">(+55) البرازيل</option>
							<option value="+246">
								(+246) الإقليم البريطاني في المحيط الهندي
							</option>
							<option value="+673">(+673) بروناي</option>
							<option value="+359">(+359) بلغاريا</option>
							<option value="+226">(+226) بوركينا فاسو</option>
							<option value="+257">(+257) بوروندي</option>
							<option value="+855">(+855) كمبوديا</option>
							<option value="+237">(+237) الكاميرون</option>
							<option value="+1">(+1) كندا</option>
							<option value="+238">(+238) الرأس الأخضر</option>
							<option value="+1345">(+1345) جزر كايمان</option>
							<option value="+235">(+235) تشاد</option>
							<option value="+56">(+56) تشيلي</option>
							<option value="+86">(+86) الصين</option>
							<option value="+61">(+61) جزيرة الكريسماس</option>
							<option value="+57">(+57) كولومبيا</option>
							<option value="+269">(+269) جزر القمر</option>
							<option value="+242">(+242) الكونغو</option>
							<option value="+242">
								(+242) جمهورية الكونغو الديمقراطية
							</option>
							<option value="+682">(+682) جزر كوك</option>
							<option value="+506">(+506) كوستاريكا</option>
							<option value="+225">(+225) كوت ديفوار</option>
							<option value="+385">(+385) كرواتيا</option>
							<option value="+53">(+53) كوبا</option>
							<option value="+357">(+357) قبرص</option>
							<option value="+420">(+420) جمهورية التشيك</option>
							<option value="+45">(+45) الدنمارك</option>
							<option value="+253">(+253) جيبوتي</option>
							<option value="+1767">(+1767) دومينيكا</option>
							<option value="+593">(+593) الإكوادور</option>
							<option value="+20">(+20) مصر</option>
							<option value="+503">(+503) السلفادور</option>
							<option value="+291">(+291) إريتريا</option>
							<option value="+372">(+372) إستونيا</option>
							<option value="+251">(+251) إثيوبيا</option>
							<option value="+298">(+298) جزر فارو</option>
							<option value="+679">(+679) فيجي</option>
							<option value="+358">(+358) فنلندا</option>
							<option value="+33">(+33) فرنسا</option>
							<option value="+594">(+594) غويانا الفرنسية</option>
							<option value="+241">(+241) الغابون</option>
							<option value="+220">(+220) غامبيا</option>
							<option value="+995">(+995) جورجيا</option>
							<option value="+49">(+49) ألمانيا</option>
							<option value="+233">(+233) غانا</option>
							<option value="+350">(+350) جبل طارق</option>
							<option value="+30">(+30) اليونان</option>
							<option value="+299">(+299) غرينلاند</option>
							<option value="+1473">(+1473) غرينادا</option>
							<option value="+590">(+590) غوادلوب</option>
							<option value="+1671">(+1671) غوام</option>
							<option value="+502">(+502) غواتيمالا</option>
							<option value="+224">(+224) غينيا</option>
							<option value="+245">(+245) غينيا بيساو</option>
							<option value="+592">(+592) غيانا</option>
							<option value="+509">(+509) هايتي</option>
							<option value="+39">(+39) الفاتيكان</option>
							<option value="+504">(+504) هندوراس</option>
							<option value="+852">(+852) هونغ كونغ</option>
							<option value="+36">(+36) المجر</option>
							<option value="+354">(+354) آيسلندا</option>
							<option value="+91">(+91) الهند</option>
							<option value="+62">(+62) إندونيسيا</option>
							<option value="+98">(+98) إيران</option>
							<option value="+964">(+964) العراق</option>
							<option value="+353">(+353) إيرلندا</option>
							<option value="+972">(+972) إسرائيل</option>
							<option value="+39">(+39) إيطاليا</option>
							<option value="+1876">(+1876) جامايكا</option>
							<option value="+81">(+81) اليابان</option>
							<option value="+962">(+962) الأردن</option>
							<option value="+7">(+7) كازاخستان</option>
							<option value="+254">(+254) كينيا</option>
							<option value="+686">(+686) كيريباتي</option>
							<option value="+850">(+850) كوريا الشمالية</option>
							<option value="+82">(+82) كوريا الجنوبية</option>
							<option value="+965">(+965) الكويت</option>
							<option value="+996">(+996) قيرغيزستان</option>
							<option value="+856">(+856) لاوس</option>
							<option value="+371">(+371) لاتفيا</option>
							<option value="+961">(+961) لبنان</option>
							<option value="+266">(+266) ليسوتو</option>
							<option value="+231">(+231) ليبيريا</option>
							<option value="+218">(+218) ليبيا</option>
							<option value="+423">(+423) ليختنشتاين</option>
							<option value="+370">(+370) ليتوانيا</option>
							<option value="+352">(+352) لوكسمبورغ</option>
							<option value="+853">(+853) ماكاو</option>
							<option value="+389">(+389) مقدونيا</option>
							<option value="+261">(+261) مدغشقر</option>
							<option value="+265">(+265) مالاوي</option>
							<option value="+60">(+60) ماليزيا</option>
							<option value="+960">(+960) المالديف</option>
							<option value="+223">(+223) مالي</option>
							<option value="+356">(+356) مالطا</option>
							<option value="+692">(+692) جزر مارشال</option>
							<option value="+596">(+596) مارتينيك</option>
							<option value="+222">(+222) موريتانيا</option>
							<option value="+230">(+230) موريشيوس</option>
							<option value="+269">(+269) مايوت</option>
							<option value="+52">(+52) المكسيك</option>
	
					</select>
				</div>

				<div className="mb-5">
					<label htmlFor="email" className="form-label">
						البريد الالكتروني
					</label>
					<input
						type="email"
						id="email"
						name="email"
							className='withRadius'
						required
						onChange={changeUserFieldHandler}
					/>
				</div>

				<div className="mb-5">
					<label htmlFor="nationality" className="form-label">
						الجنسية
					</label>
					<select
						id="nationality"
						name="nationality"
							className='withRadius'
						required
						onChange={changeUserFieldHandler}
					>
						<option value="">اختر البلد</option>
                      <option value="تركيا">تركيا</option>
						<option value="أفغانستان">أفغانستان</option>
						<option value="ألبانيا">ألبانيا</option>
						<option value="الجزائر">الجزائر</option>
						<option value="أندورا">أندورا</option>
						<option value="أنغولا">أنغولا</option>
						<option value="أنغويلا">أنغويلا</option>
						<option value="أنتاركتيكا">أنتاركتيكا</option>
						<option value="الأرجنتين">الأرجنتين</option>
						<option value="أرمينيا">أرمينيا</option>
						<option value="أروبا">أروبا</option>
						<option value="أستراليا">أستراليا</option>
						<option value="النمسا">النمسا</option>
						<option value="أذربيجان">أذربيجان</option>
						<option value="جزر البهاما">جزر البهاما</option>
						<option value="البحرين">البحرين</option>
						<option value="بنغلاديش">بنغلاديش</option>
						<option value="بربادوس">بربادوس</option>
						<option value="بيلاروسيا">بيلاروسيا</option>
						<option value="بلجيكا">بلجيكا</option>
						<option value="بليز">بليز</option>
						<option value="بنين">بنين</option>
						<option value="برمودا">برمودا</option>
						<option value="بوتان">بوتان</option>
						<option value="بوليفيا">بوليفيا</option>
						<option value="البوسنة والهرسك">البوسنة والهرسك</option>
						<option value="بوتسوانا">بوتسوانا</option>
						<option value="البرازيل">البرازيل</option>
						<option value="بروناي">بروناي</option>
						<option value="بلغاريا">بلغاريا</option>
						<option value="بوركينا فاسو">بوركينا فاسو</option>
						<option value="بوروندي">بوروندي</option>
						<option value="كمبوديا">كمبوديا</option>
						<option value="الكاميرون">الكاميرون</option>
						<option value="كندا">كندا</option>
						<option value="الرأس الأخضر">الرأس الأخضر</option>
						<option value="تشاد">تشاد</option>
						<option value="تشيلي">تشيلي</option>
						<option value="الصين">الصين</option>
						<option value="كولومبيا">كولومبيا</option>
						<option value="جزر القمر">جزر القمر</option>
						<option value="الكونغو">الكونغو</option>
						<option value="كوستاريكا">كوستاريكا</option>
						<option value="كوبا">كوبا</option>
						<option value="قبرص">قبرص</option>
						<option value="الدنمارك">الدنمارك</option>
						<option value="جيبوتي">جيبوتي</option>
						<option value="دومينيكا">دومينيكا</option>
						<option value="جمهورية الدومينيكان">
							جمهورية الدومينيكان
						</option>
						<option value="الإكوادور">الإكوادور</option>
						<option value="مصر">مصر</option>
						<option value="السلفادور">السلفادور</option>
						<option value="إستونيا">إستونيا</option>
						<option value="إثيوبيا">إثيوبيا</option>
						<option value="فنلندا">فنلندا</option>
						<option value="فرنسا">فرنسا</option>
						<option value="ألمانيا">ألمانيا</option>
						<option value="غانا">غانا</option>
						<option value="اليونان">اليونان</option>
						<option value="غواتيمالا">غواتيمالا</option>
						<option value="هايتي">هايتي</option>
						<option value="هندوراس">هندوراس</option>
						<option value="هنغاريا">هنغاريا</option>
						<option value="آيسلندا">آيسلندا</option>
						<option value="الهند">الهند</option>
						<option value="إندونيسيا">إندونيسيا</option>
						<option value="إيران">إيران</option>
						<option value="العراق">العراق</option>
						<option value="إيرلندا">إيرلندا</option>
						<option value="سوريا">سوريا</option>
						<option value="إيطاليا">إيطاليا</option>
						<option value="جامايكا">جامايكا</option>
						<option value="اليابان">اليابان</option>
						<option value="الأردن">الأردن</option>
						<option value="كينيا">كينيا</option>
						<option value="الكويت">الكويت</option>
						<option value="لبنان">لبنان</option>
						<option value="ليبيا">ليبيا</option>
						<option value="لوكسمبورغ">لوكسمبورغ</option>
						<option value="ماليزيا">ماليزيا</option>
						<option value="المكسيك">المكسيك</option>
						<option value="المغرب">المغرب</option>
						<option value="هولندا">هولندا</option>
						<option value="نيوزيلندا">نيوزيلندا</option>
						<option value="نيجيريا">نيجيريا</option>
						<option value="النرويج">النرويج</option>
						<option value="عمان">عمان</option>
						<option value="باكستان">باكستان</option>
						<option value="فلسطين">فلسطين</option>
						<option value="بنما">بنما</option>
						<option value="بيرو">بيرو</option>
						<option value="الفلبين">الفلبين</option>
						<option value="بولندا">بولندا</option>
						<option value="البرتغال">البرتغال</option>
						<option value="قطر">قطر</option>
						<option value="روسيا">روسيا</option>
						<option value="السعودية">السعودية</option>
						<option value="سنغافورة">سنغافورة</option>
						<option value="جنوب أفريقيا">جنوب أفريقيا</option>
						<option value="إسبانيا">إسبانيا</option>
					</select>
				</div>

				<div className="mb-5">
					<label htmlFor="password" className="form-label">
						كلمة المرور
					</label>
					<input
						type="password"
						id="password"
						className='withRadius'
						name="password"
						required
						onChange={changeUserFieldHandler}
					/>
				</div>

				<div className="mb-5">
					<label
						htmlFor="password_confirmation"
						className="form-label"
					>
						تأكيد كلمة المرور
					</label>
					<input
						type="password"
						id="password_confirmation"
						name="password_confirmation"
						required
						className='withRadius'
						onChange={changeUserFieldHandler}
					/>
				</div>

				<Button
					type="submit"
					size="medium"
					onClick={onSubmit}
					className="mr--15"
				>
					حفظ
				</Button>
				<Button path="/login" color="primary-alta" size="medium">
					تسجيل دخول
				</Button>
			</form>
		</div>
	);
};

SignupForm.propTypes = {
	className: PropTypes.string,
	agent_info: PropTypes.object.isRequired
};

export default SignupForm;

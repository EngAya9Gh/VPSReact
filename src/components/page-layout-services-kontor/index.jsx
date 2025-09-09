import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';  // إضافة axios (إذا لم يكن موجودًا بالفعل)
import clsx from 'clsx';  
import SEO from '@components/seo';
import Wrapper from '@layout/wrapper';
import Header from '@layout/header/header-02';
import Footer from '@layout/footer/footer-02';
import TopBarArea from '@containers/top-bar';
import ExploreServiceArea from '@containers/explore-service/all-services-kontor';
import { normalizedData } from '@utils/methods';
import { useMobile } from '../../context/MobileContext';
import homepageData from '../../data/homepages/home-08.json';

const PageLayoutSection = ({
	pageTitle,
	items,
	sectionId,
	resourceType, 
	hasSection
}) => {
	const content = normalizedData(homepageData?.content || []);
	const { mobile, setMobile } = useMobile(); // الحصول على mobile و setMobile من الـ Context
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(false);
	const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [errorMessage, setErrorMessage] = useState('');  // حالة لتخزين رسالة الخطأ القادمة من Laravel

	// Fetch user data when the page loads
	useEffect(() => {
		const fetchauth = async () => {
			try {
				const token = localStorage.getItem('token');
				const result = await axios.get(`${apiBaseUrl}/logged-in-user`, {
					headers: {
						Authorization: `Bearer ${token}` // Pass token in Authorization header
					}
				});
			setOrders(items); // Set fetched orders


			} catch (error) {
				console.error('Error fetching auth data', error);
			}
		};

		fetchauth();
	}, [apiBaseUrl]);

	const changeDataFieldHandler = (e) => {
		const { value } = e.target;
		setMobile(value); // تحديث قيمة الموبايل عند إدخال المستخدم
	};
const handleSearch = async () => {
    if (!mobile) return; // إذا كانت قيمة الموبايل فارغة، لا يتم تنفيذ البحث

    setLoading(true);  // يبدأ التحميل عند الضغط على الزر

    try {
        const token = localStorage.getItem('token'); // الحصول على التوكن من LocalStorage
        const result = await axios.get(`${apiBaseUrl}/getpackegesmobile`, {
            headers: {
                Authorization: `Bearer ${token}`, // إرسال التوكن في الهيدر
            },
            params: {
                mobile,  // إرسال قيمة الموبايل التي تم إدخالها
                sectionId, // إرسال قيمة sectionId
            }
        });
 
        setOrders(result.data.packeges); // تحديث قائمة الأوامر بناءً على البيانات المستلمة من الـ API
    } catch (error) {
            console.error('Error fetching data', error); // في حالة حدوث خطأ، يتم طباعته في الكونسول

            // إذا كانت هناك استجابة من الخادم (مثل 500 أو 404)
            if (error.response) {
                // عرض رسالة الخطأ القادمة من Laravel
                setErrorMessage(error.response.data.error || 'حدث خطأ أثناء الاتصال بالخادم. الرجاء المحاولة لاحقًا.');
            } else if (error.request) {
                // إذا لم تكن هناك استجابة من الخادم
                setErrorMessage('لم يتمكن الخادم من الرد. تأكد من اتصال الإنترنت أو حاول لاحقًا.');
            } else {
                // إذا كانت المشكلة في إعداد الطلب
                setErrorMessage('حدث خطأ غير متوقع. الرجاء المحاولة لاحقًا.');
            }    }

    setLoading(false);  // إيقاف حالة التحميل بعد الانتهاء من البحث
};

	return (
		<Wrapper>
			<SEO pageTitle={pageTitle} />
			<Header />
			<div className="list-item-1">
				<TopBarArea />
			</div>
			<main
				id="main-content"
				className="rn-nft-mid-wrapper nft-left-sidebar-nav pr--40 pr_sm--15 pt-5"
			>
              
              
		<div className='rn-upcoming-area rn-section-gapTop rn-section-gapTop-kontor'>
			<div className='container container-packege'>
				<div className={clsx('form-wrapper-one product-style-one')}>
					<div className="mb-5">
						<input
							type="text"
							placeholder="أدخل رقم الهاتف"
							name="mobile"
							value={mobile}
							className="withRadius"
							onChange={changeDataFieldHandler} // Handle mobile input change
						/>
					</div>

					<div className="mb-5">
						<button 
							onClick={handleSearch} 
							type="button" 
							className="withRadius" 
							disabled={loading}
						>
							{loading ? 'جاري البحث...' : 'بحث'}
						</button>
                        {errorMessage && (
                <div style={{ color: 'red', marginTop: '10px' }}>
                    {errorMessage} {/* عرض رسالة الخطأ القادمة من Laravel هنا */}
                </div>
            )}

					</div>
				</div>
			</div>
		</div>
              
				{!items || items.length === 0 ? (
					<h2 className="text-center">لا توجد بيانات متاحة</h2>
				) : (
					<ExploreServiceArea
						sectionTitle={pageTitle}
						id="list-item-3"
						space={2}
						hasSection={hasSection}
						data={{
							...content['explore-product-section'],
							parentSlug: resourceType,
							sectionId,
                             mobile,
							products: orders
						}}
					/>
				)}
			</main>
			<Footer className="pr--40" />
		</Wrapper>
	);
};

// Updated PropTypes validation
PageLayoutSection.propTypes = {
	pageTitle: PropTypes.string.isRequired,
	items: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			name: PropTypes.string
			// Add other properties as needed for better validation
		})
	).isRequired,
	sectionId: PropTypes.string.isRequired,
	resourceType: PropTypes.string.isRequired,
	hasSection: PropTypes.bool.isRequired
};

export default PageLayoutSection;

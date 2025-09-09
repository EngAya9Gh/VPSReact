import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'axios';
import { useState, useEffect } from 'react'; 
import withAuth from '@components/auth/withAuth';
import PageLayoutServices from '@components/page-layout-services';
import myStaticServices from '../../../data/my-static-services.json';

export async function getServerSideProps(context) {

	return {
		props: {
	      className: 'home-sticky-pin sidebar-header position-relative',
			sectionId: context.query.section_id
		}
	};  
}

const Home = ({ sectionId }) => {
	const staticItem = myStaticServices.find((item) => item.slug === 'game');
	const hasSections = staticItem ? staticItem.hasSections : null;
  const [myItems, setMyItems] = useState(null); // حالة لتخزين البيانات التي تم جلبها
  const [loading, setLoading] = useState(true); // حالة لتحديد ما إذا كان يتم تحميل البيانات

  useEffect(() => {
    const fetchData = async () => {
      try {
	   const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        const token = localStorage.getItem('token'); // جلب التوكن من localStorage
        if (token) {
          const response = await axios.get(
            `${apiBaseUrl}/game-sections/${sectionId}`,
            {
              headers: {
                Authorization: `Bearer ${token}` // تمرير التوكن في رأس الطلب
              }
            }
          );
          setMyItems(response.data); // تخزين البيانات في الحالة
        console.log('data',response.data);
}
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // تحديد أنه تم تحميل البيانات
      }
    };

    fetchData(); // استدعاء دالة جلب البيانات
  }, []); // سيتم تنفيذها عند تحميل الصفحة لأول مرة فقط

  if (loading) {
    return <div>Loading...</div>; // عرض رسالة تحميل أثناء الانتظار
  }

	return (
		<PageLayoutServices
			pageTitle="الألعاب"
			items={myItems?.apps}
			resourceType="game"
			sectionId={sectionId}
			hasSection={hasSections}
		/>
	);
};

Home.propTypes = {
	
	sectionId: PropTypes.string.isRequired
};


// تغليف المكون مع withAuth للتحقق من المصادقة
export default withAuth(Home);

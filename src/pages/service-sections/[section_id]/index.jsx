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
	const staticItem = myStaticServices.find((item) => item.slug === 'service');
	const hasSections = staticItem ? staticItem.hasSections : null;
  const [myItems, setMyItems] = useState(null); // حالة لتخزين البيانات التي تم جلبها
  const [loading, setLoading] = useState(true); // حالة لتحديد ما إذا كان يتم تحميل البيانات
  const [categoryName, setCategoryName] = useState('الخدمات'); // اسم الصنف
  const [currentPage, setCurrentPage] = useState(1); // الصفحة الحالية
  const [searchTerm, setSearchTerm] = useState(''); // كلمة البحث
  const [perPage, setPerPage] = useState(12); // عدد العناصر في كل صفحة

  const fetchData = async (page = 1, search = '', itemsPerPage = perPage) => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = localStorage.getItem('token');

      if (token) {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: itemsPerPage.toString()
        });

        if (search.trim()) {
          params.append('search', search.trim());
        }

        const response = await axios.get(
          `${apiBaseUrl}/service-sections/${sectionId}?${params}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setMyItems(response.data);
        setCategoryName(response.data.category?.name || 'الخدمات');
        console.log('data', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, searchTerm, perPage);
  }, [sectionId, currentPage, perPage]); // إعادة جلب البيانات عند تغيير الصفحة أو القسم أو عدد العناصر

  // دالة البحث
  const handleSearch = (search) => {
    setSearchTerm(search);
    setCurrentPage(1); // العودة للصفحة الأولى عند البحث
    fetchData(1, search, perPage);
  };

  // دالة تغيير الصفحة
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchData(page, searchTerm, perPage);
  };

  // دالة تغيير عدد العناصر في كل صفحة
  const handlePerPageChange = (inputPerPage) => {
    // تحديد الحد الأقصى والأدنى
    const minPerPage = 6;
    const maxPerPage = 50;

    // التأكد من أن القيمة ضمن النطاق المسموح
    let validatedPerPage = inputPerPage;
    if (inputPerPage < minPerPage) {
      validatedPerPage = minPerPage;
    } else if (inputPerPage > maxPerPage) {
      validatedPerPage = maxPerPage;
    }

    setPerPage(validatedPerPage);
    setCurrentPage(1); // العودة للصفحة الأولى عند تغيير عدد العناصر
    fetchData(1, searchTerm, validatedPerPage);
  };

  if (loading) {
    return <div>Loading...</div>; // عرض رسالة تحميل أثناء الانتظار
  }

	return (
		<PageLayoutServices
			pageTitle={categoryName}
			items={myItems?.services}
			resourceType="service"
			sectionId={sectionId}
			hasSection={hasSections}
			onSearch={handleSearch}
			onPageChange={handlePageChange}
			onPerPageChange={handlePerPageChange}
			currentPage={currentPage}
			searchTerm={searchTerm}
			perPage={perPage}
		/>
	);
};

Home.propTypes = {

	sectionId: PropTypes.string.isRequired
};


// تغليف المكون مع withAuth للتحقق من المصادقة
export default withAuth(Home);

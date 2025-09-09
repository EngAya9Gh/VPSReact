import SEO from '@components/seo';
import Wrapper from '@layout/wrapper';
import Header from '@layout/header/header-02';
import Footer from '@layout/footer/footer-02';
import TopBarArea from '@containers/top-bar';
import ActivityArea from '@containers/ranking';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import withAuth from '@components/auth/withAuth';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // استيراد الأنماط الخاصة بـ react-datepicker

export async function getStaticProps() {
  return { props: { className: 'template-color-1' } };
}

const Home = () => {
  const [auth, setAuth] = useState('');
  const [orders, setOrders] = useState([]);
  const [startDate, setStartDate] = useState(null); // تاريخ البداية
  const [endDate, setEndDate] = useState(null); // تاريخ النهاية
  const [dateRange, setDateRange] = useState(''); // خيار الفترة الزمنية
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch user data when the page loads
  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const result = await axios.get(`${apiBaseUrl}/logged-in-user`, {
          headers: {
            Authorization: `Bearer ${token}` // Pass token in Authorization header
          }
        });

        setAuth(result.data); // Set user data
      } catch {}
    };

    fetchAuth();
  }, [apiBaseUrl]);

  useEffect(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 2); // تحديد تاريخ البارحة

    // إذا لم يتم تحديد تاريخ (تاريخ البداية والنهاية فارغة)، تحديد تاريخ اليوم والبارحة
    if (!startDate && !endDate) {
      setStartDate(yesterday); // تحديد تاريخ البداية على البارحة
      setEndDate(today); // تحديد تاريخ النهاية على اليوم
      setDateRange('today'); // تعيين الخيار إلى "اليوم" بشكل افتراضي
    }
  }, [startDate, endDate]);
  // تغيير التواريخ بناءً على الخيار المحدد في القائمة المنسدلة
  useEffect(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 2); // تحديد تاريخ البارحة

    if (dateRange === 'today') {
      setStartDate(yesterday);
      setEndDate(today);
    } 
 else if (dateRange === 'week') {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - 7);
      setStartDate(startOfWeek);
      setEndDate(today);
    } else if (dateRange === 'twoWeeks') {
      const startOfTwoWeeks = new Date(today);
      startOfTwoWeeks.setDate(today.getDate() - 14);
      setStartDate(startOfTwoWeeks);
      setEndDate(today);
    } else if (dateRange === 'threeWeeks') {
      const startOfThreeWeeks = new Date(today);
      startOfThreeWeeks.setDate(today.getDate() - 21);
      setStartDate(startOfThreeWeeks);
      setEndDate(today);
    } else if (dateRange === 'month') {
      const startOfMonth = new Date(today);
      startOfMonth.setMonth(today.getMonth() - 1);
      setStartDate(startOfMonth);
      setEndDate(today);
    }
  }, [dateRange]);

  // جلب الدفعات بناءً على التواريخ المحددة
  useEffect(() => {
    if (auth && (startDate || endDate)) {
      const fetchPayments = async () => {
        try {
          const token = localStorage.getItem('token');
          let url = `${apiBaseUrl}/myPayments/${auth.id}`;

          // إضافة التواريخ إلى الاستعلام إذا كانت موجودة
          if (startDate && endDate) {
            url += `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
          }

          const result = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${token}` // Pass token in Authorization header
            }
          });

          setOrders(result.data.orders);
        } catch (error) {
          console.error(error);
        }
      };

      fetchPayments();
    } else {
      setOrders([]); // إذا لم يتم تحديد التواريخ، قم بإفراغ القائمة
    }
  }, [auth, apiBaseUrl, startDate, endDate]); // التحديث عند تغيير التواريخ أو الـ auth

  return (
    <Wrapper>
      <SEO pageTitle="myPayments" />
      <Header />
      <TopBarArea />
      <main id="main-content">
        <div className='rn-upcoming-area rn-section-gapTop'> 
          <div className='container container-packege'>
            <div className={clsx('form-wrapper-one product-style-one')}>
              <div className="mb-5">
                <div className="date-filters">
                  {/* قائمة منسدلة لاختيار الفترة الزمنية */}
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="date-range-dropdown"
                  >
                    
                    <option value="today">مؤخرا</option>
                    <option value="week">من أسبوع</option>
                    <option value="twoWeeks">من أسبوعين</option>
                    <option value="threeWeeks">من ثلاث أسابيع</option>
                    <option value="month">من شهر</option>
                  </select>

                  {/* تقاويم لاختيار التواريخ */}
                  <DatePicker
                    id="date-picker1"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="yyyy/MM/dd"
                    placeholderText="اختر تاريخ البداية"
                    className="custom-datepicker"
                    calendarClassName="custom-calendar"
                    wrapperClassName="custom-wrapper"
                  />
                  <DatePicker
                    id="date-picker2"
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="yyyy/MM/dd"
                    placeholderText="اختر تاريخ النهاية"
                    className="custom-datepicker"
                    calendarClassName="custom-calendar"
                    wrapperClassName="custom-wrapper"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* عرض الدفعات */}
        {orders.length > 0 && <ActivityArea data={orders} />}
      </main>
      <Footer />
    </Wrapper>
  );
};

export default withAuth(Home);

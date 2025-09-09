import SEO from '@components/seo';
import Wrapper from '@layout/wrapper';
import Header from '@layout/header/header-02';
import Footer from '@layout/footer/footer-02';
import TopBarArea from '@containers/top-bar';
import ActivityArea from '@containers/ranking_1';
import ActivityAreaService from '@containers/ranking_service';
import ActivityAreaTweetcell from '@containers/ranking_tweetcell';
import ActivityAreaTweetcellKontor from '@containers/ranking_tweetcell_kontor';
import { useState, useEffect } from 'react';
import withAuth from '@components/auth/withAuth';
import axios from 'axios';
import clsx from 'clsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export async function getStaticProps() {
  return { props: { className: 'template-color-1' } };
}

const Home = () => {
  const [auth, setAuth] = useState('');
  const [orders, setOrders] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateRange, setDateRange] = useState('today');
  const [uuid, setUuid] = useState('');
  const [selectedType, setSelectedType] = useState('app'); // ✅ النوع الافتراضي: تطبيقات

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchauth = async () => {
      try {
        const token = localStorage.getItem('token');
        const result = await axios.get(`${apiBaseUrl}/logged-in-user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuth(result.data);
      } catch {}
    };

    fetchauth();
  }, [apiBaseUrl]);

  useEffect(() => {
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const yesterday = new Date(startOfToday);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    if (!startDate && !endDate) {
      setStartDate(yesterday);
      setEndDate(endOfToday);
      setDateRange('today');
    }
  }, [startDate, endDate]);

  useEffect(() => {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const setDateRangePeriod = (days) => {
      const start = new Date(startOfToday);
      start.setDate(start.getDate() - days);
      start.setHours(0, 0, 0, 0);
      setStartDate(start);
      setEndDate(endOfToday);
    };

    switch (dateRange) {
      case 'today': setDateRangePeriod(1); break;
      case 'week': setDateRangePeriod(7); break;
      case 'twoWeeks': setDateRangePeriod(14); break;
      case 'threeWeeks': setDateRangePeriod(21); break;
      case 'month': {
        const startOfMonth = new Date(startOfToday);
        startOfMonth.setMonth(startOfMonth.getMonth() - 1);
        startOfMonth.setHours(0, 0, 0, 0);
        setStartDate(startOfMonth);
        setEndDate(endOfToday);
        break;
     }
  default:
    break;
    }
  }, [dateRange]);

  useEffect(() => {
    const fetchByType = async () => {
      if (!auth || !selectedType) return;

      try {
        const token = localStorage.getItem('token');
        let url = `${apiBaseUrl}/myRequests/${auth.id}/type/${selectedType}`;

        const formatDate = (date) => date.toISOString().split('T')[0];
        if (startDate && endDate) {
          url += `?startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`;
        }

        const result = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(result.data.orders || []);
      } catch (error) {
        console.error('فشل جلب البيانات حسب النوع:', error);
        setOrders([]);
      }
    };

    fetchByType();
  }, [selectedType, auth, startDate, endDate]);

  const handleSearchByUUID = async () => {
    if (!uuid) return;

    try {
      const token = localStorage.getItem('token');
      const result = await axios.get(`${apiBaseUrl}/myRequest/uuid/${uuid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const order = result.data?.order || result.data;
      setOrders(order ? [order] : []);
    } catch (error) {
      console.error('حدث خطأ أثناء جلب الطلب:', error);
      setOrders([]);
    }
  };

  // ✅ مكون يعرض حسب النوع المختار
  const renderActivityComponent = () => {
    if (!orders.length) return null;

    if (['app', 'game', 'ecard'].includes(selectedType)) {
      return <ActivityAreaTweetcell key={orders.length} data={orders} />;
    }

    if (['service', 'its'].includes(selectedType)) {
      return <ActivityAreaService key={orders.length} data={orders} />;
    }

    if (selectedType === 'kontor') {
      return <ActivityAreaTweetcellKontor key={orders.length} data={orders} />;
    }

    return <ActivityArea key={orders.length} data={orders} />;
  };

  return (
    <Wrapper>
      <SEO pageTitle="myRequests" />
      <Header />
      <TopBarArea />
      <main id="main-content">
        <div className='rn-upcoming-area rn-section-gapTop'>
          <div className='container container-packege'>
            <div className={clsx('form-wrapper-one product-style-one')}>
              <div className="mb-5">
                {/* اختيار النوع */}
                <div className="date-filters">
                  <div className="date-group margin-8"   >
                    <label htmlFor="type" className="form-label">اختر النوع</label>
                    <select
                      id="type"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="date-range-dropdown withRadius my-input-width"
                    >
                      <option value="app">التطبيقات</option>
                      <option value="game">الألعاب</option>
                      <option value="ecard">البيانات الرقمية</option>
                      <option value="kontor">تعبئة الرصيد</option>
                      <option value="service">خدمات السرفر</option>
                      <option value="its">خدمات ITS</option>
                    </select>
                  </div>
                </div>

                {/* اختيار الفترة الزمنية */}
                <div className="date-filters">
                  <div className="date-group">
                    <label htmlFor="date-range" className="form-label">اختر فترة زمنية</label>
                    <select
                      id="date-range"
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="date-range-dropdown withRadius my-input-width"
                    >
                      <option value="today">مؤخراً</option>
                      <option value="week">من أسبوع</option>
                      <option value="twoWeeks">من أسبوعين</option>
                      <option value="threeWeeks">من ثلاث أسابيع</option>
                      <option value="month">من شهر</option>
                    </select>
                  </div>

                  {/* اختيار التاريخين */}
                  <div className="date-range-wrapper">
                    <div className="date-group">
                      <label htmlFor="date-picker1" className="form-label">تاريخ البداية</label>
                      <DatePicker
                        id="date-picker1"
                        selected={startDate}
                        onChange={(date) => {
                          const start = new Date(date);
                          start.setHours(0, 0, 0, 0);
                          setStartDate(start);
                        }}
                        dateFormat="yyyy/MM/dd"
                        className="custom-datepicker"
                      />
                    </div>

                    <div className="date-group">
                      <label htmlFor="date-picker2" className="form-label">تاريخ النهاية</label>
                      <DatePicker
                        id="date-picker2"
                        selected={endDate}
                        onChange={(date) => {
                          const end = new Date(date);
                          end.setHours(23, 59, 59, 999);
                          setEndDate(end);
                        }}
                        dateFormat="yyyy/MM/dd"
                        className="custom-datepicker"
                      />
                    </div>
                  </div>
                </div>

                {/* البحث برقم الطلب 
                <div className="uuid-search mt-4">
                  <label htmlFor="uuid-input" className="form-label" style={{ marginInlineEnd: 8 }}>رقم الطلب</label>
                  <input
                    type="text"
                    id="uuid-input"
                    className="uuid-input withRadius my-input-width"
                    placeholder="أدخل رقم الطلب"
                    value={uuid}
                    onChange={(e) => setUuid(e.target.value)}
رئ                  />
                  <button
                    type="button"
                    onClick={handleSearchByUUID}
                    className="withRadius my-btn"
                    style={{ padding: '8px 16px', margin: '8px 16px' }}
                  >
                    بحث
                  </button>
                </div>*/}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ عرض الطلبات حسب النوع */}
        {renderActivityComponent()}
      </main>
      <Footer />
    </Wrapper>
  );
};

export default withAuth(Home);

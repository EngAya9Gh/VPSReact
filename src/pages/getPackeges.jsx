import SEO from '@components/seo'; 
import Wrapper from '@layout/wrapper';
import Header from '@layout/header/header-02';
import Footer from '@layout/footer/footer-02';
import TopBarArea from '@containers/top-bar';
import ActivityArea from '@containers/ranking-pakeges';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import withAuth from '@components/auth/withAuth';
import axios from 'axios';

export async function getStaticProps() {
  return { props: { className: 'template-color-1' } };
}

const Home = () => {
  const [mobile, setMobile] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
	const [auth, setAuth] = useState(true);
  const [dataField, setDataField] = useState({
    type: '',
  });

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

        setAuth(result.data); // Set user data
      } catch {}
    };

    fetchauth();
  }, [apiBaseUrl]);

  const changeDataFieldHandler = async (e) => {
    const { name, value } = e.target;
    setDataField((prev) => ({
      ...prev,
      [name]: value
    }));

    if (value) {
      // بمجرد اختيار قيمة، يتم تنفيذ البحث مباشرة
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const result = await axios.get(`${apiBaseUrl}/getpackeges`, {
          headers: {
            Authorization: `Bearer ${token}`, // تأكد من إضافة التوكن في الهيدر
          },
          params: { type: value } // إرسال البيانات عبر params
        });
        setOrders(result.data.packeges); // تخزين البيانات
      } catch (error) {
        console.error('Error fetching data', error);
      }
      setLoading(false); // إيقاف حالة التحميل
    } else {
      setOrders([]); // مسح النتائج إذا لم يتم اختيار قيمة
    }
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
                <label htmlFor="type" className="form-label">
                  نوع الخدمة اختر
                </label>
                <select
                  name="type"
                  onChange={changeDataFieldHandler}
                  id="type"
                  className="withRadius"
                  required
                >
                  <option value="">اختر...</option>
                  <option value="1">tam</option>
                  <option value="2">ses</option>
                  <option value="4">sms</option>
                  <option value="6">3gCep</option>
                  <option value="5">Yds</option>
                  <option value="3">Firsat Ses</option>
                </select>
              </div>  
            </div>
          </div>
        </div>

        {loading ? (
          <p>جاري البحث...</p> // عرض رسالة أثناء التحميل
        ) : (
          orders.length > 0 && <ActivityArea data={orders} mobile={mobile} />
        )}
      </main>
      <Footer />
    </Wrapper>
  );
};

export default withAuth(Home);

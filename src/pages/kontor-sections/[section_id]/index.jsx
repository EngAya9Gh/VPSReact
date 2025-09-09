import PropTypes from 'prop-types';
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
import { getData } from '@utils/getData';
import PageLayoutServices from '@components/page-layout-services-kontor';
import myStaticServices from '../../../data/data-communications.json';

export async function getServerSideProps(context) {
	return {
		props: {
			sectionId: context.query.section_id,
			className: 'home-sticky-pin sidebar-header position-relative'
		}
	};  
}

const Home = ({ sectionId }) => {
  const [mobile, setMobile] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // ✅ حالة الخطأ الجديدة
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [activityKey, setActivityKey] = useState(0);
  useEffect(() => {
    const fetchauth = async () => {
      try {
        const token = localStorage.getItem('token');
        await axios.get(`${apiBaseUrl}/logged-in-user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Error fetching auth data', error);
      }
    };

    fetchauth();
  }, [apiBaseUrl]);

  useEffect(() => {
    const fetchpakages = async () => {
     
    try {
      const token = localStorage.getItem('token');
      const result = await axios.get(`${apiBaseUrl}/getpackeges`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          section_id: sectionId
        }
      });

      setOrders(result.data.packages);
setActivityKey((prev) => prev + 1); // ✅ بالصورة الصحيحة

      if (result.data.packages.length === 0) {
        setError(result.data.error);
      }
    } catch (error) {
      console.error('Error fetching data', error);
      setError('حدث خطأ في الاتصال. حاول مرة أخرى.');
    }

    setLoading(false);

   
  };
fetchpakages(); 
},[apiBaseUrl]);








const changeDataFieldHandler = (e) => {
  let value = e.target.value;

  // إزالة أي شيء غير أرقام
  value = value.replace(/\D/g, '');

  // تأكد أن الرقم يبدأ بـ05
  if (!value.startsWith('05')) {
 value = `05${value.replace(/^0*/, '')}`; // نزيل الأصفار الزائدة من البداية
  }

  // قص الرقم ليكون طوله 11 فقط
  if (value.length > 11) {
    value = value.slice(0, 11);
  }

  setMobile(value);
  setError('');
};

  const handleSearch = async () => {
    if (!mobile) {
      setError('يرجى إدخال رقم الهاتف');
      return;
    }

    setLoading(true);
    setError(''); // ✅ مسح الخطأ قبل البحث

    try {
      const token = localStorage.getItem('token');
      const result = await axios.get(`${apiBaseUrl}/getpackegesmobile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          mobile,
          section_id: sectionId
        }
      });

      setOrders(result.data.packages);
setActivityKey((prev) => prev + 1); // ✅ بالصورة الصحيحة

      if (result.data.packages.length === 0) {
        setError(result.data.error);
      }
    } catch (error) {
      console.error('Error fetching data', error);
      setError('حدث خطأ في الاتصال. حاول مرة أخرى.');
    }

    setLoading(false);
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
                <input
                  type="text"
                  placeholder="05XXXXXXXX"
                  name="mobile"
                  value={mobile}
                  className="withRadius"
                  onChange={changeDataFieldHandler}
                />
              </div>

              {error && (
                <div className="mb-4" style={{ color: 'red' }}>
                  {error}
                </div>
              )}

              <div className="mb-5">
                <button 
                  onClick={handleSearch} 
                  type="button" 
                  className="withRadius" 
                  disabled={loading || mobile.length !== 11}
                >
                  {loading ? 'جاري البحث...' : 'بحث'}
                </button>
              </div>
            </div>
          </div>
        </div>

   {orders.length > 0 && (
  <ActivityArea key={activityKey} data={orders} mobile={mobile} />
   )}      </main>
      <Footer />
    </Wrapper>
  );
};

Home.propTypes = {
	sectionId: PropTypes.string.isRequired
};

export default withAuth(Home);
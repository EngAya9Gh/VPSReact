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

        // Optionally handle the user data here
      } catch (error) {
        console.error('Error fetching auth data', error);
      }
    };

    fetchauth();
  }, [apiBaseUrl]);

  const changeDataFieldHandler = (e) => {
    const { value } = e.target;
    setMobile(value); // Update mobile state when user types in input
  };

  // Handle search
  const handleSearch = async () => {
    if (!mobile) return; // If mobile is empty, don't trigger the search

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const result = await axios.get(`${apiBaseUrl}/getpackegesmobile`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in Authorization header
        },
        params: { mobile } // Send mobile in params as an object { mobile: value }
      });
console.log(result.data);
      setOrders(result.data.packages); // Set fetched orders
    } catch (error) {
      console.error('Error fetching data', error);
    }

    setLoading(false); // Stop loading
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
              </div>
            </div>
          </div>
        </div>

        {/* Render orders if available */}
        {orders.length > 0 && <ActivityArea data={orders} mobile={mobile} />}
      </main>
      <Footer />
    </Wrapper>
  );
};

export default withAuth(Home);

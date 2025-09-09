import React, { useState, useEffect } from 'react';
import SEO from "@components/seo"; 
import Wrapper from "@layout/wrapper"; 
import Header from "@layout/header/header-02"; 
import Footer from "@layout/footer/footer-02"; 
import Breadcrumb from "@components/breadcrumb"; 
import ActivityAreaService from '@containers/ranking-order/service';
import ActivityAreaTweetcell from '@containers/ranking-order/tweetcell';
import TopBarArea from '@containers/top-bar'; 
import axios from 'axios';

export async function getServerSideProps(context) {
  const { index } = context.query;
  console.log('Received index in getServerSideProps:', index); // طباعة قيمة الـ index الواردة من query

  try {
    const data = { index };
    return {
      props: {
        ...data,
        className: 'home-sticky-pin sidebar-header position-relative'
      }
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error); // طباعة الأخطاء في الـ Server-side
    return {
      props: {
        error: 'There was an error processing your request.'
      }
    };
  }
}

const Connect = ({ index }) => {
  const [orderData, setOrderData] = useState(null);
  const [orderType, setOrderType] = useState(null);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

 useEffect(() => {
  const fetchOrderData = async () => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        console.error('Token not found');
        return;
      }

      try {
        const result = await axios.get(`${apiBaseUrl}/order-detail/${index}`, {
          headers: {
            Authorization: `Bearer ${storedToken}` // Pass token in Authorization header
          }
        });
        console.log('API Response:', result); // طباعة استجابة الـ API في المتصفح
        
        setOrderData(result.data.order);
        setOrderType(result.data.table);
      } catch (error) {
        console.error('Error fetching order data:', error.response ? error.response.data : error.message);
      }
    }
  };

  if (index) {
    fetchOrderData();
  }
}, [index]);

  return (
    <Wrapper>
      <SEO pageTitle="Connect" />
      <Header />
      <main id="main-content">
        <div className="list-item-1">
          <TopBarArea />
        </div>
        <Breadcrumb
          pageTitle="Make your payment easier"
          currentPage="Make your payment easier"
        />
{orderData && (orderType === 'service_orders' ? <ActivityAreaService order={orderData} /> : <ActivityAreaTweetcell order={orderData} />)}
   
      </main>
      <Footer />
      
    </Wrapper>
  );
};

export default Connect;

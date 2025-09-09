import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'axios';
import { useState, useEffect } from 'react'; 
import ProductTitle from '@components/product-details/myFavorite';
import OrderForm from '@components/order-form/app';
import withAuth from '@components/auth/withAuth';

export async function getServerSideProps(context) {

	return {
		props: {
			className: 'home-sticky-pin sidebar-header position-relative',

			appId: context.query.game_id
		}
	};  
}


const ProductDetailsArea = ({ appId }) => {
  const [myItems, setMyItems] = useState(null); // حالة لتخزين البيانات التي تم جلبها
  const [loading, setLoading] = useState(true); // حالة لتحديد ما إذا كان يتم تحميل البيانات

  useEffect(() => {
    const fetchData = async () => {
      try {
	   const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        const token = localStorage.getItem('token'); // جلب التوكن من localStorage
        if (token) {
          const response = await axios.get(
            `${apiBaseUrl}/game/${appId}`,
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
	<div className={clsx('product-details-area')}>
		<div className="container">
			<div className="row g-5">
				<div className="col-lg-12 col-md-12 col-sm-12 mt_md--50 mt_sm--60">
					<div className="rn-pd-content-area product-style-one mydiv">
						<ProductTitle
							title={myItems?.app?.name}
							item_id={myItems.app.id}
							item_type="App"
						/>
						<span className="bid">
							<span className="price" />
						</span>
						

						<OrderForm app={myItems?.app} />
					</div>
				</div>
			</div>
		</div>
	</div>
)};

ProductDetailsArea.propTypes = {
  
    appId: PropTypes.number.isRequired
};

export default withAuth(ProductDetailsArea);

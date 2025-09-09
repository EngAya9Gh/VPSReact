import { useEffect, useState } from 'react';
import SEO from '@components/seo';
import Wrapper from '@layout/wrapper';
import Header from '@layout/header/header-02';
import Footer from '@layout/footer/footer-02';
import TopBarArea from '@containers/top-bar';
import HeroArea from '@containers/hero/layout-16';
import ExploreServiceArea from '@containers/explore-service/service-sections'; // Move this import up
import { normalizedData } from '@utils/methods'; // Move this import up
import axios from 'axios';
import homepageData from '../data/homepages/home-08.json';
import myStaticServices from '../data/my-static-services_copy.json';

export async function getStaticProps() {
	return {
		props: {
			className: 'home-sticky-pin sidebar-header position-relative'
		}
	};
}

const Home = () => {
	const content = normalizedData(homepageData?.content || []);
	const [services, setServices] = useState(myStaticServices);
	const [slider, setSlider] = useState([]);

	useEffect(() => {
		const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
          const fetchSlider = async () => {
              try {
                  const result = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/slider`);
                  setSlider(result.data.slider.data);
              } catch (error) {
                  // عرض الخطأ فقط في وضع التطوير
                  if (process.env.NODE_ENV === 'development') {
                      console.error('Error fetching slider:', error);
                  }
              }
          };
		fetchSlider();

		const fetchTotals = async () => {
			try {
				const result = await axios.get(`${apiBaseUrl}/totalRecords`);
				const fetchedTotalRecords = result.data;
				const updatedServices = services.map((service) => ({
					...service,
					total: fetchedTotalRecords[`${service.slug}Records`] || 0
				}));
				setServices(updatedServices);
			} catch (error) {
				// Log the error only in development mode
				if (process.env.NODE_ENV === 'development') {
					console.error('Error fetching totals:', error);
				}
			}
		};
		fetchTotals();
	}, [services]);

	return (
		<Wrapper>
			<SEO pageTitle="Home" />
			<Header />
			<main
				id="main-content"
				className="rn-nft-mid-wrapper nft-left-sidebar-nav pr--40 pr_sm--15"
			>
				<div className="list-item-1">
					<TopBarArea />
					{slider && <HeroArea data={slider} />}
				</div>
				<ExploreServiceArea
					id="list-item-3"
					space={2}
					data={{
						...content['explore-product-section'],
						products: services
					}}
				/>
			</main>
			<Footer className="pr--40" />
		</Wrapper>
	);
};

export default Home;

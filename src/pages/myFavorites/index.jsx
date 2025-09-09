import SEO from '@components/seo';
import Wrapper from '@layout/wrapper';
import Header from '@layout/header/header-02';
import Footer from '@layout/footer/footer-02';
import TopBarArea from '@containers/top-bar';
import ProductArea from '@containers/explore-product/mylayout-favorite';
import { useState, useEffect } from 'react'; // Removed React import
import withAuth from '@components/auth/withAuth';
import axios from 'axios';

export async function getStaticProps() {
	return { props: { className: 'template-color-1' } };
}

const Company = () => {
	const [data, setData] = useState([]);

	useEffect(() => {
		const fetchAgents = async () => {
			try {
				const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
				const token = localStorage.getItem('token');

				const result = await axios.get(
					`${apiBaseUrl}/favorites`,
					{
						headers: {
							Authorization: `Bearer ${token}`
						}
					}
				);
   console.log("in 1 component:",result.data);
				setData( result.data );
				console.log("in 1-1 component:",data);

			} catch(error) {
				if (error.response) {
					console.error('Error Data:', error.response.data);
					console.error('Error Status:', error.response.status);
					console.error('Error Headers:', error.response.headers);
						}
			}
		};
		fetchAgents();
	}, []);

	return (
		<Wrapper>
			<SEO pageTitle="Product" />
			<Header />
			<TopBarArea />
			<main id="main-content">
				<ProductArea data={data} />
			</main>
			<Footer />
		</Wrapper>
	);
};

export default withAuth(Company);

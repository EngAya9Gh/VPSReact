import PropTypes from 'prop-types'; // Add PropTypes
import { getData } from '@utils/getData';
import PageLayoutSections from '@components/page-layout-sections';

export async function getServerSideProps() {
	const data = await getData('its-sections');

	return {
		props: {
			...data,
			className: 'home-sticky-pin sidebar-header position-relative'
	
		}

	};
}

const Home = ({ myItems }) =>  {
	// Print the API data to the console
	console.log('API Data:', myItems);

	return (
	<PageLayoutSections
		pageTitle=""
		items={myItems?.categories?.data}
		resourceType="its"
	/>
);
};

// Add prop types validation
Home.propTypes = {
	myItems: PropTypes.shape({
		categories: PropTypes.shape({
			data: PropTypes.arrayOf(PropTypes.object) // Use arrayOf for better validation
		})
	})
};

export default Home;

import PropTypes from 'prop-types'; // Add PropTypes
import { getData } from '@utils/getData';
import PageLayoutSections from '@components/page-layout-sections';

export async function getServerSideProps() {
	const data = await getData('app-sections');
	return {
		props: {
			...data,
			className: 'home-sticky-pin sidebar-header position-relative'
			
		}
	};
}

const Home = ({ myItems }) => (
	<PageLayoutSections
		pageTitle="التطبيقات"
		items={myItems?.appSections?.data}
		resourceType="app"
	/>
);

// Add prop types validation
Home.propTypes = {
	myItems: PropTypes.shape({
		appSections: PropTypes.shape({
			data: PropTypes.arrayOf(PropTypes.object) // Use arrayOf for better validation
		})
	})
};

export default Home;

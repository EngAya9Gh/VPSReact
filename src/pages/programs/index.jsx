import { getData } from '@utils/getData';
import PageLayoutServices from '@components/page-layout-services';
import PropTypes from 'prop-types'; // Changed to double quotes
import myStaticServices from '../../data/my-static-services.json';

export async function getServerSideProps(_context) {
	const data = await getData(`programs`);
	return {
		props: {
			...data,
			className: 'home-sticky-pin sidebar-header position-relative'
		}
	};
}

const Home = ({ myItems }) => {
	const foundItem = myStaticServices.find((item) => item.slug === 'program');
	const hasSections = foundItem ? foundItem.hasSections : null;
	return (
		<PageLayoutServices
			pageTitle="البرامج"
			items={myItems?.programs?.data}
			resourceType="program"
			hasSection={hasSections}
		/>
	);
};

Home.propTypes = {
	myItems: PropTypes.shape({
		programs: PropTypes.shape({
			data: PropTypes.arrayOf(
				PropTypes.shape({
					id: PropTypes.number.isRequired,
					name: PropTypes.string.isRequired
					// Add other fields based on your data structure
				})
			).isRequired
		}).isRequired
	}).isRequired
};

export default Home;

import PropTypes from 'prop-types'; // Added PropTypes import
import { getData } from '@utils/getData';
import PageLayoutServices from '@components/page-layout-services';
import myStaticServices from '../../data/my-static-services.json';

export async function getServerSideProps(_context) {
	const data = await getData(`cards`);
	return {
		props: {
			...data,
			className: 'home-sticky-pin sidebar-header position-relative'
		}
	};
}

const Home = ({ myItems, _className }) => {
	const staticItem = myStaticServices.find((item) => item.slug === 'card');
	const hasSections = staticItem ? staticItem.hasSections : null;
	return (
		<PageLayoutServices
			pageTitle="البطاقات"
			items={myItems?.cards?.data}
			resourceType="card"
			hasSection={hasSections}
		/>
	);
};

// Add PropTypes validation for myItems and className
Home.propTypes = {
	myItems: PropTypes.shape({
		cards: PropTypes.shape({
			data: PropTypes.arrayOf(
				PropTypes.shape({
					id: PropTypes.number,
					title: PropTypes.string
					// Add more specific shape definitions based on your data structure
				})
			)
		})
	}),
	_className: PropTypes.string
};

export default Home;

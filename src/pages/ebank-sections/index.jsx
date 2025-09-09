import { getData } from '@utils/getData';
import PageLayoutSections from '@components/page-layout-sections';
import PropTypes from 'prop-types';

export async function getServerSideProps(_context) {
	const data = await getData('ebank-sections');
	return {
		props: {
			...data,
			className: 'home-sticky-pin sidebar-header position-relative'
		}
	};
}

const Home = ({ myItems, className }) => (
	<PageLayoutSections
		pageTitle="البنوك الإلكترونية"
		items={myItems?.ebankSections?.data}
		resourceType="ebank"
		className={className}
	/>
);

Home.propTypes = {
	myItems: PropTypes.shape({
		ebankSections: PropTypes.shape({
			data: PropTypes.arrayOf(
				PropTypes.shape({
					id: PropTypes.number.isRequired,
					title: PropTypes.string.isRequired,
					description: PropTypes.string
					// Add other relevant fields based on the structure of your data
				})
			)
		})
	}),
	className: PropTypes.string
};

export default Home;

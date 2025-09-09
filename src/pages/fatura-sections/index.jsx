import { getData } from '@utils/getData';
import PageLayoutSections from '@components/page-layout-sections';
import PropTypes from 'prop-types';

export async function getServerSideProps(_context) {
	const data = await getData('fatura-sections');
	return {
		props: {
			...data
		}
	};
}

const Home = ({ myItems, className }) => (
	<PageLayoutSections
		pageTitle=" دفع الفواتير "
		items={myItems?.faturaSections?.data}
		resourceType="fatura"
		className={className}
	/>
);

Home.propTypes = {
	myItems: PropTypes.shape({
		dataSections: PropTypes.shape({
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

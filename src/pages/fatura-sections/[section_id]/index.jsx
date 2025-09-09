import PropTypes from 'prop-types';
import { getData } from '@utils/getData';
import PageLayoutServices from '@components/page-layout-services';
import myStaticServices from '../../../data/my-static-services_copy.json';

export async function getServerSideProps(context) {
	const data = await getData(`fatura-sections/${context.query.section_id}`);
	return {
		props: {
			...data,
			sectionId: context.query.section_id
		}
	};  
}

const Home = ({ myItems, sectionId }) => {
	const staticItem = myStaticServices.find((item) => item.slug === 'fatura');
	const hasSections = staticItem ? staticItem.hasSections : null;

	return (
		<PageLayoutServices
			pageTitle="دفع الفواتير"
            items={myItems?.faturas}
            resourceType="fatura"
			sectionId={sectionId}
			hasSection={hasSections}
		/>
	);
};

Home.propTypes = {
	myItems: PropTypes.shape({
		dataCommunication: PropTypes.arrayOf(PropTypes.object) // Use arrayOf for better validation
	}),
	sectionId: PropTypes.string.isRequired
};

export default Home;

import PropTypes from 'prop-types';
import { getData } from '@utils/getData';
import PageLayoutServices from '@components/page-layout-services';
import myStaticServices from '../../../data/data-communications.json';

export async function getServerSideProps(context) {
	const data = await getData(`general-sections/${context.query.section_id}`);
	return {
		props: {
			...data,
			sectionId: context.query.section_id
		}
	};  
}

const Home = ({ myItems, sectionId }) => {
	const staticItem = myStaticServices.find((item) => item.slug === 'general');
	const hasSections = staticItem ? staticItem.hasSections : null;

	return (
		<PageLayoutServices
			pageTitle="البيانات والاتصالات"
			items={myItems?.['data-communications']}
			resourceType="general"
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

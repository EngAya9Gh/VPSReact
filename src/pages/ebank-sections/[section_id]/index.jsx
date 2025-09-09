import PropTypes from 'prop-types';
import { getData } from '@utils/getData';
import PageLayoutServices from '@components/page-layout-services';
import myStaticServices from '../../../data/my-static-services.json';

export async function getServerSideProps(context) {
	const data = await getData(`ebank-sections/${context.query.section_id}`);
	return {
		props: {
			...data,
			sectionId: context.query.section_id,
			className: 'home-sticky-pin sidebar-header position-relative'
		}
	};
}

const Home = ({ myItems, sectionId, className }) => {
	const staticItem = myStaticServices.find(
		(service) => service.slug === 'ebank'
	);
	const hasSections = staticItem ? staticItem.hasSections : null;
	return (
		<PageLayoutServices
			pageTitle="البنوك الإلكترونية"
			items={myItems?.ebanks}
			resourceType="ebank"
			sectionId={sectionId}
			hasSection={hasSections}
			className={className}
		/>
	);
};

Home.propTypes = {
	myItems: PropTypes.shape({
		ebanks: PropTypes.arrayOf(
			PropTypes.shape({
				id: PropTypes.number.isRequired,
				name: PropTypes.string.isRequired
				// Add other relevant fields based on your data structure
			})
		)
	}).isRequired,
	sectionId: PropTypes.string.isRequired,
	className: PropTypes.string
};

export default Home;

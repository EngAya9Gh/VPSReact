import PropTypes from 'prop-types';
import SEO from '@components/seo';
import Wrapper from '@layout/wrapper';
import Header from '@layout/header/header-02';
import Footer from '@layout/footer/footer-02';
import TopBarArea from '@containers/top-bar';
import ExploreServiceArea from '@containers/explore-service/all-services';
import { normalizedData } from '@utils/methods';
import homepageData from '../../data/homepages/home-08.json';

const PageLayoutSection = ({
	pageTitle,
	items,
	sectionId,
	resourceType,
	hasSection,
	onSearch,
	onPageChange,
	onPerPageChange,
	currentPage,
	searchTerm,
	perPage
}) => {
	const content = normalizedData(homepageData?.content || []);

	return (
		<Wrapper>
			<SEO pageTitle={pageTitle} />
			<Header />
			{/* تم إزالة TopBarArea من هذه الصفحة لتجنب تكرار حقل البحث */}
			<main
				id="main-content"
				className="rn-nft-mid-wrapper nft-left-sidebar-nav pr--40 pr_sm--15"
				style={{ paddingTop: '2rem' }}
			>
				{!items || (Array.isArray(items.data) ? items.data.length === 0 : items.length === 0) ? (
					<h2 className="text-center">لا توجد بيانات متاحة</h2>
				) : (
					<ExploreServiceArea
						sectionTitle={pageTitle}
						id="list-item-3"
						space={2}
						hasSection={hasSection}
						onSearch={onSearch}
						onPageChange={onPageChange}
						onPerPageChange={onPerPageChange}
						currentPage={currentPage}
						searchTerm={searchTerm}
						perPage={perPage}
						data={{
							...content['explore-product-section'],
							parentSlug: resourceType,
							sectionId,
							products: items
						}}
					/>
				)}
			</main>
			<Footer className="pr--40" />
		</Wrapper>
	);
};

// Updated PropTypes validation
PageLayoutSection.propTypes = {
	pageTitle: PropTypes.string.isRequired,
	items: PropTypes.oneOfType([
		PropTypes.arrayOf(
			PropTypes.shape({
				id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
				name: PropTypes.string
			})
		),
		PropTypes.shape({
			data: PropTypes.array,
			current_page: PropTypes.number,
			last_page: PropTypes.number,
			per_page: PropTypes.number,
			total: PropTypes.number
		})
	]).isRequired,
	sectionId: PropTypes.string.isRequired,
	resourceType: PropTypes.string.isRequired,
	hasSection: PropTypes.bool.isRequired,
	onSearch: PropTypes.func,
	onPageChange: PropTypes.func,
	onPerPageChange: PropTypes.func,
	currentPage: PropTypes.number,
	searchTerm: PropTypes.string,
	perPage: PropTypes.number
};

export default PageLayoutSection;

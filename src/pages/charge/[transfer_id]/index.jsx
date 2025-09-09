import PropTypes from 'prop-types';
import SEO from '@components/seo';
import Wrapper from '@layout/wrapper';
import Header from '@layout/header/header-02';
import Footer from '@layout/footer/footer-02';
import Breadcrumb from '@components/breadcrumb';
import CreateNewArea from '@containers/create-new';
import { getData } from '@utils/getData';
import withAuth from '@components/auth/withAuth';
import TopBarArea from '@containers/top-bar';

export async function getServerSideProps(context) {
	const data = await getData(
		`transfer-money-firm/${context.query.transfer_id}`
	);
	return {
		props: {
			...data,
			className: 'home-sticky-pin sidebar-header position-relative'
		}
	};
}

const Home = ({ myItems }) => (
	<Wrapper>
		<SEO pageTitle="charge" />
		<Header />
		<TopBarArea />
		<main id="main-content">
			<Breadcrumb pageTitle={myItems.transferMoneyFirm.name} />
			<CreateNewArea data={myItems.transferMoneyFirm} />
		</main>
		<Footer />
	</Wrapper>
);

// Add PropTypes validation for myItems
Home.propTypes = {
	myItems: PropTypes.shape({
		transferMoneyFirm: PropTypes.shape({
			name: PropTypes.string.isRequired
		}).isRequired
	}).isRequired
};

export default withAuth(Home);

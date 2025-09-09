import PropTypes from 'prop-types';
import clsx from 'clsx';
import ProductTitle from '@components/product-details/myFavorite'; // Import ProductTitle
import OrderForm from '@components/order-form/e-bank';
import { getData } from '@utils/getData';
import withAuth from '@components/auth/withAuth';

export async function getServerSideProps(context) {
	const data = await getData(`ebank/${context.query.ebank_id}`);
	return {
		props: {
			...data,
			className: 'home-sticky-pin sidebar-header position-relative'
		}
	};
}

const ProductDetailsArea = ({ myItems }) => (
	<div className={clsx('product-details-area')}>
		<div className="container">
			<div className="row g-5">
				<div className="col-lg-12 col-md-12 col-sm-12 mt_md--50 mt_sm--60">
					<div className="rn-pd-content-area product-style-one mydiv">
						{myItems?.ebank && (
							<>
								<ProductTitle
									title={myItems.ebank.name}
								item_id={myItems.ebank.id}
							    item_type="Ebank"
								/>
								<OrderForm ebank={myItems.ebank} />
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	</div>
);

ProductDetailsArea.propTypes = {
	myItems: PropTypes.shape({
		ebank: PropTypes.shape({
			name: PropTypes.string,
			likeCount: PropTypes.number
		})
	}).isRequired
};

export default withAuth(ProductDetailsArea);

import PropTypes from 'prop-types';
import clsx from 'clsx';
import ProductTitle from '@components/product-details/myFavorite';
import { getData } from '@utils/getData';
import withAuth from '@components/auth/withAuth';
import OrderForm from '@components/order-form/program';

export async function getServerSideProps(context) {
	const data = await getData(`program/${context.query.program_id}`);
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
					<div className="rn-pd-content- product-style-one mydiv">
						<ProductTitle
							title={myItems?.program?.name}
								item_id={myItems.program.id}
							    item_type="Program"
						/>
						<span className="bid">
							<span className="price" />
						</span>

						{myItems?.program && (
							<OrderForm program={myItems.program} />
						)}
					</div>
				</div>
			</div>
		</div>
	</div>
);

ProductDetailsArea.propTypes = {
	myItems: PropTypes.shape({
		program: PropTypes.shape({
			name: PropTypes.string.isRequired,
			likeCount: PropTypes.number,
			price: PropTypes.shape({
				amount: PropTypes.number,
				currency: PropTypes.string
			})
		}).isRequired
	}).isRequired
};

export default withAuth(ProductDetailsArea);

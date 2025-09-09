import PropTypes from 'prop-types';
import Image from 'next/image';
import clsx from 'clsx';
import Anchor from '@ui/anchor';

const Product = ({ overlay, title, slug, image }) => (
	<div
		className={clsx(
			'companyCard product-style-one',
			!overlay && 'no-overlay'
		)}
	>
		<div className="card-thumbnail">
			<Anchor path={`/charge/${slug}`}>
				<Image src={image} alt={title} width={533} height={533} />
			</Anchor>
		</div>
		<div className='p-22'>{title}</div>
	</div>
);

Product.propTypes = {
	overlay: PropTypes.bool,
	title: PropTypes.string.isRequired,
	slug: PropTypes.number.isRequired,
	image: PropTypes.string
};

Product.defaultProps = {
	overlay: false
};

export default Product;

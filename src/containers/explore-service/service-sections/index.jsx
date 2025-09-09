import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import SectionTitle from '@components/section-title/layout-03';
import Service from '@components/service-section';

// services sections in home page
const ExploreServiceArea = ({ className, space, data, id, sectionTitle }) => {
	const [products, setProducts] = useState([]);
	useEffect(() => {
		setProducts(data?.products);
	}, [data?.products]);

	return (
		<div
			className={clsx(
				'rn-product-area masonary-wrapper-activation p-container',
				space === 1 && 'rn-section-gapTop',
				space === 2 && 'rn-section-gapBottom',
				className
			)}
			id={id}
		>
			<div className="container">
				<div className="row gx-5 align-items-center mb--60">
					<div className="col-lg-4">
						{sectionTitle && (
							<SectionTitle
								className="mb--0"
								disableAnimation
								title={sectionTitle}
							/>
						)}
					</div>
				</div>
				<div className="col-lg-12">
	<motion.div layout className="isotope-list item-4">
		{products
			?.filter((prod) => prod.total !== 0) // تصفية المنتجات
			.map((prod) => (
				<motion.div
					key={prod.id}
					className={clsx('grid-item')}
					layout
				>
					<Service
						title={prod.title}
						slug={prod.slug}
						total={prod.total}
						likeCount={prod.id}
						image={prod.image}
						authors={prod.authors}
						hasSections={prod.hasSections}
						directToOrder={prod.directToOrder}
					/>
				</motion.div>
			))}
	</motion.div>
</div>

			</div>
		</div>
	);
};

ExploreServiceArea.propTypes = {
	className: PropTypes.string,
	space: PropTypes.oneOf([1, 2]),
	id: PropTypes.string,
	sectionTitle: PropTypes.string,
	data: PropTypes.shape({
		products: PropTypes.arrayOf(
			PropTypes.shape({
				id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
				title: PropTypes.string,
				slug: PropTypes.string,
				total: PropTypes.number,
				image: PropTypes.string,
				authors: PropTypes.arrayOf(PropTypes.string),
				hasSections: PropTypes.bool,
				directToOrder: PropTypes.bool
			})
		)
	})
};

ExploreServiceArea.defaultProps = {
	space: 1
};

export default ExploreServiceArea;

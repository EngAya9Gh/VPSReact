import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import clsx from 'clsx';
import Anchor from '@ui/anchor';
import ProductBid from '@components/product-bid';

// قسم الترجمة في صفحة التطبيقات
const Service = ({
	overlay,
	title,
	serviceId,
	parentSlug,
	sectionId,
	price,
	likeCount,
	hasSection,
	iban,
	accountName,

}) => {
	const [servicePath, setServicePath] = useState('');

	useEffect(() => {
		let path = '';
		if (hasSection) {
			path = `/${parentSlug}-sections/${sectionId}/${parentSlug}-order/${serviceId}`;
		} else {
			path = `/${parentSlug}s/${parentSlug}-order/${serviceId}`;
		}
		setServicePath(path);
	}, [hasSection, parentSlug, sectionId, serviceId]);

	return (
		<div className={clsx('product-style-one', !overlay && 'no-overlay')}>
			
			<div className="product-share-wrapper" />
			<Anchor path={servicePath}>
				<span className="product-name">{title}</span>
			</Anchor>
			{parentSlug !== 'transfer-money-firm' ? (
				<>
					<span className="latest-bid">
						السعر: {price?.amount}TL
					</span>
					<br />
				</>
			) : (
				<>
					<span className="latest-bid">iban: {iban}</span>
					<br />
					<span className="latest-bid">
						account name: {accountName}
					</span>
				</>
			)}
	
		</div>
	);
};

Service.propTypes = {
	overlay: PropTypes.bool,
	hasSection: PropTypes.bool,
	title: PropTypes.string.isRequired,
	serviceId: PropTypes.number.isRequired,
	parentSlug: PropTypes.string.isRequired,
	sectionId: PropTypes.number,
	price: PropTypes.shape({
		amount: PropTypes.number,
		currency: PropTypes.string
	}),
	iban: PropTypes.string,
	accountName: PropTypes.string,
	likeCount: PropTypes.number.isRequired,

};

Service.defaultProps = {
	overlay: false
};

export default Service;

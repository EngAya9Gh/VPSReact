import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import clsx from 'clsx';
import Anchor from '@ui/anchor';
import ProductBid from '@components/product-bid';

const Service = ({
  overlay,
  title,
  serviceId,
  parentSlug,
  sectionId,
  price,
  sale_price,
  likeCount,
  hasSection,
  iban,
  accountName,
  image
}) => {
  const [servicePath, setServicePath] = useState('');
  const [currency, setCurrency] = useState('TL');

  useEffect(() => {
    let path = '';
    if (hasSection) {
      path = `/${parentSlug}-sections/${sectionId}/${parentSlug}-order/${serviceId}`;
    } else {
      path = `/${parentSlug}s/${parentSlug}-order/${serviceId}`;
    }
    setServicePath(path);
  }, [hasSection, parentSlug, sectionId, serviceId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCurrency = localStorage.getItem('currency') || 'TL';
      setCurrency(savedCurrency.toUpperCase());
    }
  }, []);

  return (
    <div className={clsx('product-style-one', !overlay && 'no-overlay')}>
      <div className="card-thumbnail">
        {image && (
          <Anchor path={servicePath}>
            <Image src={image} alt={title} width={533} height={533} />
          </Anchor>
        )}
      </div>
      <div className="product-share-wrapper" />
      <Anchor path={servicePath}>
        <span className="product-name">{title}</span>
      </Anchor>

      {parentSlug !== 'transfer-money-firm' ? (
        <div className="text-center">
          {sale_price?.amount !== 0 ? (
            <>
              <span className="latest-bid span_color_req">
                سعر الشراء: {price?.amount} {currency}
              </span>
              <br />
              <span className="latest-bid">
                سعر البيع: {sale_price?.amount} {currency}
              </span>
            </>
          ) : (
            <span className="latest-bid">
              السعر: {price?.amount} {currency}
            </span>
          )}
        </div>
      ) : (
        <div>
          <span className="latest-bid">iban: {iban}</span>
          <br />
          <span className="latest-bid">account name: {accountName}</span>
        </div>
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
  sale_price: PropTypes.shape({
    amount: PropTypes.number,
    currency: PropTypes.string
  }),
  iban: PropTypes.string,
  accountName: PropTypes.string,
  likeCount: PropTypes.number.isRequired,
  image: PropTypes.string
};

Service.defaultProps = {
  overlay: false
};

export default Service;

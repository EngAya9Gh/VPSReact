import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import SectionTitle from '@components/section-title/layout-03';
import Service from '@components/service-custome';

// Services in each service pages example /app page
const ExploreServiceArea = ({
  className,
  space,
  data,
  id,
  sectionTitle,
  hasSection
}) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(data?.products);
  }, [data]);

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
          <div className="col-lg-8"></div>
        </div>
        <div className="col-lg-12">
          <motion.div layout className="isotope-list item-4">
            {products?.slice(0, 100)?.map((prod) => (
              <motion.div
                key={prod.id}
                className={clsx('grid-item')}
                layout
              >
                <Service
                  title={prod.name}
                  serviceId={prod.id}
                  parentSlug={data.parentSlug}
                  sectionId={data.sectionId}
                  price={{
                    amount: prod.price,
                    currency: 'TL'
                  }}
                  sale_price={{
                    amount: prod.sale_price,
                    currency: 'TL'
                  }}
                  likeCount={prod.id}
                  image={prod.image_url || 'path/to/default-image.jpg'}  // Adding a default image
                  hasSection={hasSection}
                  iban={prod?.iban}
                  accountName={prod?.accountName}
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
  hasSection: PropTypes.bool,
  data: PropTypes.shape({
    sectionId: PropTypes.number,
    parentSlug: PropTypes.string,
    products: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        categories: PropTypes.arrayOf(PropTypes.string),
        image_url: PropTypes.string,
        iban: PropTypes.string,
        accountName: PropTypes.string
      })
    ),
    placeBid: PropTypes.bool
  })
};

ExploreServiceArea.defaultProps = {
  space: 1
};

export default ExploreServiceArea;

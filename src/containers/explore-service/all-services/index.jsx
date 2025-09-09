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
  hasSection,
  onSearch,
  onPageChange,
  onPerPageChange,
  currentPage,
  searchTerm,
  perPage
}) => {
  const [products, setProducts] = useState([]);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');

  useEffect(() => {
    // التحقق من نوع البيانات (pagination object أم array عادي)
    if (data?.products?.data) {
      setProducts(data.products.data); // pagination data
    } else if (Array.isArray(data?.products)) {
      setProducts(data.products); // array data
    } else {
      setProducts([]);
    }
  }, [data]);

  useEffect(() => {
    setLocalSearchTerm(searchTerm || '');
  }, [searchTerm]);

  // دالة البحث
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(localSearchTerm);
    }
  };

  // دالة تغيير الصفحة
  const handlePageClick = (page) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

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
        {/* سطر العنوان */}
        <div className="row gx-5 align-items-center mb--30">
          <div className="col-12">
            {sectionTitle && (
              <SectionTitle
                className="mb--0    "
                disableAnimation
                title={sectionTitle}
              />
            )}
          </div>
        </div>

        {/* سطر البحث وحقل اختيار العدد */}
        <div className="row gx-5 align-items-center mb--60">
          <div className="col-12">
            <div className="d-flex flex-column flex-md-row gap-3 align-items-stretch align-items-md-center justify-content-between">

              {/* حقل البحث */}
              {onSearch && (
                <form
                  onSubmit={handleSearchSubmit}
                  className="search-form d-flex flex-grow-1"
                  style={{ maxWidth: '500px' }}
                >
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control custom-search-input"
                      placeholder="ابحث في الخدمات..."
                      value={localSearchTerm}
                      onChange={(e) => setLocalSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSearchSubmit(e);
                        }
                      }}
                      style={{
                        borderRadius: '8px 0 0 8px',
                        border: '2px solid #e9ecef',
                        borderRight: 'none',
                        padding: '12px 15px',
                        fontSize: '14px',
                        backgroundColor: '#fff',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#007bff';
                        e.target.nextElementSibling.style.borderColor = '#007bff';
                        e.target.style.boxShadow = '0 0 0 0.2rem rgba(0,123,255,.25)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e9ecef';
                        e.target.nextElementSibling.style.borderColor = '#e9ecef';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary custom-search-btn"
                      style={{
                        borderRadius: '0 8px 8px 0',
                        padding: '12px 20px',
                        backgroundColor: '#007bff',
                        border: '2px solid #007bff',
                        fontSize: '14px',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#0056b3';
                        e.target.style.borderColor = '#0056b3';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#007bff';
                        e.target.style.borderColor = '#007bff';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      🔍 بحث
                    </button>
                  </div>
                </form>
              )}

              {/* حقل اختيار عدد العناصر */}
              {onPerPageChange && (
                <div className="per-page-selector d-flex align-items-center justify-content-center justify-content-md-end gap-2" style={{ minWidth: '200px' }}>
                  <label
                    htmlFor="perPageSelect"
                    className="form-label mb-0 text-nowrap"
                    style={{
                      fontSize: '14px',
                      color: '#666',
                      fontWeight: '500',
                      marginLeft: '8px'
                    }}
                  >
                    عرض:
                  </label>
                  <div className="select-wrapper position-relative">
                    <select
                      id="perPageSelect"
                      className="form-select custom-select"
                      value={perPage}
                      onChange={(e) => onPerPageChange(parseInt(e.target.value, 10))}
                      style={{
                        borderRadius: '8px',
                        border: '2px solid #e9ecef',
                        padding: '8px 35px 8px 12px',
                        fontSize: '14px',
                        minWidth: '70px',
                        backgroundColor: '#fff',
                        cursor: 'pointer',
                        appearance: 'none',
                        backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 8px center',
                        backgroundSize: '16px',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#007bff';
                        e.target.style.boxShadow = '0 0 0 0.2rem rgba(0,123,255,.25)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e9ecef';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <option value={6}>6</option>
                      <option value={12}>12</option>
                      <option value={18}>18</option>
                      <option value={24}>24</option>
                      <option value={30}>30</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                  <span
                    className="text-nowrap"
                    style={{
                      fontSize: '14px',
                      color: '#666',
                      fontWeight: '500',
                      marginRight: '8px'
                    }}
                  >
                    عنصر
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-12">
          <motion.div layout className="isotope-list item-4">
            {products?.map((prod) => (
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

          {/* Pagination Component */}
          {data?.products?.last_page > 1 && onPageChange && (
            <div className="row">
              <div className="col-lg-12">
                <nav className="pagination-wrapper" aria-label="Page navigation">
                  <ul className="pagination justify-content-center mt-4">
                    {/* Previous Button */}
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        type="button"
                        className="page-link"
                        onClick={() => handlePageClick(currentPage - 1)}
                        disabled={currentPage === 1}
                        style={{
                          borderRadius: '8px 0 0 8px',
                          border: '1px solid #ddd',
                          padding: '10px 15px',
                          backgroundColor: currentPage === 1 ? '#f8f9fa' : '#fff',
                          color: currentPage === 1 ? '#6c757d' : '#007bff'
                        }}
                      >
                        السابق
                      </button>
                    </li>

                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, data.products.last_page) }, (_, i) => {
                      let pageNum;
                      if (data.products.last_page <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= data.products.last_page - 2) {
                        pageNum = data.products.last_page - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                          <button
                            type="button"
                            className="page-link"
                            onClick={() => handlePageClick(pageNum)}
                            style={{
                              border: '1px solid #ddd',
                              padding: '10px 15px',
                              backgroundColor: currentPage === pageNum ? '#007bff' : '#fff',
                              color: currentPage === pageNum ? '#fff' : '#007bff'
                            }}
                          >
                            {pageNum}
                          </button>
                        </li>
                      );
                    })}

                    {/* Next Button */}
                    <li className={`page-item ${currentPage === data.products.last_page ? 'disabled' : ''}`}>
                      <button
                        type="button"
                        className="page-link"
                        onClick={() => handlePageClick(currentPage + 1)}
                        disabled={currentPage === data.products.last_page}
                        style={{
                          borderRadius: '0 8px 8px 0',
                          border: '1px solid #ddd',
                          padding: '10px 15px',
                          backgroundColor: currentPage === data.products.last_page ? '#f8f9fa' : '#fff',
                          color: currentPage === data.products.last_page ? '#6c757d' : '#007bff'
                        }}
                      >
                        التالي
                      </button>
                    </li>
                  </ul>

                  {/* Pagination Info */}
                  <div className="pagination-info text-center mt-3">
                    <small className="text-muted">
                      عرض {((currentPage - 1) * data.products.per_page) + 1} إلى {Math.min(currentPage * data.products.per_page, data.products.total)} من أصل {data.products.total} نتيجة
                    </small>
                  </div>
                </nav>
              </div>
            </div>
          )}
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
  onSearch: PropTypes.func,
  onPageChange: PropTypes.func,
  onPerPageChange: PropTypes.func,
  currentPage: PropTypes.number,
  searchTerm: PropTypes.string,
  perPage: PropTypes.number,
  data: PropTypes.shape({
    sectionId: PropTypes.number,
    parentSlug: PropTypes.string,
    products: PropTypes.oneOfType([
      PropTypes.arrayOf(
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
      PropTypes.shape({
        data: PropTypes.array,
        current_page: PropTypes.number,
        last_page: PropTypes.number,
        per_page: PropTypes.number,
        total: PropTypes.number
      })
    ]),
    placeBid: PropTypes.bool
  })
};

ExploreServiceArea.defaultProps = {
  space: 1
};

export default ExploreServiceArea;

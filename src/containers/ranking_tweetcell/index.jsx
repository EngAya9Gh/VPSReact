import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useState ,useEffect} from 'react';

const RankingArea = ({ className, space, data }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleRowClick = (uuid) => {
    router.push(`/order-details/${uuid}`);
  };

const [currency, setCurrency] = useState('TL');

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const savedCurrency = localStorage.getItem('currency') || 'TL';
        setCurrency(savedCurrency.toUpperCase());
      }
    }, []);



  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      numberingSystem: 'latn'
    });
  };

const filteredData = data
  .filter((order) => {
    const search = searchTerm.toLowerCase();
    return (
      (order.player_no && order.player_no.toLowerCase().includes(search)) ||
      (order.uuid && order.uuid.toLowerCase().includes(search))
    );
  })
  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div
      className={clsx(
        'rn-upcoming-area',
        space === 1 && 'rn-section-gapTop',
        className
      )}
    >
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="table-title-area d-flex">
              <i className="feather-briefcase" />
              <h3>طلباتي</h3>
            </div>

            {/* مربع البحث */}
            <div className="mb-3">
              <input
                type="text"
                className="form-control border-input withRadius"
                placeholder="    ابحث..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="box-table table-responsive">
              <table className="table upcoming-projects">
                <thead>
                  <tr>
                    <th><span>الخدمة</span></th>
                    <th><span>ايدي اللاعب </span></th>
                    <th><span>الحالة</span></th>
                    <th><span>ملاحظة</span></th>
                  </tr>
                </thead>
                <tbody className="ranking">
                  {filteredData.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => handleRowClick(order.uuid)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <span className="span_bold_req">{order.name}</span><br />
                        <span className="span_color_req">{order.type} : {order.price} {currency}</span>
                      </td>
                      <td><span>{order.player_no}</span></td>
                 
                      <td>
                        {order.status === 1 ? (
                          <span className="myspan_warn">⏳ قيد الانتظار</span>
                        ) : order.status === 2 ? (
                          <span className="myspan_suc">✅ تم الموافقة</span>
                        ) : order.status === 3 ? (
                          <span className="myspan_failed">❌ مرفوض</span>
                        ) : (
                          order.status
                        )}
                        <br />
                        <span className="span_bold_req">{formatDate(order.created_at)}</span>
                      </td>
                      <td><span>{order.reject_reason}</span></td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center">لا توجد نتائج مطابقة</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

RankingArea.propTypes = {
  className: PropTypes.string,
  space: PropTypes.number,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      count: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
};

RankingArea.defaultProps = {
  space: 1,
};

export default RankingArea;

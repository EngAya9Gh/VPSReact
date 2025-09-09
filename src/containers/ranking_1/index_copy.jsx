import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useRouter } from 'next/router';

const RankingArea = ({ className, space, data }) => {
  const router = useRouter();

  const handleRowClick = (uuid) => {
    router.push(`/order-details/${uuid}`);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    numberingSystem: 'latn' // استخدام الأرقام اللاتينية (الأرقام الإنجليزية)

    });
  };

  // ترتيب البيانات تنازليًا حسب تاريخ الإنشاء (من الأحدث إلى الأقدم)
  const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

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
            <div className="box-table table-responsive">
              <table className="table upcoming-projects">
                <thead>
                  <tr>
                    <th><span>الخدمة</span></th>
                    <th><span>الحالة</span></th>
                    <th><span>ملاحظة</span></th>
                  </tr>
                </thead>
                <tbody className="ranking">
                  {sortedData.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => handleRowClick(order.uuid)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <span className="span_bold_req">{order.name}</span><br />
                        <span className="span_color_req">{order.type} : {order.price} TL</span>
                      </td>
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

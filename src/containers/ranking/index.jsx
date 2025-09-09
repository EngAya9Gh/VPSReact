import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const RankingArea = ({ className, space, data }) => {
  const [sortedData, setSortedData] = useState([]);
  const [currency, setCurrency] = useState('TL');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCurrency = localStorage.getItem('currency') || 'TL';
      setCurrency(savedCurrency.toUpperCase());
    }
  }, []);
  useEffect(() => {
    // ترتيب البيانات حسب تاريخ الإنشاء من الأحدث إلى الأقدم
    const sorted = [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setSortedData(sorted);
  }, [data]);

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
              <h3>دفعاتي</h3>
            </div>
            <div className="box-table table-responsive">
              <table className="table upcoming-projects">
                <thead>
                  <tr>
                    <th>
                      <span>التفاصيل </span>
                    </th>
                    <th>
                      <span>الحالة</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="ranking">
                  {sortedData.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <span  className="span_bold_req">{order.firm_name}</span><br />
                         <span className="span_color_req">{order.value}{currency} : {order.created_at}</span>
                      </td>
                   <td>
                    <span className="myspan">
                      {order.status}
                      {order.remain_amount > 0 && ` (المبلغ المتبقي: ${order.remain_amount} ${order.currency})`}
                    </span>
                  </td>
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
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      firm_name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired
    })
  ).isRequired
};

RankingArea.defaultProps = {
  space: 1
};

export default RankingArea;

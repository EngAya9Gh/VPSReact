import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useState, useEffect } from 'react';

const RankingArea = ({ className, space, order }) => {
const [currency, setCurrency] = useState('TL');

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const savedCurrency = localStorage.getItem('currency') || 'TL';
        setCurrency(savedCurrency.toUpperCase());
      }
    }, []);

return(
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
            <h3>تفاصيل الطلب</h3>
          </div>
          <div className="box-table table-responsive">
            <table className="table upcoming-projects">
              <tbody className="ranking">
                {/* عرض جميع الحقول مع القيم */}
                {order.uuid && (
                  <tr key="uuid">
                    <td><span>رقم الطلب:</span></td>
                    <td><span>{order.uuid}</span></td>
                  </tr>
                )}
                    {order.name && (
                  <tr key="name">
                    <td><span>الخدمة :</span></td>
                    <td><span>{order.name}</span></td>
                  </tr>
                )}
                {order.price && (
                  <tr key="price">
                    <td><span>السعر:</span></td>
                    <td><span>{order.price} {currency}</span></td>
                  </tr>
                )}
                {order.username && (
                  <tr key="username">
                    <td><span>اسم المستخدم:</span></td>
                    <td><span>{order.username}</span></td>
                  </tr>
                )}
                {order.password && (
                  <tr key="password">
                    <td><span>كلمة المرور:</span></td>
                    <td><span>{order.password}</span></td>
                  </tr>
                )}
                {order.email && (
                  <tr key="email">
                    <td><span>البريد الإلكتروني:</span></td>
                    <td><span>{order.email}</span></td>
                  </tr>
                )}
                {order.ime && (
                  <tr key="ime">
                    <td><span>IME:</span></td>
                    <td><span>{order.ime}</span></td>
                  </tr>
                )}
                {order.count !== null && order.count !== undefined && (
                  <tr key="count">
                    <td><span>العدد:</span></td>
                    <td><span>{order.count}</span></td>
                  </tr>
                )}
                {order.note && (
                  <tr key="note">
                    <td><span>الملاحظات:</span></td>
                    <td><span>{order.note}</span></td>
                  </tr>
                )}
                {order.status && (
                  <tr key="status">
                    <td><span> الحالة: </span> </td>
                    <td>   
                       {order.status === 1 ? (
                          <span className="myspan_warn">⏳ قيد الانتظار</span>
                        ) : order.status === 2 ? (
                          <span className="myspan_suc">✅ تم الموافقة</span>
                        ) : order.status === 3 ? (
                          <span className="myspan_failed">❌ مرفوض</span>
                        ) : (
                          order.status
                        )}</td>
                  </tr>
                )}
                {order.created_at && (
                  <tr key="created_at">
                    <td><span> تاريخ الطلب:</span></td>
                    <td><span> {order.created_at}</span></td>
                  </tr>
                )}
            
            
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
)};

RankingArea.propTypes = {
  className: PropTypes.string,
  space: PropTypes.number,
  order: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    username: PropTypes.string,
    password: PropTypes.string,
    email: PropTypes.string,
    ime: PropTypes.string,
    note: PropTypes.string,
    uuid: PropTypes.string,
    image_url: PropTypes.string,
  }).isRequired,
};

RankingArea.defaultProps = {
  space: 1
};

export default RankingArea;

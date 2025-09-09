import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

const RankingArea = ({ className, space, data, mobile }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (showForm && mobile) {
      setPhoneNumber(mobile);
    }
  }, [showForm, mobile]);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const token = localStorage.getItem('token');

  const handleRowClick = (order) => {
    setSelectedService(order);
    setShowForm(true);
  };

  const handlePhoneNumberChange = (event) => {
    let value = event.target.value;

    // إزالة أي حروف غير أرقام
    value = value.replace(/\D/g, '');

    // تأكد أن الرقم يبدأ بـ05
    if (!value.startsWith('05')) {
      value = `05${value.replace(/^0*/, '')}`;
    }

    // حصر الطول إلى 11 خانة
    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    setPhoneNumber(value);
  };

  const handlePurchase = async () => {
    if (!phoneNumber || !selectedService) {
      setErrorMessage('يرجى إدخال رقم الهاتف واختيار الخدمة.');
      return;
    }

    if (phoneNumber.length !== 11) {
      setErrorMessage('رقم الهاتف يجب أن يكون مكوناً من 11 رقماً.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
console.log(selectedService);
      const response = await axios.post(
        `${apiBaseUrl}/kontor/order/${selectedService.id}`,
        {
          mobile: phoneNumber,
          tweetcell_kontor_id: selectedService.id,
          price: selectedService.price,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const msg = response.data.message || 'حدث خطأ أثناء شراء الخدمة.';
      setErrorMessage(msg);

      if (msg === 'جاري معالجة الطلب...') {
        setTimeout(() => {
          setShowForm(false);
          setSelectedService(null);
          setPhoneNumber('');
          setErrorMessage('');
        }, 5000);
      }
    } catch (error) {
      if (error.response) {
        console.log('تفاصيل الخطأ من السيرفر:', error.response.data);
        console.log('كود الحالة:', error.response.status);
        console.log('الهيدر:', error.response.headers);
      } else if (error.request) {
        console.log('الطلب تم إرساله ولكن لم يتم الرد عليه:', error.request);
      } else {
        console.log('حدث خطأ أثناء إعداد الطلب:', error.message);
      }

      setErrorMessage('فشل الاتصال بالخادم. يرجى المحاولة لاحقاً.');
    } finally {
      setIsLoading(false);
    }
  };

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
            {showForm ? (
              <div className="form-wrapper-one product-style-one">
                <div>
                  <p>اسم الباقة: {selectedService.name}</p>
                  <p>السعر: {selectedService.price} TL</p>
                </div>
                <div className="mb-5">
                  <input
                    type="text"
                    placeholder="05XXXXXXXX"
                    name="mobile"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    className="withRadius"
                  />
                </div>

                <div className="mb-5">
                  <button
                    type="button"
                    onClick={handlePurchase}
                    className="withRadius"
                    disabled={isLoading || phoneNumber.length !== 11}
                  >
                    {isLoading ? 'جاري الشراء...' : 'شراء'}
                  </button>
                </div>

                {errorMessage && (
                  <div className="error-message">{errorMessage}</div>
                )}
              </div>
            ) : (
              <div className="box-table table-responsive table-packeges">
                <table className="table upcoming-projects">
                  <tbody className="ranking">
                    

                <div
                  className="grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '15px',
                  }}
                >
                    {data.map((order) => (
                      <tr key={order.id}>
                        <td>
                       <button
                        type="button"
                        onClick={() => handleRowClick(order)}
                        className={`service-link ${order.is_firsat ? 'firsat_color' : ''}`}
                      >
                        <span className="order-name">{order.name}</span>
                        <span className="price">{order.price} TL</span>
                      </button>
                        </td>
                         
                      </tr>
                    ))}
                    </div>
                  </tbody>
                </table>
              </div>
            )}
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
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
};

RankingArea.defaultProps = {
  space: 1,
};

export default RankingArea;

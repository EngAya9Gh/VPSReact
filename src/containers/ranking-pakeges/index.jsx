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
  const [currency, setCurrency] = useState('TL');

      useEffect(() => {
        if (typeof window !== 'undefined') {
          const savedCurrency = localStorage.getItem('currency') || 'TL';
          setCurrency(savedCurrency.toUpperCase());
        }
      }, []);


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
                  <p>السعر: {selectedService.price} {currency}</p>
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
              <div className="box-table table-responsive table-packeges my-box-table">
                <div
            className="grid grid-kon"
          
          >
            {data.map((order) => (
              <div
                key={order.id}
             className="col-kon"
              >
                <button
                  type="button"
                  onClick={() => handleRowClick(order)}
                  className={`service-link ${order.is_firsat ? 'firsat_color' : ''}`}
                  style={{ width: '100%' }}
                >
                  <span className="order-name">{order.name}</span>
                
                  {order.sale_price?.amount !== 0 ? (
                    <>
                      <span className="price price-kon">
                      {currency}  سعر الشراء: {order.price}
                        <br />
                        <span style={{ color: '#ffe06e' }}>
                      {currency}    سعر البيع: {order.sale_price} 
                        </span>
                      </span>

                    </>
                  ) : (
                    <span className="latest-bid">
                  {currency}    السعر: {order.price} 
                    </span>
                )}
                  
                </button>
              </div>
            ))}
          </div>
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

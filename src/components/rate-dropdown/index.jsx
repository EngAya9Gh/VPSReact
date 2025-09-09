import PropTypes from 'prop-types';
import Anchor from '@ui/anchor';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

const UserDropdown = ({ baseCurrency = 'USD' }) => {
    const [rates, setRates] = useState([]);
    const [loading, setLoading] = useState(true);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const fetchExchangeRates = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/get-rates/${baseCurrency}`);
            setRates(response.data.rates || []);
        } catch (error) {
            console.error('فشل في جلب أسعار العملات:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExchangeRates(); // أول تحميل

        const interval = setInterval(() => {
            fetchExchangeRates(); // تحديث دوري
        }, 30000); // كل 30 ثانية

        return () => clearInterval(interval); // إلغاء عند إزالة التركيب
    }, [baseCurrency]);

    return (
        <div className="icon-box">
            <div className="icon-box notification-icon">
                <Anchor path="#">
                    <div className="feather feather feather-dollar-sign my-dollar ">
                    
                    </div>
                </Anchor>
            </div>

            <div className="rn-dropdown myrate max-h-96 overflow-y-auto min-w-[220px]">
                {loading ? (
                    <div className="p-3 text-center text-gray-500">جاري التحميل...</div>
                ) : rates.length === 0 ? (
                    <div className="p-3 text-center text-gray-500">لا توجد بيانات حالياً</div>
                ) : (
                    rates.map((rate, index) => (
                        <div key={index} className="rn-inner-top border-b p-3 text-sm">
                            <strong>{rate.code}</strong>: {rate.rate}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

UserDropdown.propTypes = {
    baseCurrency: PropTypes.string
};

export default UserDropdown;

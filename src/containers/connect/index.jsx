import PropTypes from 'prop-types';
import clsx from 'clsx';
import Wallet from '@components/wallet';
import axios from 'axios';
import { useEffect, useState } from 'react';

const ConnectArea = ({ className, space }) => {
    const [mydata, setMyData] = useState({ financials: {} });
    const [message, setMessage] = useState(''); // لتخزين الرسالة

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const storedToken = localStorage.getItem('token');

                const result = await axios.get(`${apiBaseUrl}/myWallet`, {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                     },
                });
                setMyData(result.data);
            } catch (error) {
                console.error("Error fetching wallet data:", error);
            }
        };

        fetchData();

        // قراءة الرسالة المخزنة بعد تحميل الصفحة
        const successMessage = sessionStorage.getItem('successMessage');
        if (successMessage) {
            setMessage(successMessage);
            sessionStorage.removeItem('successMessage'); // حذف الرسالة بعد قراءتها
        }
    }, []);

    const handleGetProfit = async () => {
        try {
            const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const storedToken = localStorage.getItem('token');

            // استدعاء الروت '/getProfit'
            const result = await axios.get(`${apiBaseUrl}/getProfit`, {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                },
            });
            console.log('Profit data:', result.data);

            // تخزين رسالة النجاح
            sessionStorage.setItem('successMessage', 'تم إضافة الرصيد بنجاح!');
            
            // إعادة تحميل الصفحة
            window.location.reload();  
        } catch (error) {
            console.error("Error fetching profit data:", error);
        }
    };

    return (
        <div
            className={clsx(
                'rn-connect-area',
                space === 1 && 'rn-section-gapTop',
                className
            )}
        >
            <div className="container">
                <div className="row g mb--50 mb_md--30 mb_sm--30 align-items-center"></div>
               {/* عرض رسالة النجاح إذا كانت موجودة */}
            {message && (
                <div className="alert alert-success mt-3">
                    {message}
                </div>
            )}
                <div className="row g-5">
                    <div className="col-lg-12">
                        <div className="row g-5">
                            <div className="d-flex align-items-center">
                                <Wallet
                                    title="الربح"
                                    description={`${mydata?.financials?.profit || 0} TL`}
                                    path="#"
                                    icon="feather feather-trending-up"
                                    color="purple"
                                />
                                {mydata?.financials?.profit >= 100 && (  // تحقق من الربح إذا كان أكبر أو يساوي 100
                                    <button
                                        onClick={handleGetProfit}
                                        className="btn btn-primary"
                                        type="button"
                                    >
                                        سحب الرصيد
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="row g-5">
                            <Wallet
                                title="الصادر"
                                description={`${mydata?.financials?.outgoing || 0} TL`}
                                path="#"
                                icon="feather feather-trending-up"
                                color="purple"
                            />
                            <Wallet
                                title="الوارد"
                                description={`${mydata?.financials?.incoming || 0} TL`}
                                path="#"
                                icon="feather feather-trending-down"
                                color="pink"
                            />
                            <Wallet
                                title="الرصيد الحالي"
                                description={`${mydata?.financials?.balance || 0} TL`}
                                path="#"
                                icon="feather feather-dollar-sign"
                                color="yellow"
                            />
                            <Wallet
                                title="المدين"
                                description={`${mydata?.financials?.debts || 0} TL`}
                                path="#"
                                icon="feather-command"
                                color="green"
                            />
                            <Wallet
                                title="اجمالي الارباح"
                                description={`${mydata?.financials?.profitTotals || 0} TL`}
                                path="#"
                                icon="feather-cpu"
                                color="blue"
                            />
                        </div>
                    </div>
                </div>
            </div>

           
        </div>
    );
};

ConnectArea.propTypes = {
    className: PropTypes.string,
    space: PropTypes.oneOf([1]),
};

ConnectArea.defaultProps = {
    space: 1,
};

export default ConnectArea;

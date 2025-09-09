/* eslint-disable @next/next/no-img-element */ 
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Button from '@ui/button';
import { convertIndianNumbersToArabic } from '@utils/convertIndianNumbersToArabic';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router'; // استيراد useRouter

const CreateNewArea = ({ className, space, data }) => {

  const [value1, setValue1] = useState(''); // قيمة الإدخال
  const [convertedValue, setConvertedValue] = useState(''); // القيمة المحولة
  const [conversionRates, setConversionRates] = useState({}); // أسعار الصرف
  const [currency, setCurrency] = useState('TL');

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const savedCurrency = localStorage.getItem('currency') || 'TL';
        setCurrency(savedCurrency.toUpperCase());
      }
    }, []);
  const [transferOrderField, setTransferOrderField] = useState({
    transfer_money_firm_id: data ? data.id : '',
    user_id: '',
    sender: '',
    value: 0,
    amount: 0,
    currency: 'TRY',
    dekont_no: '',
    password: '',
    account_salary_name: '',
    account_salary_id: '',
    process_no: ''
  });

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const router = useRouter(); // استخدام useRouter

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    const getUserData = async () => {
      try {
        const response = await axios.get(
          `${apiBaseUrl}/logged-in-user`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setTransferOrderField((prevFields) => ({
          ...prevFields,
          user_id: response.data.id
        }));
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };
    getUserData();

    // جلب أسعار الصرف من API عند تحميل المكون
    const fetchExchangeRates = async () => {
      try {
        const reqUrl = 'https://v6.exchangerate-api.com/v6/65f10e2a66567d29f338abc6/latest/TRY';
        const response = await fetch(reqUrl);
        const data = await response.json();

        if (data.result === 'success') {
          setConversionRates(data.conversion_rates); // تخزين أسعار الصرف
        } else {
          console.error('Failed to fetch exchange rate data');
        }
      } catch (error) {
        console.error('Error fetching the exchange rate:', error);
      }
    };

    fetchExchangeRates();

  }, []);

 const handleValueChange = (e) => {
  let inputValue = e.target.value;

  // التحقق مما إذا كان المدخل يحتوي فقط على أرقام وفاصلة عشرية واحدة
  if (/^\d*\.?\d*$/.test(inputValue)) {
    // تحويل الأرقام الهندية إلى الأرقام العربية (إذا كانت هناك حاجة لذلك)
    inputValue = convertIndianNumbersToArabic(inputValue);
    setValue1(inputValue);

    // حساب القيمة المحولة
    if (conversionRates[currency]) {
      const converted = (inputValue / conversionRates[currency]).toFixed(2); // تحويل إلى TRY
      setConvertedValue(converted);

      setTransferOrderField((prevFields) => ({
        ...prevFields,
        amount: inputValue,
        value: converted // تحديث القيمة المحولة
      }));
    }
  } else {
    // إذا كانت المدخلات غير صالحة (تحتوي على حروف أو رموز غير أرقام)، لا تقوم بتحديث الحالة
    // يمكنك إضافة أي رد فعل آخر هنا مثل رسالة خطأ للمستخدم إذا أردت
    console.log('يرجى إدخال رقم صحيح');
  }
};

  // تحديث العملة المختارة عند تغييرها
  const handleCurrencyChange = (e) => {
    const selectedCurrency = e.target.value;
    setCurrency(selectedCurrency); // تخزين العملة المختارة

    // تحديث القيمة المحولة عند تغيير العملة
    if (conversionRates[selectedCurrency] && value1) {
      const converted = (value1 / conversionRates[selectedCurrency]).toFixed(2); // تحويل إلى TRY
      setConvertedValue(converted); // حفظ القيمة المحولة

      setTransferOrderField((prevFields) => ({
        ...prevFields,
        currency: selectedCurrency, // تخزين العملة في البيانات التي سيتم إرسالها
        value: converted // تحديث القيمة المحولة
      }));
    }
  };

  const handle = (e) => {
    const { name, value } = e.target ? e.target : e;
    setTransferOrderField((prevFields) => ({
      ...prevFields,
      [name]: value
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    console.log(transferOrderField);
    try {
      const r = await axios.post(
        `${apiBaseUrl}/charge`,
        transferOrderField,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast('تم تسجيل طلبك');
     setTimeout(() => {
      router.push('/');
    }, 3000);  
    } catch (error) {
      if (error.response) {
        console.log('Error Data:', error.response.data);
        console.log('Error Status:', error.response.status);
        console.log('Error Headers:', error.response.headers);
      }
    }
  };

  return (
    <div
      className={clsx(
        'create-area ',
        space === 1 && 'rn-section-gapTop mysection',
        className
      )}
    >
      <form action="#" name="myform">
        <div className="container">
          <div className="row g-5">
            <div className="mt--100 mt_sm--30 mt_md--30 d-lg-block">
              <div className="col-md-6">
                {[19, 20].includes(data.id) ? (
                  <div className="input-box pb--20">
                    <p>يرجى تأكيد الراتب الى الحساب :</p>
                    <input
                      id="iban"
                      name="iban"
                      disabled
                      value={data.iban}
                    />
                  </div>
                ) : (
                  <div className="input-box pb--20">
                    <p>
                      يرجى إرسال المبلغ إلى هذا الحساب:{' '}
                    </p>
                    <input
                      disabled
                      value={data.iban}
                      name="iban"
                      id="iban"
                    />
                  </div>
                )}

                <p className="noteBank">{data.note}</p>
              </div>
            </div>
          </div>
        </div>
      </form>

      <div className="container">
        <div className="row g-5 ">
          <div className="col-lg-3 offset-1 ml_md--0 ml_sm--0 ">
            <div className="upload-area mymargin-top">
              <div className="upload-formate mb--30 ">
                <h6 className="title">هام جداً</h6>
                <p className="formate">
                  يرجى ارسال اشعار التحويل.... قبل تعبئة
                  الاستمارة
                </p>
              </div>

              <div className="brows-file-wrapper">
                <a href="https://api.whatsapp.com/send/?phone=905392065497&text&type=phone_number&app_absent=0"
                   target="_blank" rel="noopener noreferrer">
                  <i className="feather-upload myicon" />
                  <p className="text-center mt--10">
                    ارسال الاشعار عبر الواتس اب
                  </p>
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="form-wrapper-one">
              <div className="row">
                <form name="form_change">
                  <div className="col-md-12">
                    {[1, 15, 16, 14].includes(data.id) ? (
                      <div className="input-box pb--20">
                        <input
                          id="sender"
                          placeholder="اسم المرسل"
                          name="sender"
                          onChange={handle}
                          className=" withRadius"
                        />
                      </div>
                    ) : null}
                  </div>

                  <div className="col-md-12">
                    {[15, 16].includes(data.id) ? (
                      <div className="input-box pb--20">
                        <input
                          id="process_no"
                          placeholder="رقم العملية"
                          name="process_no"
                          onChange={handle}
                          className=" withRadius"
                        />
                      </div>
                    ) : null}
                  </div>

                  <div className="col-md-12">
                    {[4, 5, 6, 7, 8].includes(data.id) ? (
                      <div className="input-box pb--20">
                        <input
                          id="dekont_no"
                          placeholder="لتسهيل عملية التحويل يرجى ادخال رمز الاشعار"
                          name="dekont_no"
                          onChange={handle}
                          className=" withRadius"
                        />
                      </div>
                    ) : null}
                  </div>

                  <div className="col-md-12">
                    {[4, 5, 6, 7, 8].includes(data.id) ? (
                      <div className="input-box pb--20">
                        <input
                          id="password"
                          placeholder=" لتسهيل عملية السحب يرجى ادخال الرقم السري"
                          name="password"
                          onChange={handle}
                          className=" withRadius"
                        />
                      </div>
                    ) : null}
                  </div>

                  {[19, 20].includes(data.id) && (
                    <>
                      <div className="col-md-12">
                        <div className="input-box pb--20">
                          <input
                            id="account_salary_id"
                            placeholder="ايدي المستخدم"
                            name="account_salary_id"
                            onChange={handle}
                            className=" withRadius"
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="input-box pb--20">
                          <input
                            id="account_salary_name"
                            placeholder="اسم المستخدم"
                            name="account_salary_name"
                            onChange={handle}
                            className=" withRadius"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="col-md-12">
                    <div className="input-box pb--20">
                      <input
                        className="myinput70 withRadius"
                        id="value_1"
                        placeholder="القيمة"
                        name="value_1"
                        value={value1}
                        onChange={handleValueChange}
                      />

                      <select 
                        name="currency" 
                        className="myinput25 withRadius" 
                        onChange={handleCurrencyChange} 
                        value={currency}>
                        <option value="TRY">TRY</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>

                    <div className="input-box pb--20">
                      <input
                        className="withRadius"
                        id="value"
                        placeholder=" القيمة المرسلة"
                        name="value"
                        value={convertedValue} // عرض القيمة المحولة
                        onChange={handle}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="col-md-12 col-xl-8 mt_lg--15 mt_md--15 mt_sm--15">
                    <div className="input-box">
                      <Button 
                        className=" withRadius"
                        type="submit"
                        id="submit"
                        fullwidth
                        onClick={onSubmit}
                      >
                        طلب
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CreateNewArea.propTypes = {
  className: PropTypes.string,
  space: PropTypes.oneOf([1]),
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    iban: PropTypes.string,
    note: PropTypes.string
  }).isRequired
};

CreateNewArea.defaultProps = {
  space: 1
};

export default CreateNewArea;

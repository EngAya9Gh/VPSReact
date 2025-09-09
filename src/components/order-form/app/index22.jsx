import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "@ui/button";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const OrderForm = ({ app }) => {
  const router = useRouter();
  const [user, setUser] = useState({});
  const [deviceInfo, setDeviceInfo] = useState({});
  const [selectedQty, setSelectedQty] = useState(null);

  // ✅ السعر النهائي يبدأ بسعر الواحدة
  const [finalPrice, setFinalPrice] = useState(() =>
    Number(app?.price_unite || 0)
  );

  const [appField, setAppField] = useState({
    user_id: "",
    product_id: app?.product_id || "",
    player_no: app?.param || "",
    tweetcell_id: app ? app.id : "",
    oyun_id: app ? app.player_no : "",
    price: Number(app?.price_unite || 0), // ✅
    kupur: app ? Number(app.amount || 1) : 1,
    qty: 1,
    device_info: {},
  });

  const [isDisabled, setIsDisabled] = useState(false);
  const [currency, setCurrency] = useState("TL");

  const storedToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // جلب العملة
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCurrency = localStorage.getItem("currency") || "TL";
      setCurrency(savedCurrency.toUpperCase());
    }
  }, []);

  // جلب بيانات المستخدم + البصمة
  useEffect(() => {
    const getUserDataAndDevice = async () => {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axios.get(`${apiBaseUrl}/logged-in-user`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setUser(response.data);

        const fp = await FingerprintJS.load();
        const result = await fp.get();
        setDeviceInfo({
          userAgent: navigator.userAgent,
          fingerprint: result.visitorId,
        });
      } catch (err) {
        console.error("Error fetching user/device info", err);
      }
    };
    getUserDataAndDevice();
  }, []);

  // تحديث الحقول عند توفر البيانات
  useEffect(() => {
    if (user && Object.keys(deviceInfo).length > 0) {
      setAppField((prev) => ({
        ...prev,
        user_id: user.id,
        device_info: deviceInfo,
      }));
    }
  }, [user, deviceInfo]);

  // تحديد qty_values
  const qtyValues = (() => {
    if (!app.qty_values) return null;
    if (Array.isArray(app.qty_values)) return app.qty_values;
    if (typeof app.qty_values === "object") return app.qty_values;
    if (typeof app.qty_values === "string") {
      try {
        return JSON.parse(app.qty_values);
      } catch {
        return app.qty_values.split(",").map(Number);
      }
    }
    return null;
  })();

  // حساب السعر النهائي (price_unite × الكمية)
  useEffect(() => {
    let kupur = selectedQty || 1;

    if (qtyValues && typeof qtyValues === "object" && qtyValues.min) {
      kupur = selectedQty || parseFloat(qtyValues.min);
    }

    const pricePerUnit = parseFloat(app.price_unite) || 0; // ✅ سعر الواحدة
    const totalPrice = pricePerUnit * kupur;

    setFinalPrice(totalPrice);

    setAppField((prev) => ({
      ...prev,
      kupur,
      qty: kupur,
      price: Number(totalPrice) || 0, // ✅ السعر النهائي
    }));
  }, [selectedQty, app.price_unite, qtyValues]);

  const changeAppFieldHandler = (e) => {
    const { name, value } = e.target;
    setAppField((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isDisabled) return;
    setIsDisabled(true);
console.log('here:',appField);
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const result = await axios.post(
        `${apiBaseUrl}/tweetcell/order/${app.id}`,
        appField,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );

      toast.success(result.data.message);
      setTimeout(() => router.push("/"), 3000);
    } catch (error) {
      console.error("Error:", error);
      toast.error("فشل في تسجيل الطلب، يرجى المحاولة مرة أخرى");
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <div className="form-wrapper-one registration-area">
      <form onSubmit={onSubmit}>
        <h3 className="mb--30">
          اتمام عملية الشراء — السعر:{" "}
          {Number(finalPrice || 0).toFixed(2)} {currency}
        </h3>

        {/* إذا qtyValues مصفوفة */}
        {Array.isArray(qtyValues) && (
          <div className="mb-5">
            <label htmlFor="qty_select" className="form-label">
              اختر الكمية
            </label>
            <select
              id="qty_select"
              className="withRadius"
              onChange={(e) =>
                setSelectedQty(parseInt(e.target.value, 10))
              } // ✅ أقواس
            >
              <option value="">اختر</option>
              {qtyValues.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* إذا qtyValues object */}
        {qtyValues &&
          typeof qtyValues === "object" &&
          qtyValues.min &&
          qtyValues.max && (
            <div className="mb-5">
              <label htmlFor="qty_input" className="form-label">
                أدخل الكمية (من {qtyValues.min} إلى {qtyValues.max})
              </label>
              <input
                id="qty_input"
                type="number"
                className="withRadius"
                min={qtyValues.min}
                max={qtyValues.max}
                value={selectedQty || qtyValues.min}
                onChange={(e) => {
                  let val = parseInt(e.target.value, 10);
                  if (val < qtyValues.min) val = qtyValues.min;
                  if (val > qtyValues.max) val = qtyValues.max;
                  setSelectedQty(val);
                }}
              />
            </div>
          )}

        {/* إذا كانت player_no موجودة */}
        {app.param && (
          <div className="mb-5">
        
            <input
              className="withRadius"
              type="text"
              id="player_no"
              name="player_no"
              required
              placeholder={app.param}
              onChange={changeAppFieldHandler}
            />
          </div>
        )}

        <Button type="submit" size="medium" disabled={isDisabled}>
          {isDisabled ? "جاري الإرسال..." : "شراء"}
        </Button>
      </form>
      <ToastContainer />
    </div>
  );
};

OrderForm.propTypes = {
  app: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    price_unite: PropTypes.oneOfType([PropTypes.number, PropTypes.string]) // ✅ بدل price
      .isRequired,
    param: PropTypes.any,
    qty_values: PropTypes.any,
  }).isRequired,
};

export default OrderForm;

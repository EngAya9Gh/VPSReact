import React, { createContext, useState, useContext, useMemo } from 'react';

// إنشاء الـ Context
const MobileContext = createContext();

// هوك لاستهلاك الـ Context في المكونات الأخرى
export const useMobile = () => useContext(MobileContext);

// مكون Provider لتوفير القيمة لبقية التطبيق
export const MobileProvider = ({ children }) => {
    const [mobile, setMobile] = useState('');

    // استخدام useMemo لتخزين القيمة الثابتة
    const contextValue = useMemo(() => ({ mobile, setMobile }), [mobile]);

    return (
        <MobileContext.Provider value={contextValue}>
            {children}
        </MobileContext.Provider>
    );
};

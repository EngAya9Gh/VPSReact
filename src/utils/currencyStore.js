// src/utils/currencyStore.js

let currentCurrency = "TL"; // العملة الافتراضية

export const getCurrency = () => currentCurrency;

export const setCurrency = (currency) => {
  currentCurrency = currency;
};

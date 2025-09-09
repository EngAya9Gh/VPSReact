// utils/convertIndianNumbersToArabic.js

export const convertIndianNumbersToArabic = (input) => {
  const indianDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const arabicDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  return input.split('').map((char) => { // إضافة الأقواس حول المعامل
    const index = indianDigits.indexOf(char);
    return index !== -1 ? arabicDigits[index] : char;
  }).join('');
};

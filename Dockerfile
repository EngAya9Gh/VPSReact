# استخدام Node.js كـ base image
FROM node:20-alpine

# تعيين مجلد العمل
WORKDIR /app

# نسخ package.json و package-lock.json
COPY package*.json ./

# تثبيت dependencies
RUN npm install

# نسخ باقي الملفات
COPY . .

# تعيين متغير البيئة للتطوير
ENV NODE_ENV=development

# فتح المنفذ 3000
EXPOSE 3000

# تشغيل التطبيق في وضع التطوير
CMD ["npm", "run", "dev"]

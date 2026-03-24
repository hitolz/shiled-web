FROM dockerhub.test.wacai.info/xianglong/shield-web-cache:2.0
WORKDIR /app/program/shield-web
COPY . .
RUN ls -rtl
RUN npm install
RUN npm run build
CMD ["npm","run","start"]
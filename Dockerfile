FROM dockerhub.test.wacai.info/xianglong/shield-web-cache:1.0
WORKDIR /app/program/shield-web
COPY . .
RUN npm install
RUN npm run build
CMD ["npm","run","start"]
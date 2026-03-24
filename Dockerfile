FROM dockerhub.test.wacai.info/xianglong/shield-web-cache:1.0
WORKDIR /app/program/shield-web

ARG NEXT_PUBLIC_BASE_URL=/shield-web
ARG SERVER_TARGET=
ARG APP_URL_PREFIX=/api

ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
ENV SERVER_TARGET=${SERVER_TARGET}
ENV APP_URL_PREFIX=${APP_URL_PREFIX}

COPY . .
RUN npm install
RUN npm run build
CMD ["npm","run","start"]

# docker buildx build --no-cache --platform linux/amd64 -t dockerhub.test.wacai.info/xianglong/shield-web-cache:1.0 --load .
# docker build --no-cache -t dockerhub.test.wacai.info/xianglong/shield-web-cache:1.0 --load .

docker buildx build --no-cache --platform linux/amd64 -t dockerhub.test.wacai.info/xianglong/shield-web:1.0 --load .
# docker push dockerhub.test.wacai.info/xianglong/shield-web-cache:1.0
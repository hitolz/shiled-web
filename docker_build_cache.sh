# docker buildx build --no-cache --platform linux/amd64 -t dockerhub.test.wacai.info/xianglong/shield-web-cache:2.0 -f Dockerfile_cache .
# docker build --no-cache -t dockerhub.test.wacai.info/xianglong/shield-web-cache:1.0 -f Dockerfile_cache --load .
docker push dockerhub.test.wacai.info/xianglong/shield-web-cache:2.0
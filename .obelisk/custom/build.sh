#!/bin/sh
tar -czvf shield-web.tar.gz --exclude=node_modules --exclude=.next --exclude=nohup.out *
mkdir .build
cp shield-web.tar.gz .build
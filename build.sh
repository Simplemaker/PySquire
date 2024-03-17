#!/bin/bash

npm install
if [ ! -f "./config.json" ]; then
    cp "./demo-config.json" "./config.json"
fi
openssl genrsa -out private_key.pem 4096
openssl rsa -pubout -in private_key.pem -out public_key.pem
npm run build

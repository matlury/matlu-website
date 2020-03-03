#!/bin/bash
npm install
rm -rf .cache
rm -rf public
npm run clean
npm run build
DIR="public"
if [ -d "$DIR" ]; then
    cd $DIR
    aws s3 cp --recursive . s3://$S3_BUCKET_NAME
else
    echo "Error: ${DIR} not found. Deploy aborted."
    exit 1
fi

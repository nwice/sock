node ./src/supply.js
aws s3 cp ./public/supply.html s3://beta.scewpt.com/supply --acl public-read --content-type text/html
aws s3 cp ./public/supply.json s3://beta.scewpt.com/supply.json --acl public-read --content-type application/json
aws cloudfront create-invalidation --distribution-id E11ZCATVMKXF7D --paths "/supply" "/supply.json"
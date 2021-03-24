node ./src/supply.js
aws s3 cp ./public/supply.html s3://beta.scewpt.com/supply --acl public-read --content-type "text/html; charset=utf-8"
aws s3 cp ./public/supply_with_uptick.html s3://beta.scewpt.com/supply_with_uptick --acl public-read --content-type "text/html; charset=utf-8"
aws s3 cp ./public/supply.json s3://beta.scewpt.com/supply.json --acl public-read --content-type application/json
aws cloudfront create-invalidation --distribution-id E11ZCATVMKXF7D --paths "/supply" "/supply_with_uptick" "/supply.json"
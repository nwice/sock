node ./src/supply.js
aws s3 cp ./public/supply_with_uptick.html s3://beta.scewpt.com/supply --acl public-read --content-type "text/html; charset=utf-8"
aws cloudfront create-invalidation --distribution-id E11ZCATVMKXF7D --paths "/supply" "/supply/snob.json"
aws cloudfront create-invalidation --distribution-id E1JZNMX0HG4856 --paths "/supply" "/supply/snob.json"

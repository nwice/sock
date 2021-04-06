node ./src/supply.js
aws s3 cp ./public/supply_with_uptick.html s3://beta.scewpt.com/supply --acl public-read --content-type "text/html; charset=utf-8"
aws s3 cp ./public/supply_with_uptick.html s3://powder.network/supply --acl public-read --content-type "text/html; charset=utf-8"

aws s3 cp ./public/defisupply.js s3://beta.scewpt.com/defisupply.js --acl public-read --content-type "text/javascript"
aws s3 cp ./public/defisupply.js s3://analytics.snowball.network/defisupply.js --acl public-read --content-type "text/javascript"
aws s3 cp ./public/defisupply.js s3://powder.network/defisupply.js --acl public-read --content-type "text/javascript"

aws cloudfront create-invalidation --distribution-id E11ZCATVMKXF7D --paths "/defisupply.js" "/supply" "/supply/snob.json" "/snob/circulating"
aws cloudfront create-invalidation --distribution-id E1JZNMX0HG4856 --paths "/defisupply.js" "/supply" "/supply/snob.json" "/snob/circulating"
aws cloudfront create-invalidation --distribution-id E94H37WVV1OQY --paths "/defisupply.js" "/supply" "/supply/snob.json"

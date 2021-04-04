aws s3 cp ./public/price_with_uptick.html s3://beta.scewpt.com/price --acl public-read --content-type "text/html; charset=utf-8"
aws s3 cp ./public/price_with_uptick.html s3://analytics.snowball.network/price --acl public-read --content-type "text/html; charset=utf-8"
aws s3 cp ./public/price_with_uptick.html s3://powder.network/price --acl public-read --content-type "text/html; charset=utf-8"

aws s3 cp ./public/defiprice.js s3://beta.scewpt.com/defiprice.js --acl public-read --content-type "text/javascript"
aws s3 cp ./public/defiprice.js s3://analytics.snowball.network/defiprice.js --acl public-read --content-type "text/javascript"
aws s3 cp ./public/defiprice.js s3://powder.network/defiprice.js --acl public-read --content-type "text/javascript"

aws cloudfront create-invalidation --distribution-id E11ZCATVMKXF7D --paths "/price" "/defiprice.js"
aws cloudfront create-invalidation --distribution-id E1JZNMX0HG4856 --paths "/price" "/defiprice.js"
aws cloudfront create-invalidation --distribution-id E94H37WVV1OQY --paths "/price" "/defiprice.js"

node ./src/price.js

aws s3 cp ./public/price_with_uptick.html s3://beta.scewpt.com/price --acl public-read --content-type "text/html; charset=utf-8"
aws s3 cp ./public/price_with_uptick.html s3://powder.network/price --acl public-read --content-type "text/html; charset=utf-8"
aws s3 cp ./public/price_with_uptick.html s3://analytics.snowball.network/price --acl public-read --content-type "text/html; charset=utf-8"

aws cloudfront create-invalidation --distribution-id E1JZNMX0HG4856 --paths "/price"
aws cloudfront create-invalidation --distribution-id E94H37WVV1OQY --paths "/price"
aws cloudfront create-invalidation --distribution-id E3HOAWI4MEOVWK --paths "/price"


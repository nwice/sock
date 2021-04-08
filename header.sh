aws s3 cp ./public/header.html s3://analytics.snowball.network/header --acl public-read --content-type "text/html; charset=utf-8"
aws s3 cp ./public/header.html s3://powder.network/header --acl public-read --content-type "text/html; charset=utf-8"

aws s3 cp ./public/defiheader.js s3://analytics.snowball.network/defiheader.js --acl public-read --content-type "text/html; charset=utf-8"
aws s3 cp ./public/defiheader.js s3://powder.network/defiheader.js --acl public-read

aws cloudfront create-invalidation --distribution-id E1JZNMX0HG4856 --paths "/header"
aws cloudfront create-invalidation --distribution-id E94H37WVV1OQY --paths "/header"

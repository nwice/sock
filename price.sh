aws s3 cp ./public/price.html s3://beta.scewpt.com/price --acl public-read --content-type "text/html; charset=utf-8"
#node ./src/price.js
aws cloudfront create-invalidation --distribution-id E11ZCATVMKXF7D --paths "/price"
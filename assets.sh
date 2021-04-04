aws s3 sync public/assets s3://beta.scewpt.com/assets --acl public-read
aws s3 cp public/common.js s3://beta.scewpt.com/common.js --acl public-read

aws s3 sync public/assets s3://powder.network/assets --acl public-read
aws s3 cp public/common.js s3://powder.network/common.js --acl public-read

aws cloudfront create-invalidation --distribution-id E11ZCATVMKXF7D --paths "/assets/site.css" "/common.js"
aws cloudfront create-invalidation --distribution-id E94H37WVV1OQY --paths "/assets/site.css" "/common.js"
aws cloudfront create-invalidation --distribution-id E1JZNMX0HG4856 --paths "/assets/site.css" "/common.js"

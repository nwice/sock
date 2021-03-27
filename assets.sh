aws s3 sync public/assets s3://beta.scewpt.com/assets --acl public-read
aws s3 sync public/common.js s3://beta.scewpt.com/common.js --acl public-read
aws cloudfront create-invalidation --distribution-id E11ZCATVMKXF7D --paths "assets" "common.js"
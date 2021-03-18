node ./src/pairs.js
aws s3 cp ./public/pairs.html s3://beta.scewpt.com/pairs --acl public-read --content-type text/html
aws s3 cp ./public/pairs.json s3://beta.scewpt.com/pairs.json --acl public-read
aws cloudfront create-invalidation --distribution-id E11ZCATVMKXF7D --paths "/pairs.json" "/pairs"
#aws cloudfront create-invalidation --distribution-id E11ZCATVMKXF7D --paths "/pairs.json" "/pairs" "/assest/*"
#aws s3 sync public/assets s3://beta.scewpt.com/assets --acl public-read

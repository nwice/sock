node ./src/tvl.js
aws s3 cp ./public/tvl.html s3://beta.scewpt.com/tvl --acl public-read --content-type text/html
aws s3 cp ./public/tvl.json s3://beta.scewpt.com/tvl.json --acl public-read
aws s3 cp ./public/tvl.json s3://beta.scewpt.com/total_value_locked.json --acl public-read
aws cloudfront create-invalidation --distribution-id E11ZCATVMKXF7D --paths "/tvl.json" "/tvl" "/total_value_locked.json"

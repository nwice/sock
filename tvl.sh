node ./src/tvl.js
aws s3 cp ./public/tvl_with_uptick.html s3://beta.scewpt.com/tvl --acl public-read --content-type "text/html; charset=utf-8"
aws s3 cp ./public/tvl_with_uptick.html s3://beta.scewpt.com/tvl_with_uptick --acl public-read --content-type "text/html; charset=utf-8"

aws s3 cp ./public/tvl/snob.json s3://beta.scewpt.com/tvl.json --acl public-read --content-type "application/json#"
aws s3 cp ./public/tvl/snob.json s3://beta.scewpt.com/total_value_locked.json --acl public-read --content-type "application/json"
aws s3 cp ./public/tvl/snob.json s3://beta.scewpt.com/tvl/snob.json --acl public-read --content-type "application/json"

aws cloudfront create-invalidation --distribution-id E11ZCATVMKXF7D --paths "/tvl.json" "/tvl" "/tvl_with_uptick" "/total_value_locked.json" "/tvl/snob.json"

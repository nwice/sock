node ./src/tvl.js
aws s3 cp ./public/tvl_with_uptick.html s3://beta.scewpt.com/tvl --acl public-read --content-type "text/html; charset=utf-8"

aws s3 cp ./public/common.js s3://beta.scewpt.com/common.js --acl public-read
aws s3 cp ./public/assets/site.css s3://beta.scewpt.com/assets/site.css --acl public-read  --content-type "text/css"

aws s3 cp ./public/tvl/snob.json s3://beta.scewpt.com/tvl.json --acl public-read --content-type "application/json"
aws s3 cp ./public/tvl/snob.json s3://beta.scewpt.com/total_value_locked.json --acl public-read --content-type "application/json"

aws cloudfront create-invalidation --distribution-id E11ZCATVMKXF7D --paths "/tvl.json" "/assets/site.css" "/common.js" "/tvl" "/tvl_with_uptick" "/total_value_locked.json" "/tvl/snob.json"
aws cloudfront create-invalidation --distribution-id E1JZNMX0HG4856 --paths "/tvl.json" "/assets/site.css" "/common.js" "/tvl" "/tvl_with_uptick" "/total_value_locked.json" "/tvl/snob.json"

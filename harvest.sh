node ./src/harvest.js
aws s3 cp ./public/harvest.html s3://beta.scewpt.com/harvest --acl public-read --content-type text/html
#aws s3 cp ./public/harvest.json s3://beta.scewpt.com/harvest.json --acl public-read --content-type application/json
aws cloudfront create-invalidation --distribution-id E11ZCATVMKXF7D --paths "/harvest" "/harvest.json"

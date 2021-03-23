node ./src/melt.js # does nothing

aws s3 cp ./public/melt.html s3://beta.scewpt.com/melt --acl public-read --content-type text/html
#aws s3 cp ./public/melt.json s3://beta.scewpt.com/melt.json --acl public-read --content-type application/json
#aws cloudfront create-invalidation --distribution-id E11ZCATVMKXF7D --paths "/melt" "/melt.json"

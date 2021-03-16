node ./src/pairs.js
aws s3 cp ./data/pairs.json s3://beta.scewpt.com/pairs.json --acl public-read
aws cloudfront create-invalidation --distribution-id E11ZCATVMKXF7D --paths /pairs.json

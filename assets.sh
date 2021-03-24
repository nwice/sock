aws s3 sync public/assets s3://beta.scewpt.com/assets --acl public-read
aws cloudfront create-invalidation --distribution-id E11ZCATVMKXF7D --paths "/assets"
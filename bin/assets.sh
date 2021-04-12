cd /home/ubuntu/sock

aws s3 sync public/assets s3://powder.network/assets --acl public-read

aws cloudfront create-invalidation --distribution-id E1JZNMX0HG4856 --paths "/assets/*"
aws cloudfront create-invalidation --distribution-id E94H37WVV1OQY --paths "/assets/*"
aws cloudfront create-invalidation --distribution-id E3HOAWI4MEOVWK --paths "/assets/*"
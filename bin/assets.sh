cd /home/ubuntu/sock

aws s3 sync public/assets s3://powder.network/assets --acl public-read --content-type "image/png" --exclude="*" --include="*.png"
aws s3 sync public/assets s3://powder.network/assets --acl public-read --content-type "image/svg+xml" --exclude="*" --include="*.svg"
aws s3 sync public/assets s3://powder.network/assets --acl public-read --content-type "text/css" --exclude="*" --include="*.css"

aws cloudfront create-invalidation --distribution-id E1JZNMX0HG4856 --paths "/assets/*"
aws cloudfront create-invalidation --distribution-id E94H37WVV1OQY --paths "/assets/*"

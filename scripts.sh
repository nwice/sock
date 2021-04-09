aws s3 cp --recursive ./public/ s3://powder.network/  --acl public-read --content-type "text/javascript" --exclude "*" --include "*.js" 

aws cloudfront create-invalidation --distribution-id E1JZNMX0HG4856 --paths "/*.js"
aws cloudfront create-invalidation --distribution-id E94H37WVV1OQY --paths "/*.js"
aws cloudfront create-invalidation --distribution-id E3HOAWI4MEOVWK --paths "/*.js"
aws s3 cp ./public/analytics.html s3://analytics.snowball.network/index.html --acl public-read --content-type "text/html; charset=utf-8"
aws s3 cp ./public/assets/images/logo.png s3://analytics.snowball.network/assets/images/logo.png --acl public-read

aws cloudfront create-invalidation --distribution-id E3HOAWI4MEOVWK --paths "/index.html"

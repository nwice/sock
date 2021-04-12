cd /home/ubuntu/sock/

aws s3 cp --recursive ./public/ s3://powder.network/  --acl public-read --content-type "text/javascript" --exclude "*" --include "*.js" 
aws s3 cp public/assets/site.css s3://powder.network/assets/site.css --acl public-read --content-type "text/css"

aws s3 cp ./public/header.html s3://beta.scewpt.com/index --acl public-read --content-type "text/html; charset=utf-8"
aws s3 cp ./public/header.html s3://powder.network/index --acl public-read --content-type "text/html; charset=utf-8"
aws s3 cp ./public/header.html s3://analytics.snowball.network/index --acl public-read --content-type "text/html; charset=utf-8"

aws s3 cp ./public/header.html s3://beta.scewpt.com/error --acl public-read --content-type "text/html; charset=utf-8"
aws s3 cp ./public/header.html s3://powder.network/error --acl public-read --content-type "text/html; charset=utf-8"
aws s3 cp ./public/header.html s3://analytics.snowball.network/error --acl public-read --content-type "text/html; charset=utf-8"

aws s3 cp ./public/header.html s3://beta.scewpt.com/index --acl public-read --content-type "text/html; charset=utf-8"
aws s3 cp ./public/header.html s3://powder.network/index --acl public-read --content-type "text/html; charset=utf-8"
aws s3 cp ./public/header.html s3://analytics.snowball.network/index --acl public-read --content-type "text/html; charset=utf-8"

aws s3 cp ./public/price.html s3://beta.scewpt.com/price --acl public-read --content-type "text/html; charset=utf-8"
aws s3 cp ./public/price.html s3://powder.network/price --acl public-read --content-type "text/html; charset=utf-8"
aws s3 cp ./public/price.html s3://analytics.snowball.network/price --acl public-read --content-type "text/html; charset=utf-8"

aws s3 cp ./public/harvest.html s3://beta.scewpt.com/harvest --acl public-read --content-type "text/html; charset=utf-8"
aws s3 cp ./public/harvest.html s3://powder.network/harvest --acl public-read --content-type "text/html; charset=utf-8"
aws s3 cp ./public/harvest.html s3://analytics.snowball.network/harvest --acl public-read --content-type "text/html; charset=utf-8"

aws s3 cp ./public/tvl.html s3://beta.scewpt.com/tvl --acl public-read --content-type "text/html; charset=utf-8"
aws s3 cp ./public/tvl.html s3://powder.network/tvl --acl public-read --content-type "text/html; charset=utf-8"
aws s3 cp ./public/tvl.html s3://analytics.snowball.network/tvl --acl public-read --content-type "text/html; charset=utf-8"

aws s3 cp ./public/supply.html s3://beta.scewpt.com/supply --acl public-read --content-type "text/html; charset=utf-8"
aws s3 cp ./public/supply.html s3://powder.network/supply --acl public-read --content-type "text/html; charset=utf-8"
aws s3 cp ./public/supply.html s3://analytics.snowball.network/supply --acl public-read --content-type "text/html; charset=utf-8"

aws cloudfront create-invalidation --distribution-id E1JZNMX0HG4856 --paths "/*.js" "/price" "/harvest" "/tvl" "/supply" "/index" "/error" "/assets/site.css"
aws cloudfront create-invalidation --distribution-id E94H37WVV1OQY --paths "/*.js" "/price" "/harvest" "/tvl" "/supply" "/index" "/error" "/assets/site.css"
aws cloudfront create-invalidation --distribution-id E3HOAWI4MEOVWK --paths "/*.js" "/price" "/harvest" "/tvl" "/supply" "/index" "/error" "/assets/site.css"

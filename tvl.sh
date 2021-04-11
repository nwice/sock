node ./src/tvl.js

aws s3 cp ./public/tvl_with_chart.html s3://beta.scewpt.com/tvl --acl public-read --content-type "text/html; charset=utf-8"
aws s3 cp ./public/tvl_with_chart.html s3://powder.network/tvl --acl public-read --content-type "text/html; charset=utf-8"
aws s3 cp ./public/tvl_with_chart.html s3://analytics.snowball.network/tvl --acl public-read --content-type "text/html; charset=utf-8"

aws cloudfront create-invalidation --distribution-id E1JZNMX0HG4856 --paths "/tvl" "/tvl/snob.json" "/snob/tvl"
aws cloudfront create-invalidation --distribution-id E94H37WVV1OQY --paths "/tvl"  "/tvl/snob.json"
aws cloudfront create-invalidation --distribution-id E3HOAWI4MEOVWK --paths "/tvl"  "/tvl/snob.json"


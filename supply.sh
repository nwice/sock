node ./src/supply.js

aws s3 cp ./public/supply_with_uptick.html s3://beta.scewpt.com/supply --acl public-read --content-type "text/html; charset=utf-8"
aws s3 cp ./public/supply_with_uptick.html s3://powder.network/supply --acl public-read --content-type "text/html; charset=utf-8"

aws cloudfront create-invalidation --distribution-id E1JZNMX0HG4856 --paths "/supply" "/supply/snob.json" "/snob/circulating"
aws cloudfront create-invalidation --distribution-id E94H37WVV1OQY --paths "/supply" "/supply/snob.json"

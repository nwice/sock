cd /home/ubuntu/sock/

for i in ./public/*.js; do
    [ -f "$i" ] || break
    j=$(basename $i)
    aws s3 cp ./public/$j s3://powder.network/$j --acl public-read --content-type "text/javascript"
done

aws s3 sync ./public/abi s3://powder.network/abi --acl public-read

aws s3 sync ./public/node_modules/lit-html s3://powder.network/node_modules/lit-html --acl public-read
aws s3 sync ./public/node_modules/lit-html s3://beta.scewpt.com/node_modules/lit-html --acl public-read

aws s3 cp ./public/header.html s3://powder.network/index --acl public-read --content-type "text/html; charset=utf-8"

aws s3 cp ./public/header.html s3://powder.network/error --acl public-read --content-type "text/html; charset=utf-8"

aws s3 cp ./public/live.html s3://powder.network/live --acl public-read --content-type "text/html; charset=utf-8"

aws s3 cp ./public/proposals.html s3://powder.network/proposals --acl public-read --content-type "text/html; charset=utf-8"

aws s3 cp ./public/price.html s3://powder.network/price --acl public-read --content-type "text/html; charset=utf-8"
aws s3 cp ./public/price.html s3://beta.scewpt.com/price --acl public-read --content-type "text/html; charset=utf-8"

aws s3 cp ./public/harvest.html s3://powder.network/harvest --acl public-read --content-type "text/html; charset=utf-8"

aws s3 cp ./public/tvl.html s3://powder.network/tvl --acl public-read --content-type "text/html; charset=utf-8"
aws s3 cp ./public/tvl.html s3://beta.scewpt.com/tvl --acl public-read --content-type "text/html; charset=utf-8"

aws s3 cp ./public/supply.html s3://powder.network/supply --acl public-read --content-type "text/html; charset=utf-8"

aws cloudfront create-invalidation --distribution-id E94H37WVV1OQY --paths "/*.js" "/price" "/harvest" "/tvl" "/supply" "/proposals"  "/" "/index" "/error" "/assets/site.css"
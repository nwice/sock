aws s3 cp ./public/price.html s3://beta.scewpt.com/price --acl public-read --content-type "text/html; charset=utf-8"
aws s3 cp ./public/price_with_uptick.html s3://beta.scewpt.com/price_with_uptick --acl public-read --content-type "text/html; charset=utf-8"
aws cloudfront create-invalidation --distribution-id E11ZCATVMKXF7D --paths "price" "price_with_uptick"
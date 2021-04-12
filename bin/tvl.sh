node ./src/tvl.js

aws cloudfront create-invalidation --distribution-id E1JZNMX0HG4856 --paths "/tvl" "/tvl/snob.json" "/snob/tvl"
aws cloudfront create-invalidation --distribution-id E94H37WVV1OQY --paths "/tvl"  "/tvl/snob.json"
aws cloudfront create-invalidation --distribution-id E3HOAWI4MEOVWK --paths "/tvl"  "/tvl/snob.json"
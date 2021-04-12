cd /home/ubuntu/sock

node ./src/supply.js

aws cloudfront create-invalidation --distribution-id E1JZNMX0HG4856 --paths "/supply/snob.json" "/snob/circulating"
aws cloudfront create-invalidation --distribution-id E94H37WVV1OQY --paths "/supply/snob.json" 

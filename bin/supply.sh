cd /home/ubuntu/sock
/home/ubuntu/.nvm/versions/node/v15.9.0/bin/node ./src/supply.js

aws cloudfront create-invalidation --distribution-id E1JZNMX0HG4856 --paths "/supply/snob.json" "/snob/circulating"
aws cloudfront create-invalidation --distribution-id E94H37WVV1OQY --paths "/supply/snob.json" 

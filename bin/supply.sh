cd /home/ubuntu/sock

node ./src/supply.js

aws cloudfront create-invalidation --distribution-id E1JZNMX0HG4856 --paths "/snob/circulating" "/supply/snob.json"
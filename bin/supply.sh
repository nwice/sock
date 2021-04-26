cd /home/ubuntu/sock

node ./src/cli.js supply

aws cloudfront create-invalidation --distribution-id E1JZNMX0HG4856 --paths "/snob/circulating" "/supply/snob.json"
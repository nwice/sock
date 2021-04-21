cd /home/ubuntu/sock/

node ./src/cli.js tvl

aws cloudfront create-invalidation --distribution-id E1JZNMX0HG4856 --paths "/snob/tvl"

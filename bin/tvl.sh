cd /home/ubuntu/sock/

/home/ubuntu/.nvm/versions/node/v15.9.0/bin/node ./src/cli.js tvl

aws cloudfront create-invalidation --distribution-id E1JZNMX0HG4856 --paths "/tvl" "/tvl/snob.json" "/snob/tvl"

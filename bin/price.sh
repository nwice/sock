cd /home/ubuntu/sock

node ./src/cli.js price

aws cloudfront create-invalidation --distribution-id E1JZNMX0HG4856 --paths "/snob/price"
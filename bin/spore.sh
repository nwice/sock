cd /home/ubuntu/sock

node ./src/job/spore.js

aws cloudfront create-invalidation --distribution-id E1JZNMX0HG4856 --paths "/spore/circulating" "/supply/spore.json"

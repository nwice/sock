'use strict';

var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

const test_event = {
  "Records": [
    {
      "cf": {
        "config": {
          "distributionDomainName": "d2vq5imxja288v.cloudfront.net",
          "distributionId": "E11ZCATVMKXF7D",
          "eventType": "viewer-request",
          "requestId": "KuqSl9tLnMki8aIYrDhVgx1JnS0ec1IpXg1YebXiN2xk95DXpSmakg=="
        },
        "request": {
          "clientIp": "68.21.174.239",
          "headers": {
            "host": [
              {
                "key": "Host",
                "value": "x-api.snowballfinance.info"
              }
            ],
            "user-agent": [
              {
                "key": "User-Agent",
                "value": "Mozilla/5.0 (X11; CrOS x86_64 13729.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"
              }
            ],
            "cache-control": [
              {
                "key": "cache-control",
                "value": "max-age=0"
              }
            ],
            "accept": [
              {
                "key": "accept",
                "value": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
              }
            ],
            "accept-encoding": [
              {
                "key": "accept-encoding",
                "value": "gzip, deflate, br"
              }
            ],
            "accept-language": [
              {
                "key": "accept-language",
                "value": "en-US,en;q=0.9"
              }
            ]
          },
          "method": "GET",
          "querystring": "test",
          "uri": "/harvest.json"
        }
      }
    }
  ]
};

var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

const table = 'harvest-2';

function fake(event, context, callback) {

  console.log('querystring:', event.Records[0].cf.request?.querystring);
  
  console.log('potential_harvest:', potential_harvest);

  var potential_harvest = {
    TableName: table,
    Item: {
      strategy: { S: 'test' },
      timestamp: { N: new Date().getTime() }
    }
  };
  ddb.putItem(potential_harvest, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  });
  const response = {
    status: '200',
    statusDescription: 'OK',
    body: JSON.stringify(event.Records),
  };
  console.log('response:', response);
};

fake(test_event)
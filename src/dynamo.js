var AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

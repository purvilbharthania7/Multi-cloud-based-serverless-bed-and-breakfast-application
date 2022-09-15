const AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-1" });

const ddb = new AWS.DynamoDB();

const params = {
  AttributeDefinitions: [
    {
      AttributeName: "email",
      AttributeType: "S",
    },
  ],
  KeySchema: [
    {
      AttributeName: "email",
      KeyType: "HASH",
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 100,
    WriteCapacityUnits: 100,
  },
  TableName: "user_answer",
};

ddb.createTable(params, function (err, data) {
  if (err) {
    console.log(err);
  } else {
    console.log("Table Created", data);
  }
});

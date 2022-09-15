const AWS = require("aws-sdk");
const questionData = require("./questionBank.json");

AWS.config.update({ region: "us-east-1" });

const ddb = new AWS.DynamoDB();

const params = {
  AttributeDefinitions: [
    {
      AttributeName: "id",
      AttributeType: "N",
    },
  ],
  KeySchema: [
    {
      AttributeName: "id",
      KeyType: "HASH",
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 100,
    WriteCapacityUnits: 100,
  },
  TableName: "question_bank",
};

ddb.createTable(params, function (err, data) {
  if (err) {
  } else {
    console.log("Table Created", data);
  }
});

const tablePut = {
  RequestItems: {
    question_bank: [],
  },
};

questionData.forEach((item) => {
  tablePut.RequestItems.question_bank.push({
    PutRequest: {
      Item: {
        id: {
          N: item.id.toString(),
        },
        question: {
          S: item.question,
        },
      },
    },
  });
});

ddb.batchWriteItem(tablePut, function (err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data);
  }
});

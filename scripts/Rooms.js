const AWS = require("aws-sdk");
const rooms = require("./rooms.json");

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
  TableName: "rooms",
};

ddb.createTable(params, function (err, data) {
  if (err) {
    console.log(err);
  } else {
    console.log("Table Created", data);
  }
});

const tablePut = {
  RequestItems: {
    rooms: [],
  },
};

rooms.forEach((item) => {
  tablePut.RequestItems.rooms.push({
    PutRequest: {
      Item: {
        id: {
          N: item.id.toString(),
        },
        name: {
          S: item.name,
        },
        price: {
          N: item.price.toString(),
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

const aws = require("aws-sdk");
aws.config.update({ region: "us-east-1" });

const dynamodbClient = new aws.DynamoDB();

exports.handler = async (event) => {
  const parsedBody = JSON.parse(event.body);

  const userTablePut = {
    TableName: "users",
    Key: {
      id: {
        S: parsedBody.id,
      },
    },
    UpdateExpression: "set cipherKey = :x",
    ExpressionAttributeValues: {
      ":x": {
        N: parsedBody.key.toString(),
      },
    },
  };

  try {
    await dynamodbClient.updateItem(userTablePut).promise();
    const response = {
      statusCode: 200,
      body: JSON.stringify("success"),
    };
    return response;
  } catch (error) {
    const response = {
      statusCode: 500,
      body: JSON.stringify(error.message),
    };
    return response;
  }
};

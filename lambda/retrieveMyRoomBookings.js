const aws = require("aws-sdk");
aws.config.update({ region: "us-east-1" });

const dynamodbClient = new aws.DynamoDB();

exports.handler = async (event) => {
  const parsedBody = JSON.parse(event.body);

  const params = {
    TableName: "room_booking",
    IndexName: "userId-index",
    KeyConditionExpression: "userId = :x",
    ExpressionAttributeValues: {
      ":x": {
        S: parsedBody.userId,
      },
    },
  };

  try {
    const strData = [];
    const data = await dynamodbClient.query(params).promise();
    data.Items.forEach((item) => {
      strData.push({
        id: item.id.S,
        roomId: item.roomId.N,
        startDate: item.startDate.S,
        endDate: item.endDate.S,
        guest: item.guest.N,
        price: item.price.N,
        userId: item.userId.S,
      });
    });
    const response = {
      statusCode: 200,
      body: JSON.stringify(strData),
    };
    return response;
  } catch (e) {
    const response = {
      statusCode: 200,
      body: JSON.stringify(e.message),
    };
    return response;
  }
};

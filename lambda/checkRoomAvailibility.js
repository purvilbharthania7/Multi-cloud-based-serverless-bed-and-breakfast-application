const aws = require("aws-sdk");
aws.config.update({ region: "us-east-1" });

const dynamodbClient = new aws.DynamoDB();

// eslint-disable-next-line no-extend-native
Date.prototype.withoutTime = function () {
  var d = new Date(this);
  d.setHours(0, 0, 0, 0);
  return d;
};

exports.handler = async (event) => {
  const parsedBody = JSON.parse(event.body);

  const params = {
    TableName: "room_booking",
    IndexName: "roomId-index",
    KeyConditionExpression: "roomId = :x",
    ExpressionAttributeValues: {
      ":x": {
        N: parsedBody.roomId,
      },
    },
  };
  try {
    const strData = [];
    const data = await dynamodbClient.query(params).promise();
    console.log(data.Items);
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

    let isAvailable = true;

    strData.forEach((item) => {
      const reqStartDate = new Date(parsedBody.startDate).withoutTime();
      const reqEndDate = new Date(parsedBody.endDate).withoutTime();
      const itemStartDate = new Date(item.startDate).withoutTime();
      const itemEndDate = new Date(item.endDate).withoutTime();

      if (reqStartDate < itemStartDate && reqEndDate > itemEndDate) {
        isAvailable = false;
      } else if (reqStartDate > itemStartDate && reqEndDate > itemEndDate) {
        isAvailable = false;
      } else if (reqStartDate < itemStartDate && reqEndDate < itemEndDate) {
        isAvailable = false;
      } else if (reqStartDate > itemStartDate && reqEndDate < itemEndDate) {
        isAvailable = false;
      }
    });
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        isAvailable,
      }),
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

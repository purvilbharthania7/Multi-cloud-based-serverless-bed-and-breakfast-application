const aws = require("aws-sdk");
aws.config.update({ region: "us-east-1" });

const dynamodbClient = new aws.DynamoDB();

exports.handler = async (event, context) => {
  const parsedBody = JSON.parse(event.body);

  const tablePut = {
    RequestItems: {
      room_booking: [
        {
          PutRequest: {
            Item: {
              id: {
                S: context.awsRequestId,
              },
              userId: {
                S: parsedBody.userId,
              },
              roomId: {
                N: parsedBody.roomId.toString(),
              },
              startDate: {
                S: parsedBody.startDate,
              },
              endDate: {
                S: parsedBody.endDate,
              },
              guest: {
                N: parsedBody.guest.toString(),
              },
              price: {
                N: parsedBody.price.toString(),
              },
            },
          },
        },
      ],
    },
  };

  try {
    await dynamodbClient.batchWriteItem(tablePut).promise();
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
      }),
    };
    return response;
  } catch (e) {
    const response = {
      statusCode: 500,
      body: JSON.stringify(e.message),
    };
    return response;
  }
};

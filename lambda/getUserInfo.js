const aws = require("aws-sdk");
aws.config.update({ region: "us-east-1" });

const dynamodbClient = new aws.DynamoDB();

exports.handler = async (event) => {
  const parsedEvent = JSON.parse(event.body);

  let finalData = null;
  const data = await dynamodbClient
    .scan({
      TableName: "users",
    })
    .promise();

  data.Items.forEach((item) => {
    if (item.id.S === parsedEvent.id) {
      finalData = {
        id: item.id.S,
        cipherKey: item.cipherKey.N,
        email: item.email.S,
      };
    }
  });

  const response = {
    statusCode: 200,
    body: JSON.stringify(finalData),
  };
  return response;
};

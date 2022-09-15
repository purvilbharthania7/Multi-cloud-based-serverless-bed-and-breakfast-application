const aws = require("aws-sdk");
aws.config.update({ region: "us-east-1" });

const dynamodbClient = new aws.DynamoDB();

exports.handler = async (event) => {
  try {
    const finalData = [];
    const data = await dynamodbClient
      .scan({
        TableName: "rooms",
      })
      .promise();

    data.Items.forEach((item) => {
      finalData.push({
        id: item.id.N,
        name: item.name.S,
        price: item.price.N,
      });
    });
    const response = {
      statusCode: 200,
      body: JSON.stringify(finalData),
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

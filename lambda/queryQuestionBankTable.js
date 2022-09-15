const aws = require("aws-sdk");
aws.config.update({ region: "us-east-1" });

const dynamodbClient = new aws.DynamoDB();

exports.handler = async (event) => {
  try {
    const finalData = [];
    const data = await dynamodbClient
      .scan({
        TableName: "question_bank",
      })
      .promise();

    data.Items.forEach((item) => {
      finalData.push({
        id: item.id.N,
        question: item.question.S,
      });
    });
    const response = {
      statusCode: 200,
      body: JSON.stringify(finalData),
    };
    return response;
  } catch (error) {
    const response = {
      statusCode: 200,
      body: error.message,
    };
    return response;
  }
};

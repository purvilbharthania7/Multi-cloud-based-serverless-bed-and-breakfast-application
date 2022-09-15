const aws = require("aws-sdk");
aws.config.update({ region: "us-east-1" });

const dynamodbClient = new aws.DynamoDB();

exports.handler = async (event) => {
  const parsedEvent = JSON.parse(event.body);
  if (parsedEvent.email && parsedEvent.email.trim().length) {
    const finalData = [];

    const data = await dynamodbClient
      .query({
        TableName: "user_answer",
        KeyConditionExpression: "email = :x",
        ExpressionAttributeValues: {
          ":x": {
            S: parsedEvent.email,
          },
        },
      })
      .promise();

    data.Items.forEach((item) => {
      finalData.push({
        email: item.email.S,
        question_1_answer: item.question_1_answer.S,
        question_1_id: item.question_1_id.S,
        question_2_answer: item.question_2_answer.S,
        question_2_id: item.question_2_id.S,
        question_3_id: item.question_3_id.S,
        question_3_answer: item.question_3_answer.S,
      });
    });
    const response = {
      statusCode: 200,
      body: JSON.stringify(finalData),
    };
    return response;
  } else {
    const response = {
      statusCode: 400,
      body: JSON.stringify("email not found in query params."),
    };
    return response;
  }
};

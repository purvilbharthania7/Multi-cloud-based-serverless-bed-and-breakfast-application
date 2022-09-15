const aws = require("aws-sdk");
aws.config.update({ region: "us-east-1" });

const dynamodbClient = new aws.DynamoDB();

exports.handler = async (event) => {
  const body = JSON.parse(event.body);

  const userTablePut = {
    RequestItems: {
      users: [
        {
          PutRequest: {
            Item: {
              id: {
                S: body.id,
              },
              email: {
                S: body.email,
              },
              name: {
                S: body.name,
              },
            },
          },
        },
      ],
    },
  };

  const userAnswerPut = {
    RequestItems: {
      user_answer: [
        {
          PutRequest: {
            Item: {
              email: {
                S: body.email,
              },
              question_1_id: {
                S: body.userAnswerOne.questionId,
              },
              question_1_answer: {
                S: body.userAnswerOne.answer,
              },

              question_2_id: {
                S: body.userAnswerTwo.questionId,
              },
              question_2_answer: {
                S: body.userAnswerTwo.answer,
              },

              question_3_id: {
                S: body.userAnswerThree.questionId,
              },
              question_3_answer: {
                S: body.userAnswerThree.answer,
              },
            },
          },
        },
      ],
    },
  };
  try {
    await dynamodbClient.batchWriteItem(userTablePut).promise();
    await dynamodbClient.batchWriteItem(userAnswerPut).promise();
    const response = {
      statusCode: 200,
      body: JSON.stringify({ ...event.body }),
    };
    return response;
  } catch (e) {
    const response = {
      statusCode: 500,
      body: e.message,
    };
    return response;
  }
};

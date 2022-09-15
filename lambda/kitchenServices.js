const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  let body = JSON.parse(event.body);
  let endpoint = body.endpoint;

  if (endpoint === "/fetchAllMenuItems") {
    var params = {
      TableName: "kitchenMenu",
    };
    console.log("params : " + JSON.stringify(params));
    try {
      let result = await dynamoDB.scan(params).promise();
      let response = {
        statusCode: 200,
        menuItems: result.Items,
      };
      console.log(response);
      return result;
    } catch (e) {
      console.log("Errr " + e.message);
      const response = {
        statusCode: 500,
        message: e.message,
      };
      return response;
    }
  } else if (endpoint === "/orderFood") {
    let orderSummary = body.order;
    var params = {
      TableName: "orders",
      Item: orderSummary,
    };
    console.log(params);
    try {
      let result = await dynamoDB.put(params).promise();
      console.log(result);
      var postData = {
        topic: "DalSoft5410",
        message: "Order has been placed successfully.",
      };
      return {
        statusCode: 200,
        message: "Order is made.",
      };
    } catch (e) {
      console.log("Errr " + e.message);
      const response = {
        statusCode: 500,
        message: e.message,
      };
      return response;
    }
  } else if (endpoint === "/fetchUserOrders") {
    const params = {
      TableName: "orders",
      FilterExpression: "userId = :x",
      ExpressionAttributeValues: { ":x": body.userId },
    };
    console.log("params : " + JSON.stringify(params));
    try {
      const result = await dynamoDB.scan(params).promise();
      let response = {
        statusCode: 200,
        menuItems: result.Items,
      };
      console.log(result);
      return result;
    } catch (e) {
      console.log("Errr " + e.message);
      const response = {
        statusCode: 500,
        message: e.message,
      };
      return response;
    }
  }
};

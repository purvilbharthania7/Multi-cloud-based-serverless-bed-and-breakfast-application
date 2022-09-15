const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    let response = {};
    var paramsOrders = {
      TableName: "orders",
    };
     var paramsUsers = {
      TableName: "users",
    };
    var paramsTours = {
      TableName: "tour_booking",
    };
     var paramsRooms = {
      TableName: "room_booking",
    };
    try {
      let orders = await dynamoDB.scan(paramsOrders).promise();
      response.orders = orders.Items.length;
      let users = await dynamoDB.scan(paramsUsers).promise();
      response.users = users.Items.length;
      let rooms = await dynamoDB.scan(paramsRooms).promise();
      response.rooms = rooms.Items.length;
      let tours = await dynamoDB.scan(paramsTours).promise();
      response.tours = tours.Items.length;
      
      console.log(response);
      return response;
    } catch (e) {
      console.log("Error " + e.message);
      const response = {
        statusCode: 500,
        message: e.message,
      };
      return response;
    }
  
};

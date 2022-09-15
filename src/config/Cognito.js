import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "us-east-1_JVvKzs6gg",
  ClientId: "7fc7ck1vq7m4gkthh4p7415hov",
};

let cognito = null;

try {
  cognito = new CognitoUserPool(poolData);
} catch (error) {
  console.log(error);
}

export { cognito };

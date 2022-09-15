/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
 const { encrypt } = require("./caesar");
 const axios = require("axios");
 
 exports.helloWorld = async (req, res) => {
   console.log(req.body);
   res.set("Access-Control-Allow-Origin", "*");
   if (req.method === "OPTIONS") {
     // Send response to OPTIONS requests
     res.set("Access-Control-Allow-Methods", "GET");
     res.set("Access-Control-Allow-Headers", "Content-Type");
     res.set("Access-Control-Max-Age", "3600");
     res.status(204).send("");
   }
   const { id, word, caesar } = req.body;
   try {
     const response = await axios.post(
       "https://3w3wwxceouh4vxxkfdlyrcgyvu0piibs.lambda-url.us-east-1.on.aws/",
       { id }
     );
     if (encrypt(parseInt(response.data.cipherKey), word) === caesar) {
       res.status(200).send(true);
     } else {
       res.status(400).send(false);
     }
   } catch (error) {
     console.log(error);
     res.status(500).json("error");
   }
 };
 
import React, { useContext } from 'react'
import LexChat from "react-lex-plus";
import { Context } from "../data/Context";


const Chatbot = () => {
    const { userData } = useContext(Context);
    let userId = "";
    if (userData) {
        userId = userData.id;
    }
    // console.log(userId)
    return (
        <>
            <LexChat
                botName="ServerlessBot"
                IdentityPoolId="us-east-1:fce355a5-f2a6-4f0c-91c2-49d026be3d90"
                placeholder="Placeholder text"
                backgroundColor="#FFFFFF"
                height="430px"
                region="us-east-1"
                headerText="Chatbot"
                headerStyle={{ backgroundColor: "#ABD5D9", fontSize: "30px" }}
                greeting={
                    "Hello, how can I help? "
                }
                sessionAttributes={
                    { "userId": userId }
                }
            />;
        </>
    )
}

export default Chatbot

// IdentityPoolId = "us-east-1:fce355a5-f2a6-4f0c-91c2-49d026be3d90"
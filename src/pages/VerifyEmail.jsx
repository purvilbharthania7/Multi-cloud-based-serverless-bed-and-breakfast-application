import { Button, Flex, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VerifyEmailImg from "../images/mailbox.gif";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (location.state && location.state.id) {
      setUserInfo({ ...location.state });
    } else {
      const data = JSON.parse(
        localStorage.getItem("register-user-info") || "{}"
      );
      if (data && data.id) {
        setUserInfo({ ...data });
      } else {
        navigate("/");
        return;
      }
    }
  }, [location.state, navigate]);

  return (
    <Flex w="100%" minH="100vh" justify="center" align="center">
      <Flex
        w="60%"
        h="80vh"
        justify="space-evenly"
        align="center"
        flexDirection="column"
        shadow="md"
        padding="5"
        rounded="xl"
      >
        <Text fontSize="5xl">Verify your email</Text>
        <Text>You will need to verify email to complete registration</Text>
        <Image src={VerifyEmailImg} height="30vh" />
        <Text>
          An email has been sent to {userInfo && userInfo.email} with a link to
          verify your account. If you have not received the email after a few
          minutes, please check your span folder.
        </Text>

        <Button colorScheme="twitter" onClick={() => navigate("/login")}>
          Login
        </Button>
      </Flex>
    </Flex>
  );
};

export default VerifyEmail;

import {
  Flex,
  FormControl,
  FormHelperText,
  IconButton,
  Image,
  Input,
  Text,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import codingGif from "../images/coding.gif";
import randomWord from "random-words";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../data/Context";
import { GCPVerifyCipher } from "../config/LambdaUrl";

const LoginCipher = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [word] = useState(randomWord());
  const [answer, setAnswer] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const { setAccessToken, setUserData } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!userInfo && !userInfo.id) {
      return;
    }
    if (!answer.trim().length) {
      toast.error("Answer is required");
      return;
    }
    setIsLoading(true);
    axios
      .post(GCPVerifyCipher, { id: userInfo.id, word, caesar: answer })
      .then(() => {
        localStorage.setItem("accessToken", userInfo.token);
        setAccessToken(userInfo.token);
        setUserData({
          id: userInfo.id,
          email: userInfo.email,
        });
        setIsLoading(false);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Wrong Answer");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (location.state && location.state.id) {
      setUserInfo({ ...location.state });
    } else {
      navigate("/login");
      return;
    }
  }, [location.state, navigate]);

  return (
    <Flex w="100%" h="100vh" justify="center" align="center">
      <Flex
        w={["90%", "90%", "90%", "80%"]}
        h="100%"
        flexDirection={["column", "column", "column", "row"]}
      >
        <Flex
          w={["100%", "100%", "100%", "50%"]}
          justify="center"
          flexDirection="column"
          order={[2, 2, 2, 1]}
        >
          <Text fontWeight="bold" mt="5" color="gold">
            STEP 3 / 3
          </Text>

          <Text mt="10">Your word is</Text>
          <Text fontSize="5xl" mb="10" mt="0">
            {word}
          </Text>

          <FormControl>
            <Input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="your answer"
            />
            <FormHelperText>
              Enter Ceaser Cipher in input using the key you provided at time of
              registration.
            </FormHelperText>
          </FormControl>

          <IconButton
            icon={<FiArrowRight />}
            mt="10"
            w="50px"
            colorScheme="blue"
            disabled={!answer.trim().length}
            onClick={handleSubmit}
            isLoading={isLoading}
          />
        </Flex>
        <Flex
          w={["100%", "100%", "100%", "50%"]}
          justify="center"
          align="center"
          order={[1, 1, 1, 2]}
        >
          <Image src={codingGif} w="80%" h="100%" objectFit="contain" />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default LoginCipher;

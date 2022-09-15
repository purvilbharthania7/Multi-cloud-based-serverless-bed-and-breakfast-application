import {
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Image,
  Input,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchUserAnswers, queryQuestionBankTable } from "../config/LambdaUrl";
import QuestionImg from "../images/confusePerson.gif";

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const rand = randomIntFromInterval(1, 3);

const LoginQuestions = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [questionBank, setQuestionsBank] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [userOriginalAnswer, setUserOriginalAnswer] = useState(null);
  const [randomQuestion, setRandomQuestion] = useState(null);
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    if (!answer.trim().length) {
      toast.error("Please enter answer");
      return;
    }
    const QuesIndex = `question_${rand}_answer`;
    const orgAns = userOriginalAnswer[QuesIndex];
    console.log(answer, orgAns);
    if (
      answer.trim().toLocaleLowerCase() === orgAns.trim().toLocaleLowerCase()
    ) {
      navigate("/login-cipher", { state: { ...location.state } });
    } else {
      toast.error("Incorrect Answer");
      return;
    }
  };

  useEffect(() => {
    axios
      .get(queryQuestionBankTable)
      .then((response) => {
        setQuestionsBank(response.data);
      })

      .catch(() => {
        toast.error("Error Fetching Questions");
      });
  }, []);

  useEffect(() => {
    if (location.state && location.state.id) {
      setUserInfo({ ...location.state });
    } else {
      navigate("/login");
      return;
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (userInfo && userInfo.email) {
      axios
        .post(fetchUserAnswers, { email: userInfo.email })
        .then((response) => {
          if (response.data.length) {
            setUserOriginalAnswer(response.data[0]);
          }
        })
        .catch((error) => {
          toast.error("Error fetching user data");
        });
    }
  }, [userInfo]);

  useEffect(() => {
    if (rand && userOriginalAnswer) {
      const str = `question_${rand}_id`;
      const id = userOriginalAnswer[str];
      const question = questionBank.find(
        (item) => parseInt(item.id) === parseInt(id)
      );
      if (question) {
        setRandomQuestion(question);
      }
    }
  }, [questionBank, userOriginalAnswer]);

  return (
    <Flex w="100%" h="100vh" justify="center" align="center">
      <Flex
        w={["90%", "90%", "90%", "80%"]}
        h="100%"
        flexDirection={["column", "column", "column", "row"]}
      >
        <Flex
          w={["100%", "100%", "100%", "50%"]}
          justify={["center", "center", "flex-start"]}
        >
          <Image src={QuestionImg} w="80%" h="100%" objectFit="contain" />
        </Flex>
        <Flex
          w={["100%", "100%", "100%", "50%"]}
          justify="center"
          flexDirection="column"
        >
          <Text fontWeight="bold" mt="5" color="gold">
            STEP 2 / 3
          </Text>
          {userInfo && userInfo.email && (
            <Text mt="4" fontSize="sm">
              Hi, {userInfo.email}
            </Text>
          )}
          <Text fontSize={["3xl", "3xl", "5xl"]} mt={[10, 10, 10, 0]}>
            Security Questions
          </Text>
          <Flex flexDirection="column" mt="5">
            <FormControl>
              <FormLabel>{randomQuestion && randomQuestion.question}</FormLabel>
              <Input
                type="text"
                mt="1"
                background="gray.50"
                placeholder="Answer..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </FormControl>
          </Flex>
          <IconButton
            icon={<FiArrowRight />}
            mt="10"
            w="50px"
            colorScheme="blue"
            disabled={!answer.trim().length}
            onClick={handleSubmit}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default LoginQuestions;

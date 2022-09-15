import { Flex, IconButton, Image, Input, Select, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { queryQuestionBankTable, saveAnswerToDB } from "../config/LambdaUrl";
import QuestionImg from "../images/confusePerson.gif";

const findDuplicates = (data) => {
  const output = [];
  Object.values(
    data.reduce((res, obj) => {
      let key = obj.questionId;
      res[key] = [...(res[key] || []), { ...obj }];
      return res;
    }, {})
  ).forEach((arr) => {
    if (arr.length > 1) {
      output.push(...arr);
    }
  });
  return output;
};

const RegisterQuestions = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [questionsBank, setQuestionsBank] = useState([]);
  const [userAnswerOne, setUserAnswerOne] = useState({
    questionId: -1,
    answer: "",
  });
  const [userAnswerTwo, setUserAnswerTwo] = useState({
    questionId: -1,
    answer: "",
  });
  const [userAnswerThree, setUserAnswerThree] = useState({
    questionId: -1,
    answer: "",
  });

  const handleSubmit = () => {
    if (
      findDuplicates([
        { ...userAnswerOne },
        { ...userAnswerTwo },
        { ...userAnswerThree },
      ]).length
    ) {
      toast.error("All questions must be different");
      return;
    }
    if (!userAnswerOne.answer.trim().length) {
      toast.error("Answer 1 cannot be empty");
      return;
    }
    if (!userAnswerTwo.answer.trim().length) {
      toast.error("Answer 2 cannot be empty");
      return;
    }
    if (!userAnswerThree.answer.trim().length) {
      toast.error("Answer 3 cannot be empty");
      return;
    }

    axios
      .post(saveAnswerToDB, {
        ...userInfo,
        userAnswerOne,
        userAnswerTwo,
        userAnswerThree,
      })
      .then(() => {
        navigate("/register-cipher");
      })
      .catch(() => {
        toast.error("error saving data");
      });
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
      const data = JSON.parse(
        localStorage.getItem("register-user-info") || "{}"
      );
      if (data && data.id) {
        setUserInfo({ ...data });
      } else {
        navigate("/register");
        return;
      }
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

          <Flex flexDirection="column">
            <Select
              mt="5"
              value={userAnswerOne.questionId}
              onChange={(e) =>
                setUserAnswerOne({ answer: "", questionId: e.target.value })
              }
            >
              <option disabled value={-1}>
                Select Question 1
              </option>
              {questionsBank.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.question}
                </option>
              ))}
            </Select>
            <Input
              type="text"
              mt="1"
              background="gray.50"
              placeholder="Answer..."
              value={userAnswerOne.answer}
              onChange={(e) =>
                setUserAnswerOne((old) => {
                  return {
                    answer: e.target.value,
                    questionId: old.questionId,
                  };
                })
              }
            />
          </Flex>

          <Flex flexDirection="column">
            <Select
              mt="5"
              value={userAnswerTwo.questionId}
              onChange={(e) =>
                setUserAnswerTwo({ answer: "", questionId: e.target.value })
              }
            >
              <option disabled value={-1}>
                Select Question 2
              </option>
              {questionsBank.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.question}
                </option>
              ))}
            </Select>
            <Input
              type="text"
              mt="1"
              background="gray.50"
              placeholder="Answer..."
              value={userAnswerTwo.answer}
              onChange={(e) =>
                setUserAnswerTwo((old) => {
                  return {
                    answer: e.target.value,
                    questionId: old.questionId,
                  };
                })
              }
            />
          </Flex>

          <Flex flexDirection="column">
            <Select
              mt="5"
              value={userAnswerThree.questionId}
              onChange={(e) =>
                setUserAnswerThree({ answer: "", questionId: e.target.value })
              }
            >
              <option disabled value={-1}>
                Select Question 3
              </option>
              {questionsBank.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.question}
                </option>
              ))}
            </Select>
            <Input
              type="text"
              mt="1"
              background="gray.50"
              placeholder="Answer..."
              value={userAnswerThree.answer}
              onChange={(e) =>
                setUserAnswerThree((old) => {
                  return {
                    answer: e.target.value,
                    questionId: old.questionId,
                  };
                })
              }
            />
          </Flex>

          <IconButton
            icon={<FiArrowRight />}
            mt="10"
            w="50px"
            colorScheme="blue"
            onClick={handleSubmit}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default RegisterQuestions;

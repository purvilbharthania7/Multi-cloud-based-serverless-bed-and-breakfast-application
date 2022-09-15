import {
  Flex,
  Image,
  Text,
  FormControl,
  FormLabel,
  IconButton,
  Select,
  Textarea,
} from "@chakra-ui/react";
import React from "react";
import feebackgif from "../images/Feedback.gif";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { Context } from "../data/Context";

const Feedback = () => {
  const navigate = useNavigate();
  const { userData } = useContext(Context);
  const [userFeedback, setUserFeedback] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!userData && !userData.id) {
      return;
    }
    setIsLoading(true);
    axios({
      method: "post",
      url: "https://zjkrkrts2xtkyyt6e34eo2sgp40xrqjf.lambda-url.us-east-1.on.aws/",
      data: {
        userId: userData.id,
        text: userFeedback,
        serviceName: selectedServiceType,
      },
    })
      .then(function (response) {
        setIsLoading(false);
        toast("Thank you for your feedback!!");
        navigate("/home");
      })
      .catch((error) => {
        toast.error("An error occured while fetching the tour packages.");
        setIsLoading(false);
      });
  };

  return (
    <Flex w="100%" minH="100vh" flexDirection="column">
      <Navbar />
      <Flex w="100%" justify="center" align="center">
        <Flex
          w={["90%", "90%", "90%", "80%"]}
          h="100%"
          flexDirection={["column", "column", "column", "row"]}
        >
          <Flex
            w={["100%", "100%", "100%", "50%"]}
            justify={["center", "center", "flex-start"]}
          >
            <Image src={feebackgif} w="80%" h="100%" objectFit="contain" />
          </Flex>
          <Flex
            w={["100%", "100%", "100%", "50%"]}
            justify="center"
            flexDirection="column"
          >
            <Text fontSize={["3xl", "3xl", "5xl"]} mt={[10, 10, 10, 0]}>
              Provide your feedback
            </Text>
            <FormControl mr="2">
              <FormLabel>Select Service</FormLabel>
              <Select
                placeholder="Select option"
                value={selectedServiceType}
                onChange={(e) => setSelectedServiceType(e.target.value)}
              >
                <option value="tourService">Tours Service</option>
                <option value="kitchenService">Kitchen Service</option>
                <option value="roomService">Rooms Service</option>
              </Select>
            </FormControl>
            <FormControl mr="2">
              <FormLabel>Feedback</FormLabel>
              <Textarea
                type="textbox"
                value={userFeedback}
                onChange={(e) => setUserFeedback(e.target.value)}
                placeholder="Feedback here"
              />
            </FormControl>

            <IconButton
              icon={<FiArrowRight />}
              mt="10"
              w="50px"
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={isLoading}
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Feedback;

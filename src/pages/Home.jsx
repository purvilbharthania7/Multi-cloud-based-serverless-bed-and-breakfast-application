import { Flex, Image, Text } from "@chakra-ui/react";
import React from "react";
import Navbar from "../components/Navbar";
import vegetableImg from "../images/vegetable.png";
import hotelImg from "../images/hotel.png";
import tourImg from "../images/destination.png";
import { useNavigate } from "react-router-dom";
import Chatbot from "../components/Chatbot";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Flex w="100%" minH="100vh" flexDirection="column">
      <Navbar />
      <Flex w="100%" h="90vh" justify="space-evenly" align="center">
        <Flex
          w="25%"
          shadow="md"
          rounded="xl"
          bg="rgba(0,170,255,0.3)"
          minH="250px"
          align="center"
          flexDirection="column"
          cursor="pointer"
          onClick={() => navigate("/kitchen")}
        >
          <Flex w="100%" justify="center" align="center" mt="-150px">
            <Image src={vegetableImg} />
          </Flex>
          <Text fontSize="3xl" color="white" fontWeight="bold" mt="20">
            Menu
          </Text>
        </Flex>

        <Flex
          w="25%"
          shadow="md"
          rounded="xl"
          bg="rgba(100,170,80,0.5)"
          minH="250px"
          align="center"
          flexDirection="column"
          cursor="pointer"
          onClick={() => navigate("/rooms")}
        >
          <Flex w="100%" justify="center" align="center" mt="-150px">
            <Image src={hotelImg} />
          </Flex>
          <Text fontSize="3xl" color="white" fontWeight="bold" mt="20">
            Rooms
          </Text>
        </Flex>

        <Flex
          w="25%"
          shadow="md"
          rounded="xl"
          bg="rgba(244,170,80,0.5)"
          minH="250px"
          align="center"
          flexDirection="column"
          cursor="pointer"
          onClick={() => navigate("/tours")}
        >
          <Flex w="100%" justify="center" align="center" mt="-150px">
            <Image src={tourImg} />
          </Flex>
          <Text fontSize="3xl" color="white" fontWeight="bold" mt="20">
            Tours
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Home;

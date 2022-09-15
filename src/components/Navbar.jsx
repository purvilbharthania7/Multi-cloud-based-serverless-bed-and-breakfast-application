import { Flex, Text } from "@chakra-ui/react";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../data/Context";

const Navbar = () => {
  const { userData, setUserData, setAccessToken } = useContext(Context);
  return (
    <Flex
      h="10vh"
      w="100%"
      justify="space-between"
      align="center"
      px="10"
      bg="#0AF"
      shadow="xl"
    >
      <Link to="/">
        <Text
          color="white"
          fontSize="xl"
          fontWeight="bold"
          textTransform="uppercase"
        >
          Serverless
        </Text>
      </Link>
      <Flex w="50%" h="100%" justify="space-evenly" align="center">
        <Link to="/kitchen">
          <Text color="white" fontSize="lg" textTransform="uppercase">
            Menu
          </Text>
        </Link>
        <Link to="/rooms">
          <Text color="white" fontSize="lg" textTransform="uppercase">
            Rooms
          </Text>
        </Link>
        <Link to="/tours">
          <Text color="white" fontSize="lg" textTransform="uppercase">
            Tours
          </Text>
        </Link>
        <Link to="/visualization">
          <Text color="white" fontSize="lg" textTransform="uppercase">
            Visualization
          </Text>
        </Link>
        <Link to="/report">
          <Text color="white" fontSize="lg" textTransform="uppercase">
            Report
          </Text>
        </Link>
      </Flex>
      <Flex w="30%" h="100%" justify="space-evenly" align="center">
        {userData && userData.email && userData.id ? (
          <>
            <Link to="/">
              <Text color="white">Hi, {userData.email}</Text>
            </Link>

            <Link to="/feedback">
              <Text color="white">Provide Feedback</Text>
            </Link>

            <Text
              color="red"
              onClick={() => {
                setAccessToken("");
                setUserData(null);
                localStorage.clear();
              }}
              cursor="pointer"
            >
              Logout
            </Text>
          </>
        ) : (
          <>
            <Link to="/login">
              <Text color="white">Login</Text>
            </Link>

            <Link to="/register">
              <Text color="white">Register</Text>
            </Link>
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default Navbar;

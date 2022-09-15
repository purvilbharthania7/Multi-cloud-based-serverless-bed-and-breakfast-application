import {
  Button,
  Flex,
  Text,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Popover,
  PopoverTrigger,
  PopoverHeader,
  PopoverBody,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FiArrowRight } from "react-icons/fi";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { BellIcon } from "@chakra-ui/icons";
import { Context } from "../data/Context";

const Tours = () => {
  const navigate = useNavigate();
  const { userData } = useContext(Context);
  const [days, setDays] = useState("");
  const [tourPackages, setTourPackages] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState("");

  const bookTour = (item) => {
    axios({
      method: "post",
      url: "https://5nhupytgtpouvoggkk7fsbfj7i0ukvnv.lambda-url.us-east-1.on.aws/",
      data: {
        userId: userData.id,
        packageName: item.Name,
        packagePrice: item.Price,
        type: item.type,
        startDate: startDate,
      },
    })
      .then(function (response) {
        axios({
          method: "post",
          url: "https://us-central1-project5410-20200120.cloudfunctions.net/booktour",
          data: {
            topic: "DalSoft5410",
            message: "Your tour reservation has been successfully done.",
          },
        }).then(function (response) {
          toast("Tour reservation done");
          navigate("/home");
        });
      })
      .catch((error) => {
        toast.error(
          "An error occured while booking the tour package. Please try after some time."
        );
        setIsLoading(false);
      });
  };

  const handleSubmit = () => {
    setIsLoading(true);
    axios({
      method: "post",
      url: "https://bazofv2g5w7ntl2hqjnctjnlta0hxsdi.lambda-url.us-east-1.on.aws/",
      data: {
        days: days,
      },
    })
      .then(function (response) {
        setIsLoading(false);
        setTourPackages(response.data);
      })
      .catch((error) => {
        toast.error("An error occured while fetching the tour packages.");
        setIsLoading(false);
      });
  };

  const fetchNotifications = () => {
    if (notificationMessage.length === 0) {
      axios({
        method: "post",
        url: "https://us-central1-project5410-20200120.cloudfunctions.net/subscriber",
        data: {
          type: "booktour",
        },
      })
        .then(function (response) {
          setNotificationMessage(response.data);
        })
        .catch((error) => {
          console.log(error);
          toast.error("An error occured while fetching notifications.");
        });
    }
  };

  return (
    <Flex w="100%" minH="100vh" flexDirection="column">
      <Navbar />
      {userData && userData.id && (
        <Flex w="100%" justify="flex-end" align="center" p="5">
          <Link to="/booked-tours">
            <Text color="#0AF">View Booked tours</Text>
          </Link>
          <Popover>
            <PopoverTrigger>
              <BellIcon
                colorScheme="blue"
                size="sm"
                margin="0em 2em"
                onClick={() => fetchNotifications()}
              />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Notifications!</PopoverHeader>
              <PopoverBody>{notificationMessage}</PopoverBody>
            </PopoverContent>
          </Popover>
        </Flex>
      )}
      <Flex w="100%" justify="center" align="center">
        <Flex
          w={["90%", "90%", "90%", "80%"]}
          h="100%"
          flexDirection={["column", "column", "column", "row"]}
        >
          <FormControl width="30%" mr="2">
            <FormLabel>Start Date</FormLabel>
            <Input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </FormControl>
          <FormControl width="30%" mr="2">
            <FormLabel>Number of days</FormLabel>
            <Input
              type="text"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder="Duration of the tour"
            />
          </FormControl>
          <IconButton
            icon={<FiArrowRight />}
            mt="8"
            w="50px"
            colorScheme="blue"
            disabled={!days.trim().length}
            onClick={handleSubmit}
            isLoading={isLoading}
          />
        </Flex>
      </Flex>
      <Flex flexWrap="wrap" justify="space-evenly" align="center" mt="5">
        {tourPackages &&
          tourPackages.map((item, index) => {
            return (
              <Flex
                key={index}
                w="30%"
                shadow="xl"
                rounded="xl"
                flexDirection="column"
                m="3"
                p="5"
              >
                <Text fontSize="xl" my="2">
                  {item.Name} - CAD {item.Price}
                </Text>
                <Text fontSize="s" my="5" className="desc-text-overflow">
                  {item.Hotel} in {item.city}
                </Text>
                {userData && userData.id ? (
                  <Button onClick={() => bookTour(item)} colorScheme="blue">
                    Book this tour
                  </Button>
                ) : (
                  <Button onClick={() => navigate("/login")} colorScheme="blue">
                    Login to book the tour
                  </Button>
                )}
              </Flex>
            );
          })}
      </Flex>
    </Flex>
  );
};

export default Tours;

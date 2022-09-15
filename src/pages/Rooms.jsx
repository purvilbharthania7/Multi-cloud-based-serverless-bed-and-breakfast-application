import {
  Button,
  Flex,
  Image,
  Text,
  Popover,
  PopoverTrigger,
  PopoverHeader,
  PopoverBody,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { BellIcon } from "@chakra-ui/icons";
import { fetchRooms } from "../config/LambdaUrl";
import { Context } from "../data/Context";

const Rooms = () => {
  const navigate = useNavigate();
  const { userData } = useContext(Context);
  const [rooms, setRooms] = useState([]);
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    axios
      .get(fetchRooms)
      .then((response) => {
        setRooms(response.data);
      })
      .catch((error) => {
        toast.error("Error fetching rooms");
      });
  }, []);

  const fetchNotifications = () => {
    if (notificationMessage.length === 0) {
      axios({
        method: "post",
        url: "https://us-central1-project5410-20200120.cloudfunctions.net/subscriber",
        data: {
          type: "bookroom",
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
          <Link to="/my-room-booking">
            <Text color="#0AF">View My Bookings</Text>
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

      <Flex flexWrap="wrap" justify="space-evenly" align="center" mt="10">
        {rooms.map((item, index) => {
          return (
            <Flex
              key={index}
              w="30%"
              shadow="xl"
              rounded="xl"
              flexDirection="column"
              m="3"
              p="5"
              onClick={() => navigate("/room/" + item.id, { state: item })}
            >
              <Image
                src={`https://source.unsplash.com/random?room&${item.id}`}
                w="100%"
                h="250px"
                objectFit="cover"
              />
              <Flex my="5" justify="space-between" align="center" p="3">
                <Text fontSize="xl">{item.name}</Text>
                <Text fontWeight="bold">${item.price}</Text>
              </Flex>
              <Button variant="outline" colorScheme="blue">
                Reserve
              </Button>
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
};

export default Rooms;

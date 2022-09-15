import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { checkRoomsAvailability, roomBook } from "../config/LambdaUrl";
import { Context } from "../data/Context";

function DaysBetween(startDate, endDate) {
  // The number of milliseconds in all UTC days (no DST)
  const oneDay = 1000 * 60 * 60 * 24;

  const StartDate = new Date(startDate);
  const EndDate = new Date(endDate);

  // A day in UTC always lasts 24 hours (unlike in other time formats)
  const start = Date.UTC(
    EndDate.getFullYear(),
    EndDate.getMonth(),
    EndDate.getDate()
  );
  const end = Date.UTC(
    StartDate.getFullYear(),
    StartDate.getMonth(),
    StartDate.getDate()
  );

  // so it's safe to divide by 24 hours
  return (start - end) / oneDay;
}

const SingleRoom = () => {
  const param = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [numberOfGuest, setNumberOfGuest] = useState(1);
  const [isAvailable, setIsAvailable] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [isBooking, setIsBooking] = useState(false);

  const { userData } = useContext(Context);

  const handleCheckAvailability = () => {
    if (!startDate) {
      toast.error("Please select start date");
      return;
    }
    if (!endDate) {
      toast.error("Please select end date");
      return;
    }
    if (numberOfGuest <= 0) {
      toast.error("Number of guest should be more than 0");
      return;
    }
    setIsAvailable(null);
    setIsChecking(true);
    axios
      .post(checkRoomsAvailability, {
        roomId: param.id,
        startDate: startDate.toString(),
        endDate: endDate.toString(),
      })
      .then((response) => {
        setIsAvailable(response.data.isAvailable);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error checking availability");
      })
      .finally(() => {
        setIsChecking(false);
      });
  };

  const handleBooking = () => {
    if (!startDate) {
      toast.error("Please select start date");
      return;
    }
    if (!endDate) {
      toast.error("Please select end date");
      return;
    }
    if (numberOfGuest <= 0) {
      toast.error("Number of guest should be more than 0");
      return;
    }
    setIsBooking(true);
    axios
      .post(roomBook, {
        userId: userData.id,
        roomId: param.id,
        startDate: startDate.toString(),
        endDate: endDate.toString(),
        guest: numberOfGuest,
        price: total,
      })
      .then(() => {
        setIsAvailable(null);
        setStartDate(null);
        setEndDate(null);
        axios({
          method: "post",
          url: "https://us-central1-project5410-20200120.cloudfunctions.net/bookroom",
          data: {
            topic: "DalSoft5410",
            message: "Your room has been booked successfully.",
          },
        }).then(function (response) {
          toast("Room booked successfully");
          navigate("/home");
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("error booking room");
      })
      .finally(() => {
        setIsBooking(false);
      });
  };

  useEffect(() => {
    if (!location.state || !location.state.id) {
      navigate("/rooms");
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (isAvailable) {
      const noOfDays = DaysBetween(startDate, endDate);
      setSubTotal(noOfDays * location.state.price);
      setTax(noOfDays * location.state.price * 0.12);
      setTotal(
        noOfDays * location.state.price + noOfDays * location.state.price * 0.12
      );
    }
  }, [endDate, isAvailable, location.state.price, startDate]);

  return (
    <Flex w="100%" minH="100vh" flexDirection="column">
      <Navbar />
      <Flex w="100%" h="100vh">
        <Flex w="40%">
          <Image
            src={`https://source.unsplash.com/random?room&${param.id}`}
            w="100%"
            h="100vh"
            objectFit="cover"
          />
        </Flex>
        <Flex w="60%" p="5" flexDirection="column">
          <Text fontSize="5xl">{location.state?.name}</Text>

          <Flex mt="10">
            <FormControl>
              <FormLabel>Start Date</FormLabel>
              <Input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </FormControl>

            <FormControl ml="3">
              <FormLabel>End Date</FormLabel>
              <Input
                type="date"
                min={
                  startDate && new Date(startDate).toISOString().split("T")[0]
                }
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </FormControl>
          </Flex>

          <FormControl mt="5">
            <FormLabel>Number of Guest</FormLabel>
            <Input
              type="number"
              value={numberOfGuest}
              onChange={(e) => setNumberOfGuest(e.target.value)}
            />
          </FormControl>

          <Button
            variant="outline"
            colorScheme="green"
            mt="10"
            w="250px"
            onClick={handleCheckAvailability}
            isLoading={isChecking}
          >
            Check Availability
          </Button>

          <Text color={isAvailable ? "green" : "red"} mt="5">
            {isAvailable === null
              ? ""
              : isAvailable
              ? "The room is available to book"
              : "Sorry, the room is unavailable on selected dates. "}
          </Text>

          {isAvailable && (
            <>
              <Flex w="100%" mt="10" flexDirection="column">
                <TableContainer w="100%">
                  <Table w="100%">
                    <Thead>
                      <Tr>
                        <Th>#</Th>
                        <Th>Price</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Th>
                          {DaysBetween(startDate, endDate)} Days *{" "}
                          {location.state.price}
                        </Th>
                        <Th>{subTotal}</Th>
                      </Tr>
                      <Tr>
                        <Th>Tax (12%)</Th>
                        <Th>{tax}</Th>
                      </Tr>
                      <Tr>
                        <Th>Total</Th>
                        <Th>{total}</Th>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>

                {userData && userData.id ? (
                  <Button
                    mt="10"
                    colorScheme="messenger"
                    onClick={handleBooking}
                    isLoading={isBooking}
                  >
                    Book
                  </Button>
                ) : (
                  <Button
                    mt="10"
                    colorScheme="messenger"
                    onClick={() => navigate("/login")}
                    isLoading={isBooking}
                  >
                    Login to book room
                  </Button>
                )}
              </Flex>
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default SingleRoom;

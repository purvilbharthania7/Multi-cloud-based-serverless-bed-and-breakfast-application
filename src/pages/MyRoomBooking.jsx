import {
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { retrieveMyRoomBookings } from "../config/LambdaUrl";
import { Context } from "../data/Context";

const MyRoomBooking = () => {
  const { userData } = useContext(Context);
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    if (!userData || !userData.id) {
      navigate("/rooms");
    }
  }, [navigate, userData]);

  useEffect(() => {
    if (!userData || !userData.id) {
      return;
    }
    axios
      .post(retrieveMyRoomBookings, { userId: userData.id })
      .then((response) => {
        setRooms(response.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error fetching your bookings");
      });
  }, [userData]);

  return (
    <Flex w="100%" minH="100vh" flexDirection="column">
      <Navbar />
      <TableContainer w="100%" mt="10">
        <Table w="100%">
          <Thead>
            <Tr>
              <Td>#</Td>
              <Td>Room Id</Td>
              <Td>Start Date</Td>
              <Td>End Date</Td>
              <Td>Guest</Td>
              <Td>Price</Td>
            </Tr>
          </Thead>
          <Tbody>
            {rooms.map((item, index) => {
              return (
                <Tr key={index}>
                  <Td>{index + 1}</Td>
                  <Td>{item.roomId}</Td>
                  <Td>{item.startDate}</Td>
                  <Td>{item.endDate}</Td>
                  <Td>{item.guest}</Td>
                  <Td>{item.price}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};

export default MyRoomBooking;

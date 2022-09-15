import {
    Flex,
    Table,
    TableContainer,
    Tbody,
    Td,
    Thead,
    Tr,
    Center,
    Button,
  } from "@chakra-ui/react";
  import axios from "axios";
  import React, { useContext, useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { toast } from "react-toastify";
  import Navbar from "../components/Navbar";
  import { Context } from "../data/Context";
  
  const BookedTours = () => {
    const { userData } = useContext(Context);
    const navigate = useNavigate();
  
    const [userTours, setUserTours] = useState([]);
  
    useEffect(() => {
      if (!userData || !userData.id) {
        return;
      }
      axios({
        method: "post",
        url: "https://oddqymfcgsydbo5dvolxrphkca0pgsdf.lambda-url.us-east-1.on.aws/",
        data: {
          userId: userData.id,
        },
      })
        .then((response) => {
          console.log(response);
          setUserTours(response.data);
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error fetching your tour package reservations.");
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
                <Td>Start Date</Td>
                <Td>Package Name</Td>
                <Td>Amount paid</Td>
                <Td>Booking ID</Td>
              </Tr>
            </Thead>
            <Tbody>
              {userTours &&
                userTours.map((item, index) => {
                  return (
                    <Tr key={index}>
                      <Td>{index + 1}</Td>
                      <Td>{item.startDate}</Td>
                      <Td>{item.package_name}</Td>
                      <Td>CAD {item.total_cost} .00</Td>
                      <Td>{item.booking_id}</Td>
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </TableContainer>
        <Center w="100%" color="white">
          <Button
            variant="outline"
            colorScheme="blue"
            onClick={() => navigate("/tours")}
            justifyContent="center"
            mt="5"
            width="20%"
          >
            Book another tour now!!
          </Button>
        </Center>
      </Flex>
    );
  };
  
  export default BookedTours;
  
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

const PastOrders = () => {
  const { userData } = useContext(Context);
  const navigate = useNavigate();

  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    if (!userData || !userData.id) {
      return;
    }
    axios({
      method: "post",
      url: "https://77v5j4qdxumchjlylhv3nb4j4e0shdws.lambda-url.us-east-1.on.aws/",
      data: {
        endpoint: "/fetchUserOrders",
        userId: userData.id,
      },
    })
      .then((response) => {
        console.log(response);
        setUserOrders(response.data.Items);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error fetching your order history");
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
              <Td>Order Date</Td>
              <Td>Order Items</Td>
              <Td>Total Quantity</Td>
              <Td>Amount paid</Td>
              <Td>Order Status</Td>
            </Tr>
          </Thead>
          <Tbody>
            {userOrders &&
              userOrders.map((item, index) => {
                let date = new Date(item.orderTime);
                date = date.toDateString();
                let orderItems = "";
                item.items.forEach((item) => {
                  orderItems += item.quantity + " " + item.name + ", ";
                });
                orderItems = orderItems.slice(0, -2);

                return (
                  <Tr key={index}>
                    <Td>{index + 1}</Td>
                    <Td>{date}</Td>
                    <Td>{orderItems}</Td>
                    <Td>{item.totalCartQuantity}</Td>
                    <Td>{item.totalAmount} .00 CAD</Td>
                    <Td>{item.orderStatus}</Td>
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
          onClick={() => navigate("/kitchen")}
          justifyContent="center"
          mt="5"
          width="20%"
        >
          Make a new order
        </Button>
      </Center>
    </Flex>
  );
};

export default PastOrders;

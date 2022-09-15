import {
  Button,
  Flex,
  Image,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Center,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverHeader,
  PopoverBody,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton
} from "@chakra-ui/react";
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { AddIcon, MinusIcon, BellIcon } from "@chakra-ui/icons";
import { Context } from "../data/Context";

const Kitchen = () => {
  const navigate = useNavigate();
  const { userData } = useContext(Context);
  const [menuItems, setMenuItems] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [orderCost, setOrderCost] = useState(0);
  const [totalCartQuantity, setTotalCartQuantity] = useState(0);
  const [viewMenuItems, setViewMenuItems] = useState(true);
  const [isOrdering, setIsOrdering] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  let cost = 0;

  const addtocart = (itemName, itemPrice) => {
    let index = cartItems.findIndex((item) => {
      return item.name === itemName;
    });
    if (cartItems.length > 0 && index >= 0) {
      const newCart = cartItems.map((item) => {
        if (item.name === itemName) {
          const updatedCart = {
            ...item,
            quantity: item.quantity + 1,
            cost: (item.quantity + 1) * itemPrice,
            price: itemPrice,
          };
          return updatedCart;
        }
        return item;
      });
      setCartItems(newCart);
    } else {
      setCartItems([
        ...cartItems,
        {
          name: itemName,
          quantity: 1,
          cost: itemPrice,
          price: itemPrice,
        },
      ]);
    }
    setTotalCartQuantity(totalCartQuantity + 1);
    setOrderCost(orderCost + parseInt(itemPrice));
  };

  const placeOrder = () => {
    setIsOrdering(true);
    let orderSummary = {
      id: Date.now().toString(),
      userId: userData.id,
      items: cartItems,
      orderTime: Date.now(),
      totalAmount: orderCost,
      totalCartQuantity: totalCartQuantity,
      orderStatus: "Your food is being prepared.",
    };
    axios({
      method: "post",
      url: "https://77v5j4qdxumchjlylhv3nb4j4e0shdws.lambda-url.us-east-1.on.aws/",
      data: {
        endpoint: "/orderFood",
        order: orderSummary,
      },
    })
      .then(function (response) {
        axios({
          method: "post",
          url: "https://us-central1-project5410-20200120.cloudfunctions.net/orderfood",
          data: {
            topic: "DalSoft5410",
            message:
              "Your order has been placed and is being prepared in the kitchen.",
          },
        }).then(function (response) {
          toast(
            "Your order has been placed and is being prepared in the kitchen."
          );
          setCartItems([]);
          navigate("/home");
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          "An error occured while ordering your food. Please try again in some time."
        );
      })
      .finally(() => {
        setIsOrdering(false);
      });
  };

  const fetchNotifications = () => {
    if (notificationMessage.length === 0) {
      axios({
        method: "post",
        url: "https://us-central1-project5410-20200120.cloudfunctions.net/subscriber",
        data: {
          type: "orderfood",
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

  const removefromcart = (itemName, itemPrice) => {
    let index = cartItems.findIndex((item) => {
      return item.name === itemName;
    });
    if (cartItems[index].quantity > 1) {
      const newCart = cartItems.map((item) => {
        if (item.name === itemName) {
          const updatedCart = {
            ...item,
            quantity: item.quantity - 1,
            cost: (item.quantity - 1) * itemPrice,
            price: itemPrice,
          };
          return updatedCart;
        }
        return item;
      });
      setCartItems(newCart);
    } else {
      let updatedCart = [];
      cartItems.splice(index, 1);
      console.log(cartItems);
      setCartItems(cartItems);
    }
    setTotalCartQuantity(totalCartQuantity - 1);
    setOrderCost(orderCost - parseInt(itemPrice));
  };

  useEffect(() => {
    axios({
      method: "post",
      url: "https://77v5j4qdxumchjlylhv3nb4j4e0shdws.lambda-url.us-east-1.on.aws/",
      data: {
        endpoint: "/fetchAllMenuItems",
      },
    }).then(function (response) {
      setMenuItems(response.data.Items);
    });
  }, []);

  return (
    <Flex w="100%" minH="100vh" flexDirection="column">
      <Navbar />
      {userData && userData.id && (
        <Flex w="100%" justify="flex-end" align="center" p="5">
          <Link to="/my-past-orders">
            <Text color="#0AF">View Previous Orders</Text>
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

          {/* </Link> */}
        </Flex>
      )}
      {viewMenuItems ? (
        <Flex flexWrap="wrap" justify="space-evenly" align="center" mt="5">
          {menuItems &&
            menuItems.map((item, index) => {
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
                  <Image src={item.img} w="100%" h="250px" objectFit="cover" />
                  <Text fontSize="xl" my="2">
                    {item.name} - CAD {item.price}
                  </Text>
                  <Text fontSize="s" my="5" className="desc-text-overflow">
                    {item.description}
                  </Text>
                  <Button
                    onClick={() => addtocart(item.name, item.price)}
                    colorScheme="blue"
                  >
                    {" "}
                    Add To Cart{" "}
                  </Button>
                </Flex>
              );
            })}
          {totalCartQuantity ? (
            <Button
              variant="outline"
              colorScheme="blue"
              onClick={() => setViewMenuItems(false)}
            >
              View Cart {totalCartQuantity ? "(" + totalCartQuantity + ")" : ""}
            </Button>
          ) : (
            false
          )}
        </Flex>
      ) : (
        <Flex flexWrap="wrap" align="center" mt="5">
          <TableContainer width="80%" m="0 10%">
            <Table variant="simple" maxWidth="100%">
              <TableCaption>Your total is: CAD {orderCost}.00</TableCaption>
              <Thead>
                <Tr>
                  <Th>Item</Th>
                  <Th>Quantity</Th>
                  <Th isNumeric>Cost</Th>
                  <Th isNumeric>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {cartItems &&
                  cartItems.map((item, index) => {
                    return (
                      <Tr>
                        <Td>{item.name}</Td>
                        <Td>{item.quantity}</Td>
                        <Td isNumeric>{item.cost}</Td>
                        <Td isNumeric>
                          <IconButton
                            colorScheme="blue"
                            aria-label="Add to cart"
                            icon={<AddIcon />}
                            size="sm"
                            margin="0em 2em"
                            onClick={() => addtocart(item.name, item.price)}
                            w="20%"
                          />
                          {cartItems.length > 0 &&
                          cartItems.findIndex((cartItem) => {
                            return cartItem.name === item.name;
                          }) >= 0 ? (
                            <IconButton
                              colorScheme="blue"
                              aria-label="Remover from cart"
                              icon={<MinusIcon />}
                              size="sm"
                              margin=" 0em"
                              fontSize="16px"
                              onClick={() =>
                                removefromcart(item.name, item.price)
                              }
                              w="20%"
                            />
                          ) : (
                            false
                          )}
                        </Td>
                      </Tr>
                    );
                  })}
              </Tbody>
            </Table>
          </TableContainer>
          <Center w="100%" color="white">
            {userData && userData.id ? (
              <Button
                variant="outline"
                colorScheme="blue"
                onClick={placeOrder}
                justifyContent="center"
                isLoading={isOrdering}
                mt="5"
                width="20%"
              >
                Place Order
              </Button>
            ) : (
              <Button
                mt="10"
                colorScheme="messenger"
                onClick={() => navigate("/login")}
                isLoading={isOrdering}
                width="20%"
              >
                Login to order food
              </Button>
            )}
          </Center>
          <Center w="100%" color="white">
            <Button
              variant="outline"
              colorScheme="blue"
              onClick={() => setViewMenuItems(true)}
              justifyContent="center"
              mt="5"
              width="20%"
            >
              View Menu
            </Button>
          </Center>
        </Flex>
      )}
    </Flex>
  );
};

export default Kitchen;

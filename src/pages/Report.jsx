import {
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Link,
  Tr,
  Button
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { retrieveMyRoomBookings } from "../config/LambdaUrl";
import { Context } from "../data/Context";

const Report = () => {
  const [reportData, setReportData] = useState({});
  const [downloadURL, setDownloadURL] = useState("");

  useEffect(() => {
    axios
      .get(
        "https://lnwkr3hiyd.execute-api.us-east-1.amazonaws.com/Staging/generateReport"
      )
      .then((response) => {
        setDownloadURL(response.data.url);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error fetching the report");
      });
    axios
      .post(
        "https://7hj36dzhvqdydlifl7u5l7zrhq0wuoxg.lambda-url.us-east-1.on.aws/"
      )
      .then((response) => {
        setReportData(response.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error fetching the report");
      });
  }, []);

  return (
    <Flex w="100%" minH="100vh" flexDirection="column">
      <Navbar />
      <TableContainer w="100%" mt="10">
        <Table w="100%">
          <Tbody>
            <Tr>
              <Td>Total number of users</Td>
              <Td>{reportData.users}</Td>
            </Tr>
            <Tr>
              <Td>Total number of food orders</Td>
              <Td>{reportData.orders}</Td>
            </Tr>
            <Tr>
              <Td>Total number of room bookings</Td>
              <Td>{reportData.rooms}</Td>
            </Tr>
            <Tr>
              <Td>Total number of tour reservations</Td>
              <Td>{reportData.tours}</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
      <Button>
        <Link mt="2" href={downloadURL}>
          Download Report
        </Link>
      </Button>
    </Flex>
  );
};

export default Report;

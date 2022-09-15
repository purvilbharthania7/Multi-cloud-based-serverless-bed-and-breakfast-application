import {
  Flex,
  IconButton,
  Image,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { saveCipher } from "../config/LambdaUrl";
import confusedImg from "../images/confused.svg";
import hackingGif from "../images/hacking.gif";
import lovedImg from "../images/loved.svg";
import neturalImg from "../images/netural.svg";
import sadImg from "../images/sad.svg";

const RegisterCipher = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sliderValue, setSliderValue] = useState(5);
  const [userInfo, setUserInfo] = useState(null);

  const handleClick = () => {
    axios
      .post(saveCipher, { id: userInfo.id, key: sliderValue })
      .then(() => {
        navigate("/verify-email");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  useEffect(() => {
    if (location.state && location.state.id) {
      setUserInfo({ ...location.state });
    } else {
      const data = JSON.parse(
        localStorage.getItem("register-user-info") || "{}"
      );
      if (data && data.id) {
        setUserInfo({ ...data });
      } else {
        navigate("/register");
        return;
      }
    }
  }, [location.state, navigate]);

  return (
    <Flex w="100%" h="100vh" justify="center" align="center">
      <Flex
        w={["90%", "90%", "90%", "80%"]}
        h="100%"
        flexDirection={["column", "column", "column", "row"]}
      >
        <Flex
          w={["100%", "100%", "100%", "50%"]}
          justify="center"
          flexDirection="column"
          order={[2, 2, 2, 1]}
        >
          <Text fontWeight="bold" mt="5" color="gold">
            STEP 3 / 3
          </Text>
          {userInfo && userInfo.email && (
            <Text mt="4" fontSize="sm">
              Hi, {userInfo.email}
            </Text>
          )}
          <Text fontSize={["3xl", "3xl", "5xl"]} mt={[10, 10, 10, 0]}>
            Pick your cipher key
          </Text>

          <Text fontSize="xl" mt="3">
            How much secure your account do you want?
          </Text>

          <Flex w="100%" justify="center" mt="10">
            {sliderValue >= 1 && sliderValue <= 6 ? (
              <Flex flexDirection="column" align="center" justify="center">
                <Image src={sadImg} w="200px" h="200px" />
                <Text mt="3" fontWeight="bold" textTransform="uppercase">
                  I don't care about security
                </Text>
              </Flex>
            ) : (
              <span />
            )}

            {sliderValue >= 7 && sliderValue <= 12 ? (
              <Flex flexDirection="column" align="center" justify="center">
                <Image src={confusedImg} w="200px" h="200px" />
                <Text mt="3" fontWeight="bold" textTransform="uppercase">
                  I somehow care about security
                </Text>
              </Flex>
            ) : (
              <span />
            )}

            {sliderValue >= 13 && sliderValue <= 18 ? (
              <Flex flexDirection="column" align="center" justify="center">
                <Image src={neturalImg} w="200px" h="200px" />
                <Text mt="3" fontWeight="bold" textTransform="uppercase">
                  Security is important
                </Text>
              </Flex>
            ) : (
              <span />
            )}

            {sliderValue >= 19 && sliderValue <= 26 ? (
              <Flex flexDirection="column" align="center" justify="center">
                <Image src={lovedImg} w="200px" h="200px" />
                <Text mt="3" fontWeight="bold" textTransform="uppercase">
                  Security is everything
                </Text>
              </Flex>
            ) : (
              <span />
            )}
          </Flex>

          <Flex justify="center" align="center" mt="10">
            <Slider
              aria-label="slider-ex-6"
              onChange={(val) => setSliderValue(val)}
              min={1}
              max={26}
              mx="10"
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>

            <Text fontSize="2xl">{sliderValue}</Text>
          </Flex>

          <IconButton
            icon={<FiArrowRight />}
            mt="10"
            w="50px"
            colorScheme="blue"
            onClick={handleClick}
          />
        </Flex>
        <Flex
          w={["100%", "100%", "100%", "50%"]}
          justify="center"
          align="center"
          order={[1, 1, 1, 2]}
        >
          <Image src={hackingGif} w="80%" h="100%" objectFit="contain" />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default RegisterCipher;

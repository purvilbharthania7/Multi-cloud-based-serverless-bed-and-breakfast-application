import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Image,
  Input,
  Text,
} from "@chakra-ui/react";
import React from "react";
import siginpgif from "../images/login.gif";
import { FiArrowRight } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import YupPassword from "yup-password";
import { cognito } from "../config/Cognito";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { toast } from "react-toastify";
import jwtDecode from "jwt-decode";
YupPassword(yup);

const validationSchema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().password(),
});

const Login = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values, action) => {
      action.setSubmitting(true);
      const authDetails = {
        Username: values.email,
        Password: values.password,
      };

      const authenticationDetails = new AuthenticationDetails(authDetails);
      const userData = {
        Username: values.email,
        Pool: cognito,
      };

      const cognitoUser = new CognitoUser(userData);

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          const decoded = jwtDecode(result.getAccessToken().getJwtToken());
          navigate("/login-security-question", {
            state: {
              email: values.email,
              id: decoded.sub,
              token: result.getAccessToken().getJwtToken(),
            },
          });
          formik.setSubmitting(false);
          action.resetForm();
        },
        onFailure: (error) => {
          toast.error(error.message);
          formik.setSubmitting(false);
        },
      });
    },
    validationSchema,
  });

  return (
    <Flex w="100%" h="100vh" justify="center" align="center">
      <Flex
        w={["90%", "90%", "90%", "80%"]}
        h="100%"
        flexDirection={["column", "column", "column", "row"]}
      >
        <Flex
          w={["100%", "100%", "100%", "50%"]}
          justify={["center", "center", "flex-start"]}
        >
          <Image src={siginpgif} w="80%" h="100%" objectFit="contain" />
        </Flex>
        <Flex
          w={["100%", "100%", "100%", "50%"]}
          justify="center"
          flexDirection="column"
        >
          <Text fontSize={["3xl", "3xl", "5xl"]} mt={[10, 10, 10, 0]}>
            Sign In
          </Text>
          <FormControl
            mt="10"
            isInvalid={formik.touched.email && formik.errors.email}
          >
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              background="gray.50"
              {...formik.getFieldProps("email")}
            />
            <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
          </FormControl>
          <FormControl
            mt="3"
            isInvalid={formik.touched.password && formik.errors.password}
          >
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              background="gray.50"
              {...formik.getFieldProps("password")}
            />
            <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
          </FormControl>

          <IconButton
            icon={<FiArrowRight />}
            mt="10"
            w="50px"
            colorScheme="blue"
            onClick={formik.handleSubmit}
            isLoading={formik.isSubmitting}
            isDisabled={!formik.isValid}
          />

          <Link to="/register">
            <Text mt="5" color="#0AF">
              New Here! Create an account...
            </Text>
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Login;

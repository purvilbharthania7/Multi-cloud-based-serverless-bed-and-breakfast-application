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
import { useFormik } from "formik";
import React from "react";
import { FiArrowRight } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import YupPassword from "yup-password";
import { cognito } from "../config/Cognito";
import signupgif from "../images/signup.gif";
YupPassword(yup);

const validationSchema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().password(),
  name: yup.string().required().min(3),
});

const Register = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      name: "",
    },
    validationSchema,
    onSubmit: (values, action) => {
      action.setSubmitting(true);
      cognito.signUp(values.email, values.password, [], null, (err, result) => {
        if (err) {
          toast.error(err.message);
          action.setSubmitting(false);
          return;
        }
        console.log(result.userSub);
        const data = {
          email: values.email,
          name: values.name,
          id: result.userSub,
        };
        localStorage.setItem("register-user-info", JSON.stringify(data));
        action.resetForm();
        navigate("/register-security-question", {
          state: data,
        });
      });
    },
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
          justify="center"
          flexDirection="column"
          order={[2, 2, 2, 1]}
        >
          <Text fontWeight="bold" mt="5" color="gold">
            STEP 1 / 3
          </Text>
          <Text fontSize={["3xl", "3xl", "5xl"]} mt={[10, 10, 10, 0]}>
            Sign Up
          </Text>

          <Flex w="100%" mt="10" justify="space-evenly">
            <FormControl
              w="50%"
              isInvalid={formik.touched.name && formik.errors.name}
            >
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                background="gray.50"
                {...formik.getFieldProps("name")}
              />
              <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl
              w="50%"
              ml="3"
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
          </Flex>
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
            isLoading={formik.isSubmitting}
            isDisabled={!formik.isValid}
            onClick={formik.handleSubmit}
          />

          <Link to="/login">
            <Text mt="5" color="#0AF">
              Already have account? Login Here...
            </Text>
          </Link>
        </Flex>
        <Flex
          w={["100%", "100%", "100%", "50%"]}
          justify="center"
          align="center"
          order={[1, 1, 1, 2]}
        >
          <Image src={signupgif} w="80%" h="100%" objectFit="contain" />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Register;

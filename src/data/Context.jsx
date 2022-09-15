import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getUserInfo } from "../config/LambdaUrl";

export const Context = createContext(null);

export const ContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState("");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const decoded = jwt_decode(accessToken);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("accessToken");
        setAccessToken("");

        navigate("/");
        return;
      }
      axios
        .post(getUserInfo, { id: decoded.sub })
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.log(error.message);
        });
      setAccessToken(accessToken);
    } catch (error) {}
  }, [navigate]);

  return (
    <Context.Provider
      value={{
        accessToken,
        setAccessToken,
        userData,
        setUserData,
      }}
    >
      {children}
    </Context.Provider>
  );
};

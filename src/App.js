import { ChakraProvider, theme } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Chatbot from "./components/Chatbot";
import { ContextProvider } from "./data/Context";
import AppRoutes from "./Routes";

function App() {
  return (
    <BrowserRouter>
      <ContextProvider>
        <ChakraProvider theme={theme}>
          <AppRoutes />
          <Chatbot />
          <ToastContainer />
        </ChakraProvider>
      </ContextProvider>
    </BrowserRouter>
  );
}

export default App;

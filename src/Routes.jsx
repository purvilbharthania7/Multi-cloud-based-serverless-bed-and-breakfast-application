import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import LoginCipher from "./pages/LoginCipher";
import LoginQuestions from "./pages/LoginQuestions";
import MyRoomBooking from "./pages/MyRoomBooking";
import Register from "./pages/Register";
import RegisterCipher from "./pages/RegisterCipher";
import RegisterQuestions from "./pages/RegisterQuestions";
import Rooms from "./pages/Rooms";
import SingleRoom from "./pages/SingleRoom";
import VerifyEmail from "./pages/VerifyEmail";
import Kitchen from "./pages/Kitchen";
import PastOrders from "./pages/PastOrders";
import Visualization from "./pages/Visualization";
import Tours from "./pages/Tours";
import BookedTours from "./pages/BookedTours";
import Feedback from "./pages/Feedback";
import Report from "./pages/Report";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/register-security-question"
        element={<RegisterQuestions />}
      />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/register-cipher" element={<RegisterCipher />} />
      <Route path="/login-security-question" element={<LoginQuestions />} />
      <Route path="/login-cipher" element={<LoginCipher />} />
      <Route path="/kitchen" element={<Kitchen />} />
      <Route path="/rooms" element={<Rooms />} />
      <Route path="/room/:id" element={<SingleRoom />} />
      <Route path="/my-room-booking" element={<MyRoomBooking />} />
      <Route path="/my-past-orders" element={<PastOrders />} />
      <Route path="/visualization" element={<Visualization />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/booked-tours" element={<BookedTours />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/report" element={<Report />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;

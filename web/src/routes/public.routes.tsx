import React from "react";
import { Route } from "react-router-dom";

import About from "../pages/About";
import Contact from "../pages/Contact";
import ForgotPassword from "../pages/ForgotPassword";
import Home from "../pages/Home";
import HeroSection from "../pages/Home/HeroSection";
import ResetPassword from "../pages/ResetPassword";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";

const publicRoutes = (
  <Route>
    <Route path="/" element={<Home />}>
      <Route index element={<HeroSection />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Route>
    <Route path="/signin" element={<SignIn />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/forgotpassword" element={<ForgotPassword />} />
    <Route path="/resetpassword" element={<ResetPassword />} />
  </Route>
);

export default publicRoutes;

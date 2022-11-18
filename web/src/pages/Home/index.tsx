import React from "react";
import { Outlet } from "react-router-dom";

import Footer from "./Footer";
import NavBar from "./NavBar";

const Home: React.FC = () => {
  return (
    <>
      <header>
        <NavBar />
      </header>
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Home;

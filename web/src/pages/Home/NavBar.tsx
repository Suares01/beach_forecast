import { Button, Navbar } from "flowbite-react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import logo from "../../assets/logo.png";

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navigation = [
    {
      name: "Home",
      to: "/",
      isCurrent: pathname === "/" ? true : false,
    },
    {
      name: "About",
      to: "/about",
      isCurrent: pathname === "/about" ? true : false,
    },
    {
      name: "Contact",
      to: "/contact",
      isCurrent: pathname === "/contact" ? true : false,
    },
  ];

  return (
    <Navbar fluid={true}>
      <Navbar.Brand>
        <img src={logo} className="mr-3 h-6 sm:h-9" alt="Beach Forecast Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Beach Forecast
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Button onClick={() => navigate("/signin")}>Sign in</Button>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        {navigation.map(({ isCurrent, name, to }) => (
          <Navbar.Link
            key={name}
            onClick={(event) => {
              event.preventDefault();
              navigate(to);
            }}
            active={isCurrent}
            className="cursor-pointer"
          >
            {name}
          </Navbar.Link>
        ))}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;

import { Dropdown, Navbar } from "flowbite-react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import logo from "../../assets/logo.png";
import { useAuth } from "../../contexts/auth";
import RandomAvatar from "../RandomAvatar";

type Navigation = {
  name: string;
  to: string;
  isCurrent: boolean;
};

const DashboardNavbar: React.FC = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navigation: Navigation[] = [
    {
      name: "Dashboard",
      to: "/dashboard",
      isCurrent: pathname === "/dashboard" ? true : false,
    },
    {
      name: "Beaches",
      to: "/beaches",
      isCurrent: pathname === "/beaches" ? true : false,
    },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  return (
    <Navbar fluid={true}>
      <Navbar.Brand>
        <img src={logo} className="mr-3 h-6 sm:h-9" alt="Beach Forecast Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Beach Forecast
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline={true}
          label={<RandomAvatar alt="User settings" rounded={true} />}
        >
          <Dropdown.Header className="mx-5">
            <span className="block text-sm text-center">{user?.username}</span>
          </Dropdown.Header>
          <Dropdown.Item>Profile</Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
        </Dropdown>
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

export default DashboardNavbar;

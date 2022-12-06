"use client";
import React, { useContext } from "react";
import Avatar from "../primitives/Avatar";
import { userContext } from "./UserContext";
import SignIn from "../primitives/SignIn";
import { useMediaQuery } from "react-responsive";
import NavDrawer from "../primitives/NavDrawer";

const Header = () => {
  const user = useContext(userContext);
  return (
    <div className="flex relative py-2 px-8 justify-between">
      <NavDrawer />
      {user.userAuth ? <Avatar /> : <SignIn />}
    </div>
  );
};

export default Header;

"use client";
import cx from "classnames";
import React, { useContext } from "react";
import Link from "next/link";
import NavigationMenu from "../primitives/NavigationMenu";
import Avatar from "../primitives/Avatar";
import { userContext } from "./UserContext";
import SignIn from "../primitives/SignIn";
import { useMediaQuery } from "react-responsive";
import NavDrawer from "../primitives/NavDrawer";

const Header = () => {
  const user = useContext(userContext);
  const showNav = useMediaQuery({ query: "(min-width: 420px)" });
  return (
    <div className="flex relative py-2 px-8 justify-between">
      {showNav ? <NavigationMenu /> : <NavDrawer />}
      {user.userAuth ? <Avatar /> : <SignIn />}
    </div>
  );
};

export default Header;

"use client";
import React, { useContext } from "react";
import Avatar from "../primitives/Avatar";
import { userContext } from "./UserContext";
import SignIn from "../primitives/SignIn";
import NavDrawer from "../primitives/NavDrawer";
import SearchBasicDialog from "../components/SearchBasicDialog";

const Header = () => {
  const user = useContext(userContext);
  return (
    <div className="flex relative py-2 px-8 justify-between">
      <NavDrawer />
      <div className="flex gap-4 items-center">
        <SearchBasicDialog />
        {user.userAuth ? <Avatar /> : <SignIn />}
      </div>
    </div>
  );
};

export default Header;

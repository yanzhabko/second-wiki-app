import { useState } from "react";
import type { FC } from "react";
import { NavLink } from "react-router-dom";
import Title from "./ux/Title";
import Burger from "./ux/header/Burger";
import LaptopNav from "./ux/header/LaptopNav";
import { useAuth } from "../providers/AuthProvider";

const Header: FC = () => {
  const [open, setOpen] = useState(false);
  const [isProfile, setProfile] = useState(false);
  const { user } = useAuth();

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleClickOpen = () => {
    setProfile(!isProfile);
  };

  const handleClickClose = () => {
    setProfile(false);
  };

  return (
    <header className="bg-transparent w-full p-[14px] md:py-[14px] md:px-[24px]">
      <div className="bg-white flex flex-row items-center justify-between px-[25px] py-[10px] lg:px-[40px] lg:py-[20px] rounded-3xl shadow-md">
        <NavLink
          to="/"
          className="flex z-10 relative"
          onClick={handleClickClose}
        >
          <Title title="Second" type="title" className="!text-purple-300" />
          <Title title="Life" type="title" className="!text-purple-300" />
          <Title
            title={user?.role == "admin" ? "Admin" : "Wiki"}
            type="title"
            className={`${
              user?.role == "admin" ? "text-red-500" : "text-black"
            } absolute right-[-20px] top-[-11px] !text-[14px]`}
          />
        </NavLink>

        <LaptopNav
          isActive={isProfile}
          onOpen={handleClickOpen}
          onClose={handleClickClose}
        />

        <Burger onClick={handleOpen} open={open} />
      </div>
    </header>
  );
};

export default Header;

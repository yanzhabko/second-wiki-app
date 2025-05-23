import type { FC } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Button from "../Button";
import Title from "../Title";
import { navLinks } from "../../../lib";
import { useAuth } from "../../../providers/AuthProvider";
import profile from "../../../image/profile.png";

interface LaptopNavProps {
  onClose: () => void;
  onOpen: () => void;
  isActive: boolean;
}

const LaptopNav: FC<LaptopNavProps> = ({ onClose, onOpen, isActive }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <>
      <nav className="hidden gap-8 lg:flex z-10">
        {navLinks.map((item, index) => (
          <NavLink
            key={index}
            to={item.href}
            className={({ isActive }) =>
              `${
                isActive ||
                (location.pathname.startsWith(item.href) && item.href !== "/")
                  ? "relative before:absolute before:w-full before:h-0.5 before:top-full before:bg-purple-500"
                  : ""
              } transition-all duration-200 hover:text-purple-500 relative hover:before:absolute hover:before:w-full hover:before:h-0.5 hover:before:top-full hover:before:bg-purple-500`
            }
            onClick={onClose}
          >
            <Title title={item.title} type="subtitle" />
          </NavLink>
        ))}
      </nav>
      {user ? (
        <>
          <div className="relative hidden lg:flex">
            <div
              className="px-2 py-2 cursor-pointer text-center rounded-lg bg-purple-400 hover:bg-purple-500"
              onClick={onOpen}
            >
              <img src={profile} alt="Cabinet" className="w-[30px] h-[30px]" />
            </div>
            <nav
              className={`${
                isActive ? "block" : "hidden"
              } absolute rounded-md top-[110%] right-0 bg-purple-400 flex flex-col z-10`}
            >
              <Button
                types="submenu"
                title="Профіль"
                href="/profile"
                className="text-white px-3 py-2 rounded-md font-medium bg-purple-400 active:bg-purple-300 hover:bg-purple-300"
                onClick={onClose}
              />
              <Button
                types="login"
                title="Вийти"
                className="text-white px-3 py-2 rounded-md font-medium bg-purple-400 active:bg-purple-300 hover:bg-purple-300"
                onClick={() => {
                  logout();
                  onClose();
                }}
              />
            </nav>
          </div>

          <div
            className={`${
              isActive ? "block" : "hidden"
            } absolute top-0 left-0 w-[100vw] h-[100vh] bg-transparent`}
            onClick={onClose}
          />
        </>
      ) : (
        <div className="gap-4 hidden lg:flex">
          <Button types="link" title="Увійти" href="/signin" />
        </div>
      )}
    </>
  );
};

export default LaptopNav;

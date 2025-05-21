import type { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import Title from "../Title";
import { profileLink } from "../../../lib";

const Navbar: FC = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <aside className="lg:w-[20%] h-full bg-white rounded-lg py-5 flex flex-col gap-2 items-center">
      <Title type="title" title="Навігація" className="text-purple-500" />
      <nav className="flex flex-col gap-2 items-center">
        {profileLink.map((item, index) => (
          <Link
            to={item.href}
            key={index}
            className={`${path.endsWith(item.href) ? "text-purple-500" : ""}`}
          >
            <Title
              type="subtitle"
              title={item.title}
              className="font-semibold"
            />
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Navbar;

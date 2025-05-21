import type { FC } from "react";

interface BurgerProps {
  open: boolean;
  onClick: () => void;
}

const Burger: FC<BurgerProps> = ({ open, onClick }) => {
  return (
    <div className="flex items-center justify-center lg:hidden">
      <div
        className={`group flex cursor-pointer items-center justify-center ${
          open ? "active" : null
        }`}
        onClick={onClick}
      >
        <div className="space-y-1">
          <span
            className={`block h-[2px] w-5 origin-center rounded-full bg-purple-400 transition-transform ease-in-out ${
              open
                ? "translate-y-[0.25rem] rotate-45"
                : "translate-y-0 rotate-0"
            }`}
          ></span>
          <span
            className={`block h-[2px] w-5 origin-center rounded-full bg-purple-400 transition-transform ease-in-out ${
              open ? "hidden" : null
            }`}
          ></span>
          <span
            className={`block h-[2px] w-5  origin-center rounded-full bg-purple-400 transition-transform ease-in-out ${
              open
                ? "-translate-y-[0.15rem] -rotate-45"
                : "translate-y-0 rotate-0"
            }`}
          ></span>
        </div>
      </div>
    </div>
  );
};

export default Burger;

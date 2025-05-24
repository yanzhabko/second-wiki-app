import type { FC } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface ButtonProps {
  title?: string | undefined | null;
  className?: string;
  onClick?: (e: unknown) => void;
  tag?: "div" | "button" | "a";
  types: "login" | "link" | "submenu" | "copy";
  href?: string;
}

const Button: FC<ButtonProps> = ({
  title,
  className,
  onClick,
  tag = "div",
  types,
  href,
}) => {
  const Tag = tag;
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (href) {
      navigator.clipboard.writeText(href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const ButtonContext = () => {
    if (types === "login") {
      return (
        <Tag
          type="submit"
          href={href}
          onClick={onClick}
          className={`${className} px-4 py-2 cursor-pointer text-center w-auto text-2 lg:text-3 lg:px-5 lg:py-1 xl:px-10 rounded-lg text-white font-semibold bg-purple-400 hover:bg-purple-500`}
        >
          {title}
        </Tag>
      );
    } else if (types === "link") {
      return (
        <Link to={href === undefined ? "/" : href}>
          <Tag
            onClick={onClick}
            className={`${className} cursor-pointer text-center text-1  w-auto px-3 py-2 lg:px-5 rounded-lg text-white font-semibold bg-purple-400 hover:bg-purple-500`}
          >
            {title}
          </Tag>
        </Link>
      );
    } else if (types === "submenu") {
      return (
        <Link to={href === undefined ? "/" : href}>
          <Tag
            onClick={onClick}
            className={`${className} cursor-pointer text-center w-auto `}
          >
            {title}
          </Tag>
        </Link>
      );
    } else if (types === "copy") {
      return (
        <button
          onClick={copyToClipboard}
          className={`${className} p-2 text-white flex  items-center justify-center bg-purple-500  font-medium rounded-md hover:bg-purple-600`}
        >
          {copied ? "Скопійовано!" : "Копіювати IP"}
        </button>
      );
    } else {
      return null;
    }
  };
  return <>{ButtonContext()}</>;
};

export default Button;

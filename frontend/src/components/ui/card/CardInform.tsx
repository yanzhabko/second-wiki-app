import type { FC } from "react";
import Title from "../Title";
import Button from "../Button";
import { Link } from "react-router-dom";

interface CardProps {
  title: string;
  description: string;
  linkText?: string;
  linkHref?: string;
  isButton?: boolean;
  customClass?: string;
}

const CardInformation: FC<CardProps> = ({
  title,
  description,
  linkText,
  linkHref,
  isButton,
  customClass = "",
}) => {
  return (
    <div
      className={`relative w-full h-full flex flex-col gap-4 p-4 flex-grow justify-center items-center rounded-lg bg-center bg-no-repeat bg-cover bg-purple-400 ${customClass}`}
    >
      <Title
        title={title}
        type="title"
        tag="p"
        className="text-white text-lg !font-[500]"
      />
      <Title
        title={description}
        type="title"
        tag="p"
        className="text-white text-sm !font-[400]"
      />
      {isButton ? (
        <Button types="copy" href={linkHref} />
      ) : (
        <Link
          to={linkHref ?? ""}
          target="_blank"
          className="p-2 text-white flex items-center justify-center bg-purple-500 font-medium rounded-md hover:bg-purple-600"
        >
          {linkText}
        </Link>
      )}
    </div>
  );
};

export default CardInformation;

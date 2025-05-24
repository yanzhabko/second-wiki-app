import type { FC } from "react";

interface TitleProps {
  title: string | null | undefined;
  className?: string;
  type: "title" | "subtitle" | "text";
  tag?: "h1" | "p";
}

const Title: FC<TitleProps> = ({ title, className, type, tag }) => {
  const Tag = !tag && type === "title" ? "h1" : "p";
  const TitleContext = () => {
    if (type === "title") {
      return (
        <Tag
          className={`${className} font-semibold text-2 sm:text-3 lg:text-4 `}
        >
          {title}
        </Tag>
      );
    } else if (type === "subtitle") {
      return (
        <Tag className={`${className} text-1  xl:text-3 font-medium`}>
          {title}
        </Tag>
      );
    } else if (type === "text") {
      return <Tag className={`${className} text-1`}>{title}</Tag>;
    } else {
      return null;
    }
  };
  return <>{TitleContext()}</>;
};

export default Title;

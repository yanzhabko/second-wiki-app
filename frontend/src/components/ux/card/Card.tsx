import { FC } from "react";
// import profile from "../../../image/profile.jpg";
import { useImage } from "../../../hooks/useImage";

interface CardProps {
  type: string;
  title?: string;
  description: string;
  imageId: string;
  tag: string[];
}

const Card: FC<CardProps> = ({ type, title, imageId, description }) => {
  const { imageUrl } = useImage(imageId);
  return (
    <div className="w-auto h-full flex flex-col shadow-2xl rounded-md bg-white py-[15px]">
      <img src={imageUrl ?? ""} alt={title || "clothes image"} />
      <span className=" py-[5px] px-[20px] font-bold">
        {type + " " + (title ?? "")}
      </span>
      <span className="px-[20px] font-[400] text-gray-500">{description}</span>
    </div>
  );
};

export default Card;

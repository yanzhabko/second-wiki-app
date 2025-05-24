import type { FC } from "react";
import Title from "./ux/Title";

const Footer: FC = () => {
  return (
    <footer className="bg-transparent w-full py-[14px] px-[24px]">
      <div className="bg-white flex flex-row items-center justify-center px-[25px] py-[10px] lg:px-[40px] lg:py-[20px] rounded-3xl shadow-md">
        <div className="container flex flex-wrap flex-col justify-center items-center gap-2">
          <div className="flex flex-wrap items-center justify-center text-center gap-1">
            <Title title="Наш проєкт не пов'язаний з" type="subtitle" />
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://secondliferp.com.ua/"
            >
              <Title
                type="subtitle"
                title="SecondLifeRP."
                className="text-blue-500"
              />
            </a>
            <Title
              title="Весь контент і матеріали належать власникам"
              type="subtitle"
            />
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://secondliferp.com.ua/"
            >
              <Title
                type="subtitle"
                title="SecondLifeRP."
                className="text-blue-500"
              />
            </a>
          </div>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://yanzhabko.vercel.app/"
          >
            <Title
              type="text"
              title="Розробник - yanzhabko"
              className="text-blue-500"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

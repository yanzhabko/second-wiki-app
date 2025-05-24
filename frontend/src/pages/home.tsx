import Title from "../components/ui/Title";
import CardInformation from "../components/ui/card/CardInform";
import image from "../image/home/home.webp";

const Home = () => {
  return (
    <>
      <section className="h-[calc(90vh-120px)] relative">
        <img
          src={image}
          alt=""
          className="absolute top-[45%] left-[50%] transform -translate-x-1/2 -translate-y-1/2"
        />
        <div className="flex flex-col items-center w-full absolute top-[70%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
          <div className="flex items-center gap-2">
            <Title title="SecondLife" type="title" className="!text-[32px]" />
            <Title
              title="WIKI"
              type="title"
              tag="p"
              className="bg-purple-400 rounded-md px-4 text-white"
            />
          </div>
          <Title
            title="Платформа, де ви знайдете всю детальну інформацію про найнеобхідніше в цій грі."
            type="title"
            tag="p"
            className="!text-[16px]"
          />
        </div>
      </section>
      <section className="mb-[100px]">
        <Title
          title="Як почати грати?"
          type="title"
          tag="h1"
          className="!text-[32px] text-black"
        />
        <div className="flex flex-wrap -mx-2 mt-4">
          <div className="w-full sm:w-1/2 md:w-1/3 px-2">
            <CardInformation
              title="Придбайте ліцензійну копію GTAV"
              description="Для гри на проєкті підійде ліцензійна версія Grand Theft Auto V від Rockstar із офіційних сайтів: Steam, Epic Games або Social Club."
              linkText="Придбати у Steam"
              linkHref="https://store.steampowered.com/agecheck/app/271590/"
            />
          </div>
          <div className="w-full sm:w-1/2 md:w-1/3 px-2">
            <CardInformation
              title="Встановити RAGE"
              description="Сервер працює на базі RAGE Multiplayer. Для входу на сервер вам треба мати клієнт RAGE MP, який можна завантажити нижче."
              linkText="Завантажити RAGE MP"
              linkHref="https://rage.mp/"
            />
          </div>
          <div className="w-full sm:w-1/2 md:w-1/3 px-2">
            <CardInformation
              title="Під'єднатись до сервера"
              description="Знайдіть проєкт SecondLife у пошуку RAGE або скопіюйте IP і підключіться напряму."
              linkHref="game.secondliferp.com.ua"
              isButton
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;

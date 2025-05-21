import { useAuth } from "../providers/AuthProvider";
import { useForm } from "react-hook-form";
import Input from "../components/ux/Input";
import Error from "../components/error";
import Title from "../components/ux/Title";
import { Link } from "react-router-dom";

type SingInType = {
  email: string;
  password: string;
};

function SingIn() {
  const { user, login } = useAuth();
  const { register, handleSubmit } = useForm<SingInType>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async ({ password, email }: SingInType) => {
    await login(email, password);
  };

  if (user) {
    return <Error />;
  }

  return (
    <section className="h-[calc(100vh-230px)] flex flex-col justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto flex flex-col gap-5 justify-center items-center bg-white rounded-lg shadow-lg md:w-[calc(100%-40%)] xl:w-[40%] p-10"
      >
        <Title title="Авторизація" type="title" className="text-purple-400" />
        <Input label="Елеткрона пошта" {...register("email")} />
        <Input label="Пароль" {...register("password")} />
        <button
          type="submit"
          className=" px-4 py-2 cursor-pointer text-center w-auto text-2 lg:text-3 lg:px-5 lg:py-1 xl:px-10 rounded-lg text-white font-semibold bg-purple-400 hover:bg-purple-500"
        >
          Увійти
        </button>
        <div className="flex gap-1">
          <Title title="Не пам'ятаєш пароль?" type="text" />
          <Link
            to="/recovery"
            className="text-blue-500 font-semibold text-1 hover:text-blue-700"
          >
            Забули пароль
          </Link>
        </div>
      </form>
    </section>
  );
}

export default SingIn;

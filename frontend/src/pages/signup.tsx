import { useAuth } from "../providers/AuthProvider";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Input from "../components/ui/Input";
import Error from "../components/ui/error";
import Title from "../components/ui/Title";

type SingUpType = {
  username: string;
  password: string;
  confirmedPassword: string;
};

function SingUp() {
  const { user, register: registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SingUpType>({
    defaultValues: {
      username: "",
      password: "",
      confirmedPassword: "",
    },
  });
  const password = watch("password");
  const onSubmit = async ({ password, username }: SingUpType) => {
    await registerUser(username, password);
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
        <h1 className="font-semibold text-2 sm:text-3 lg:text-4">Реєстрація</h1>
        <Input
          label="Електрона пошта"
          {...register("username", {
            required: true,
            minLength: {
              message: "Мінімальна довжина 11 символи",
              value: 11,
            },
          })}
          error={errors.username?.message}
          required
        />
        <Input
          label="Пароль"
          {...register("password", {
            minLength: {
              message: "Мінімальна довжина 2 символи",
              value: 2,
            },
            required: true,
          })}
        />
        <Input
          label="Повторити пароль"
          {...register("confirmedPassword", {
            validate: (value) => value === password || "Паролі не співпадають",
            required: true,
            minLength: {
              message: "Мінімальна довжина 2 символи",
              value: 2,
            },
          })}
          error={errors.username?.message}
          required
        />
        <button
          type="submit"
          className="px-4 py-2 cursor-pointer text-center w-auto text-2 lg:text-3 lg:px-5 lg:py-1 xl:px-10 rounded-lg text-white font-semibold bg-purple-400 hover:bg-purple-500"
        >
          Зареєструватись
        </button>
        <div className="flex gap-1">
          <Title title="Маєш аккаунт?" type="text" />
          <Link
            to="/signin"
            className="text-blue-500 font-semibold text-1 hover:text-blue-700"
          >
            Увійти
          </Link>
        </div>
      </form>
    </section>
  );
}

export default SingUp;

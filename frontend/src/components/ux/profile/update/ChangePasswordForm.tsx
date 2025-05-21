import { useState } from "react";
import type { FC } from "react";

import Input from "../../Input";
import toast from "react-hot-toast";
import Title from "../../Title";
import { api } from "../../../../utils/server";
import type { AxiosError } from "axios";

const ChangePasswordForm: FC = () => {
  const [info, setInfo] = useState({
    old_password: "",
    new_password: "",
    confirmed_password: "",
  });
  const [loading, setLoading] = useState(false);

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      const { data } = await api.put(
        "/profile/change-password",
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(data.message || "Пароль успішно змінено");
      return data.message || "Пароль успішно змінено";
    } catch (err: unknown) {
      const error = err as AxiosError<{ detail?: string }>;

      if (error?.response?.data?.detail) {
        toast.error(`Не вдалося змінити пароль: ${error.response.data.detail}`);
        throw new Error(error.response.data.detail);
      } else if (error?.message) {
        console.error("Change password failed:", error.message);
        toast.error("Не вдалося змінити пароль");
        throw new Error(error.message);
      } else {
        console.error("Change password failed:", error);
        toast.error("Сталася помилка при зміні пароля");
        throw new Error("Сталася помилка при зміні пароля");
      }
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (info.new_password !== info.confirmed_password) {
      toast.error("Нові паролі не співпадають");
      setLoading(false);
      return;
    }

    try {
      const message = await changePassword(
        info.old_password,
        info.new_password
      );
      toast.success(message);
      setInfo({ old_password: "", new_password: "", confirmed_password: "" });
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Помилка при зміні пароля");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center mb-[20px] lg:m-0">
      <Title type="title" title="Зміна паролю" className="text-purple-500" />
      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-[50%] flex flex-col gap-4 items-center mt-[10px]"
      >
        <Input
          label="Старий пароль"
          disabled={loading}
          value={info.old_password}
          onChange={handleInput}
          name="old_password"
          type="password"
          required
        />
        <Input
          label="Новий пароль"
          disabled={loading}
          value={info.new_password}
          onChange={handleInput}
          name="new_password"
          type="password"
          required
        />
        <Input
          label="Повторіть новий пароль"
          disabled={loading}
          value={info.confirmed_password}
          onChange={handleInput}
          name="confirmed_password"
          type="password"
          required
        />
        <button
          type="submit"
          className=" px-4 py-2 cursor-pointer text-center w-auto text-2 lg:text-3 lg:px-5 lg:py-1 xl:px-10 rounded-lg text-white font-semibold bg-purple-400 hover:bg-purple-500"
        >
          Зберегти
        </button>
        {/* <Button title="Зберегти" types="login" /> */}
      </form>
    </div>
  );
};

export default ChangePasswordForm;

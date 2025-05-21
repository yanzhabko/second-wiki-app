import { FC } from "react";
import { ModalProps } from "../../hooks/useModal";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useForm } from "react-hook-form";
import Input from "../Input";
import { useMutation, useQueryClient } from "react-query";
import { authApi } from "../../utils/store";
import toast from "react-hot-toast";
import { CreateSessions } from "../../types";

const CreateSessionModal: FC<ModalProps> = ({ onClose, isOpen }) => {
  const client = useQueryClient();
  const { mutateAsync } = useMutation(
    "movies",
    async (data: CreateSessions) => {
      const response = await authApi.post("/movies/", data);
      return response;
    }
  );
  const { register, handleSubmit, reset } = useForm<CreateSessions>({
    defaultValues: {
      title: "",
      description: "",
      start_time: new Date().toISOString(),
    },
  });

  const onSubmit = async (data: CreateSessions) => {
    try {
      const formData = { ...data, created_at: new Date().toISOString() };
      await mutateAsync(formData);
      client.invalidateQueries("movies");
      toast.success("Сеанс успішно створений!");
      reset();
      onClose();
    } catch {
      toast.error("Подія не створена");
    }
  };

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={onClose}
    >
      <DialogBackdrop
        transition
        onClick={onClose}
        className="bg-black/30 backdrop-blur-sm w-full fixed top-0 left-0 h-screen"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-[40%] flex flex-col justify-center items-center  rounded-xl bg-white p-6 backdrop-blur-sm duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <DialogTitle
              as="h3"
              className="text-base/7 text-black !text-[18px] mb-2 font-medium "
            >
              Створити сеанс
            </DialogTitle>
            <form
              className="text-black-white flex-col justify-center gap-5 flex"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                label="Назва"
                {...register("title", {
                  minLength: { value: 3, message: "Name is too short" },
                  required: true,
                })}
              />
              <Input
                label="Опис"
                {...register("description", {
                  minLength: { value: 3, message: "Description is too short" },
                  required: true,
                })}
              />

              <Input
                label="Дата"
                type="date"
                {...register("start_time", {
                  required: true,
                })}
              />

              <div className="flex justify-between mt-5">
                <button
                  type="button"
                  className="!text-[18px] hover:text-orange-400"
                  onClick={onClose}
                >
                  Назад
                </button>
                <button
                  type="submit"
                  className="!text-[18px] hover:text-orange-500"
                >
                  Створити
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default CreateSessionModal;

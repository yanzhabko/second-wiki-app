import { FC, useEffect } from "react";
import { ModalProps } from "../../hooks/useModal";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { authApi } from "../../utils/store";
import { UpdateFilm } from "../../types";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Input from "../Input";

interface UpdateSessionModal extends ModalProps {
  activeId: number | null;
}

const UpdateSessionModal: FC<UpdateSessionModal> = ({
  activeId,
  isOpen,
  onClose,
}) => {
  const client = useQueryClient();
  const { data: film } = useQuery(["bookings", activeId], async () => {
    if (activeId === null) return null;
    const response = await authApi.get(`/movies/${activeId}/`);
    return response.data;
  });

  const { mutateAsync } = useMutation("movies", async (data: UpdateFilm) => {
    const response = await authApi.put("/movies/" + activeId, data);
    return response;
  });

  const { register, handleSubmit, reset } = useForm<UpdateFilm>({
    defaultValues: {
      title: film?.title,
      description: film?.description,
      film_status: !!film?.film_status,
    },
  });

  useEffect(() => {
    if (!film) return;
    reset(film);
  }, [film]);

  const onSubmit = async (data: UpdateFilm) => {
    try {
      await mutateAsync(data);
      client.invalidateQueries("movies");
      toast.success("Успішно оновлено!");
      reset();
      onClose();
    } catch {
      toast.error("Щось пішло не так!");
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
            className="w-full max-w-[40%] flex flex-col justify-center items-center rounded-xl bg-white p-6 backdrop-blur-sm duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <DialogTitle
              as="h3"
              className="text-base/7 text-black !text-[18px] mb-2 font-medium "
            >
              Створити сеанс
            </DialogTitle>
            <form
              className="text-black-white flex-col gap-5 flex"
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
                className="!h-5 !w-5"
                type="checkbox"
                label=""
                {...register("film_status")}
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
                  Оновити
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default UpdateSessionModal;

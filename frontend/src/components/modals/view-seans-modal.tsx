import { FC } from "react";
import { ModalProps } from "../../hooks/useModal";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useImage } from "../../hooks/useImage";

type ViewSessionModalProps = ModalProps & {
  data: {
    id: string;
    type: string;
    name?: string;
    description: string;
    tag: string[];
    image_id: string;
  };
};

const ViewSessionModal: FC<ViewSessionModalProps> = ({
  onClose,
  isOpen,
  data,
}) => {
  const { imageUrl } = useImage(data.image_id);
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
        className="bg-black/30 backdrop-blur-sm fixed top-0 left-0 w-full h-screen"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="relative w-full max-w-md flex flex-col rounded-xl bg-white p-6 shadow-lg"
          >
            <div className="flex justify-end mt-6 absolute right-[20px] top-[4px] z-[200]">
              <button
                onClick={onClose}
                className="text-sm text-gray-600 hover:text-purple-500"
              >
                Закрити
              </button>
            </div>
            <DialogTitle
              as="h3"
              className="text-lg font-semibold text-black mb-4"
            >
              {data.type + " " + (data.name ?? "")}
            </DialogTitle>

            <div className="w-full h-[440px] mb-4 rounded-lg overflow-hidden">
              <img
                src={imageUrl || ""}
                alt={data.name}
                className="w-full h-full object-cover rounded-md"
              />
            </div>

            <p className="text-sm text-gray-600 mb-2">{data.description}</p>

            <div className="mt-auto flex gap-1 ">
              {data.tag.map((item, index) => (
                <span
                  key={index}
                  className="inline-block bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ViewSessionModal;

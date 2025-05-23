import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { authApi } from "../../utils/store";

interface Field {
  name: string;
  label: string;
  type: "text" | "number" | "textarea" | "tags";
  required?: boolean;
}

interface DynamicCreateModalProps {
  modal: {
    isOpen: boolean;
    onClose: () => void;
  };
  title: string;
  submitUrl: string;
  fields: Field[];
  withImage?: boolean;
}

const DynamicCreateModal: React.FC<DynamicCreateModalProps> = ({
  modal,
  title,
  submitUrl,
  fields,
  withImage = false,
}) => {
  type FormValue = string | number | string[];
  const [formData, setFormData] = useState<Record<string, FormValue>>({});
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (data: FormData) => {
      return authApi.post(submitUrl, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    {
      onSuccess: () => {
        toast.success("Успішно створено!");
        queryClient.invalidateQueries();
        setFormData({});
        setImage(null);
        modal.onClose();
      },
      onError: () => {
        toast.error("Сталася помилка при створенні.");
      },
      onSettled: () => {
        setIsLoading(false);
      },
    }
  );

  const handleChange = (name: string, value: string | number | string[]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    const missingRequired = fields.some(
      (field) => field.required && !formData[field.name]
    );
    if (missingRequired || (withImage && !image)) {
      alert("Будь ласка, заповніть усі обов’язкові поля.");
      return;
    }

    const data = new FormData();
    fields.forEach((field) => {
      const value = formData[field.name];
      if (value !== undefined && value !== null) {
        if (field.type === "tags" && typeof value === "string") {
          const tags = value.split(",").map((t) => t.trim());
          tags.forEach((tag) => {
            data.append(field.name, tag);
          });
        } else {
          data.append(field.name, String(value));
        }
      }
    });

    if (withImage && image) {
      data.append("image", image);
    }

    setIsLoading(true);
    mutation.mutate(data);
  };

  return (
    <Dialog
      open={modal.isOpen}
      onClose={modal.onClose}
      className="relative z-50"
    >
      <DialogBackdrop className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded bg-white p-6 space-y-4">
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>

          {fields.map((field) => (
            <div key={field.name} className="space-y-1">
              <label className="block font-medium">{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  value={String(formData[field.name] || "")}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full border p-2 rounded"
                />
              ) : (
                <input
                  type={field.type === "number" ? "number" : "text"}
                  value={String(formData[field.name] || "")}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full border p-2 rounded"
                />
              )}
            </div>
          ))}

          {withImage && (
            <div>
              <label className="block font-medium">Зображення</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={modal.onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              disabled={isLoading}
            >
              Скасувати
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {isLoading ? "Завантаження..." : "Створити"}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default DynamicCreateModal;

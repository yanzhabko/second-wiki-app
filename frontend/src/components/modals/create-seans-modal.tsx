// import { useState } from "react";
// import {
//   Dialog,
//   DialogBackdrop,
//   DialogPanel,
//   DialogTitle,
// } from "@headlessui/react";
// import toast from "react-hot-toast";
// import { useMutation, useQueryClient } from "react-query";
// import { authApi } from "../../utils/store";
// import { useImageUpload } from "../../hooks/useImageUpload";

// interface Field {
//   name: string;
//   label: string;
//   type: "text" | "number" | "textarea" | "tags";
//   required?: boolean;
// }

// interface DynamicCreateModalProps {
//   modal: {
//     isOpen: boolean;
//     onClose: () => void;
//   };
//   title: string;
//   submitUrl: string;
//   fields: Field[];
//   withImage?: boolean;
// }

// const DynamicCreateModal: React.FC<DynamicCreateModalProps> = ({
//   modal,
//   title,
//   submitUrl,
//   fields,
//   withImage = false,
// }) => {
//   type FormValue = string | number | string[];
//   const [formData, setFormData] = useState<Record<string, FormValue>>({});
//   const [errors, setErrors] = useState<Record<string, boolean>>({});
//   const [isLoading, setIsLoading] = useState(false);

//   const queryClient = useQueryClient();
//   const {
//     file: image,
//     previewUrl,
//     handleChange: handleFileChange,
//   } = useImageUpload();

//   const mutation = useMutation(
//     async (data: FormData) => {
//       return authApi.post(submitUrl, data, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//     },
//     {
//       onSuccess: () => {
//         toast.success("Успішно створено!");
//         queryClient.invalidateQueries();
//         setFormData({});
//         setErrors({});
//         modal.onClose();
//       },
//       onError: () => {
//         toast.error("Сталася помилка при створенні.");
//       },
//       onSettled: () => {
//         setIsLoading(false);
//       },
//     }
//   );

//   const handleChange = (name: string, value: FormValue) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: false })); // Скидаємо помилку при введенні
//   };

//   const handleSubmit = () => {
//     const newErrors: Record<string, boolean> = {};

//     const missingRequired = fields.some((field) => {
//       const value = formData[field.name];
//       if (
//         field.required &&
//         (!value || (Array.isArray(value) && value.length === 0))
//       ) {
//         newErrors[field.name] = true;
//         return true;
//       }
//       return false;
//     });

//     if (missingRequired || (withImage && !image)) {
//       setErrors(newErrors);
//       toast.error("Будь ласка, заповніть усі обов’язкові поля.");
//       return;
//     }

//     const data = new FormData();
//     fields.forEach((field) => {
//       const value = formData[field.name];
//       if (value !== undefined && value !== null) {
//         if (field.type === "tags" && typeof value === "string") {
//           const tags = value.split(",").map((t) => t.trim());
//           tags.forEach((tag) => {
//             data.append(field.name, tag);
//           });
//         } else {
//           data.append(field.name, String(value));
//         }
//       }
//     });

//     if (withImage && image) {
//       data.append("image", image);
//     }

//     setIsLoading(true);
//     mutation.mutate(data);
//   };

//   return (
//     <Dialog
//       open={modal.isOpen}
//       onClose={modal.onClose}
//       className="relative z-50"
//     >
//       <DialogBackdrop className="fixed inset-0 bg-black/50" />
//       <div className="fixed inset-0 flex items-center justify-center p-4">
//         <DialogPanel className="w-full max-w-md rounded bg-white p-6 space-y-4">
//           <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>

//           {fields.map((field) => (
//             <div key={field.name} className="space-y-1">
//               <label className="block font-medium">{field.label}</label>
//               {field.type === "textarea" ? (
//                 <textarea
//                   value={String(formData[field.name] || "")}
//                   onChange={(e) => handleChange(field.name, e.target.value)}
//                   className={`w-full border p-2 rounded ${
//                     errors[field.name] ? "border-red-500 bg-red-100" : ""
//                   }`}
//                 />
//               ) : (
//                 <input
//                   type={field.type === "number" ? "number" : "text"}
//                   value={String(formData[field.name] || "")}
//                   onChange={(e) => handleChange(field.name, e.target.value)}
//                   className={`w-full border p-2 rounded ${
//                     errors[field.name] ? "border-red-500 bg-red-100" : ""
//                   }`}
//                 />
//               )}
//               {errors[field.name] && (
//                 <p className="text-red-500 text-sm">Це поле є обов'язковим!</p>
//               )}
//             </div>
//           ))}

//           {withImage && (
//             <div className="space-y-2">
//               <label className="block font-medium">Зображення</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 className="w-full"
//               />
//               {previewUrl && (
//                 <img
//                   src={previewUrl}
//                   alt="Прев’ю"
//                   className="mt-2 max-h-48 w-auto rounded border object-contain"
//                 />
//               )}
//             </div>
//           )}

//           <div className="flex justify-end gap-2 pt-4">
//             <button
//               onClick={modal.onClose}
//               className="px-4 py-2 rounded bg-gray-200 font-[500] hover:bg-gray-300"
//               disabled={isLoading}
//             >
//               Скасувати
//             </button>
//             <button
//               onClick={handleSubmit}
//               disabled={isLoading}
//               className="px-4 py-2 rounded bg-purple-400 font-[500] text-white hover:bg-purple-500"
//             >
//               {isLoading ? "Завантаження..." : "Створити"}
//             </button>
//           </div>
//         </DialogPanel>
//       </div>
//     </Dialog>
//   );
// };

// export default DynamicCreateModal;

import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { authApi } from "../../utils/store";
import { useImageUpload } from "../../hooks/useImageUpload";

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
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();
  const {
    file: image,
    previewUrl,
    setPreviewUrl,
    handleChange: handleFileChange,
  } = useImageUpload();

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
        setErrors({});
        setPreviewUrl(null);
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

  const handleChange = (name: string, value: FormValue) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleSubmit = () => {
    const newErrors: Record<string, boolean> = {};

    const missingRequired = fields.some((field) => {
      const value = formData[field.name];
      if (
        field.required &&
        (!value || (Array.isArray(value) && value.length === 0))
      ) {
        newErrors[field.name] = true;
        return true;
      }
      return false;
    });

    if (missingRequired || (withImage && !image)) {
      setErrors(newErrors);
      toast.error("Будь ласка, заповніть усі обов’язкові поля.");
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
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded bg-white p-6 space-y-4">
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>

          {fields.map((field) => (
            <div key={field.name} className="space-y-1">
              <label className="block font-medium">{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  value={String(formData[field.name] || "")}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className={`w-full border p-2 rounded ${
                    errors[field.name] ? "border-red-500 bg-red-100" : ""
                  }`}
                />
              ) : (
                <input
                  type={field.type === "number" ? "number" : "text"}
                  value={String(formData[field.name] || "")}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className={`w-full border p-2 rounded ${
                    errors[field.name] ? "border-red-500 bg-red-100" : ""
                  }`}
                />
              )}
              {errors[field.name] && (
                <p className="text-red-500 text-sm">Це поле є обов'язковим!</p>
              )}
            </div>
          ))}

          {withImage && (
            <div className="space-y-2">
              <label className="block font-medium">Зображення</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full"
              />
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Прев’ю"
                  className="mt-2 max-h-48 w-auto rounded border object-contain"
                />
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={modal.onClose}
              className="px-4 py-2 rounded bg-gray-200 font-[500] hover:bg-gray-300"
              disabled={isLoading}
            >
              Скасувати
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 rounded bg-purple-400 font-[500] text-white hover:bg-purple-500"
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

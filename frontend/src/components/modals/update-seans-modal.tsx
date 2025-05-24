// import { useEffect, useState } from "react";
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
//   type: "text" | "number" | "textarea" | "tags" | "file";
//   required?: boolean;
// }

// interface DynamicUpdateModalProps {
//   modal: {
//     isOpen: boolean;
//     onClose: () => void;
//   };
//   title: string;
//   updateUrl: string;
//   fields: Field[];
//   defaultValues: Record<string, string | number | string[]>;
//   withImage?: boolean;
// }

// const DynamicUpdateModal: React.FC<DynamicUpdateModalProps> = ({
//   modal,
//   title,
//   updateUrl,
//   fields,
//   defaultValues,
//   withImage = false,
// }) => {
//   type FormValue = string | number | string[];
//   const [formData, setFormData] = useState<Record<string, FormValue>>({});
//   const [errors, setErrors] = useState<Record<string, boolean>>({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [oldImageUrl, setOldImageUrl] = useState<string | null>(null);

//   const queryClient = useQueryClient();
//   const {
//     file: image,
//     previewUrl,
//     handleChange: handleFileChange,
//   } = useImageUpload();

//   useEffect(() => {
//     if (modal.isOpen) {
//       setFormData(defaultValues);
//       setErrors({});

//       if (
//         withImage &&
//         typeof defaultValues.image_id === "string" &&
//         defaultValues.image_id
//       ) {
//         setOldImageUrl(`http://localhost:8000/image/${defaultValues.image_id}`);
//       } else {
//         setOldImageUrl(null);
//       }
//     }
//   }, [modal.isOpen, defaultValues, withImage]);

//   const mutation = useMutation(
//     async (data: FormData) => {
//       return authApi.put(updateUrl, data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//     },
//     {
//       onSuccess: () => {
//         toast.success("Успішно оновлено!");
//         queryClient.invalidateQueries();
//         modal.onClose();
//       },
//       onError: () => {
//         toast.error("Сталася помилка при оновленні.");
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

//     if (missingRequired) {
//       setErrors(newErrors);
//       toast.error("Будь ласка, заповніть усі обов’язкові поля.");
//       return;
//     }

//     const data = new FormData();
//     fields.forEach((field) => {
//       const value = formData[field.name];
//       if (value !== undefined && value !== null) {
//         if (field.type === "tags" && typeof value === "string") {
//           value
//             .split(",")
//             .map((t) => t.trim())
//             .forEach((tag) => data.append(field.name, tag));
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
//               {previewUrl ? (
//                 <img
//                   src={previewUrl}
//                   alt="Прев’ю"
//                   className="h-[200px] rounded mt-2"
//                 />
//               ) : (
//                 oldImageUrl && (
//                   <img
//                     src={oldImageUrl}
//                     alt="Попереднє зображення"
//                     className="h-[200px] rounded mt-2"
//                   />
//                 )
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
//               className="px-4 py-2 rounded bg-blue-500 font-[500] text-white hover:bg-blue-600"
//             >
//               {isLoading ? "Збереження..." : "Оновити"}
//             </button>
//           </div>
//         </DialogPanel>
//       </div>
//     </Dialog>
//   );
// };

// export default DynamicUpdateModal;

import { useEffect, useState } from "react";
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
  type: "text" | "number" | "textarea" | "tags" | "file";
  required?: boolean;
}

interface DynamicUpdateModalProps {
  modal: {
    isOpen: boolean;
    onClose: () => void;
  };
  title: string;
  updateUrl: string;
  fields: Field[];
  defaultValues: Record<string, string | number | string[]>;
  withImage?: boolean;
}

const DynamicUpdateModal: React.FC<DynamicUpdateModalProps> = ({
  modal,
  title,
  updateUrl,
  fields,
  defaultValues,
  withImage = false,
}) => {
  type FormValue = string | number | string[];
  const [formData, setFormData] = useState<Record<string, FormValue>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [oldImageUrl, setOldImageUrl] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const {
    file: image,
    previewUrl,
    handleChange: handleFileChange,
  } = useImageUpload();

  useEffect(() => {
    if (modal.isOpen) {
      setFormData(defaultValues);
      setErrors({});

      if (
        withImage &&
        typeof defaultValues.image_id === "string" &&
        defaultValues.image_id
      ) {
        setOldImageUrl(`http://localhost:8000/image/${defaultValues.image_id}`);
      } else {
        setOldImageUrl(null);
      }
    }
  }, [modal.isOpen, defaultValues, withImage]);

  const mutation = useMutation(
    async (data: FormData) => {
      return authApi.put(updateUrl, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    {
      onSuccess: () => {
        toast.success("Успішно оновлено!");
        queryClient.invalidateQueries();
        modal.onClose();
      },
      onError: () => {
        toast.error("Сталася помилка при оновленні.");
      },
      onSettled: () => {
        setIsLoading(false);
      },
    }
  );

  const deleteMutation = useMutation(
    async () => {
      return authApi.delete(updateUrl);
    },
    {
      onSuccess: () => {
        toast.success("Успішно видалено!");
        queryClient.invalidateQueries();
        modal.onClose();
      },
      onError: () => {
        toast.error("Сталася помилка при видаленні.");
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

    if (missingRequired) {
      setErrors(newErrors);
      toast.error("Будь ласка, заповніть усі обов’язкові поля.");
      return;
    }

    const data = new FormData();
    fields.forEach((field) => {
      const value = formData[field.name];
      if (value !== undefined && value !== null) {
        if (field.type === "tags" && typeof value === "string") {
          value
            .split(",")
            .map((t) => t.trim())
            .forEach((tag) => data.append(field.name, tag));
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

  const handleDelete = () => {
    if (confirm("Ви впевнені, що хочете видалити цей елемент?")) {
      deleteMutation.mutate();
    }
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
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Прев’ю"
                  className="h-[200px] rounded mt-2"
                />
              ) : (
                oldImageUrl && (
                  <img
                    src={oldImageUrl}
                    alt="Попереднє зображення"
                    className="h-[200px] rounded mt-2"
                  />
                )
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={modal.onClose}
              className="px-4 py-2 rounded bg-gray-200 font-[500] hover:bg-gray-300"
            >
              Скасувати
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded bg-red-400 font-[500] text-white hover:bg-red-500"
              disabled={deleteMutation.isLoading}
            >
              {deleteMutation.isLoading ? "Видалення..." : "Видалити"}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 rounded bg-purple-400 font-[500] text-white hover:bg-purple-500"
            >
              {isLoading ? "Збереження..." : "Оновити"}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default DynamicUpdateModal;

import { useState } from "react";
import { useQuery } from "react-query";
import { useModal } from "../hooks/useModal";
import { useAuth } from "../providers/AuthProvider";
import { api } from "../utils/server";
import Card from "../components/ui/card/Card";
import ViewSessionModal from "../components/modals/view-seans-modal";
import DynamicCreateModal from "../components/modals/create-seans-modal";
import DynamicUpdateModal from "../components/modals/update-seans-modal";
import DragScroll from "../components/ui/DragScroll";

interface TransportItem {
  _id: string;
  type: string;
  model: string;
  price?: number;
  speed: string;
  forecastle: string;
  trunk_capacity: string;
  description: string;
  tag: string[];
  image_id: string;
}

const Transport = () => {
  const { user } = useAuth();
  const transportModal = useModal();
  const [activeSession, setActiveSession] = useState<null | number>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: transport,
    isLoading,
    isError,
  } = useQuery<TransportItem[]>(
    ["transport"],
    () => api.get("/transport").then((res) => res.data),
    {
      refetchOnWindowFocus: false,
    }
  );

  const selectedItem =
    activeSession !== null && transport?.[activeSession]
      ? transport[activeSession]
      : null;

  console.log(selectedItem?.image_id);
  console.log(selectedItem?._id);

  const openModal = (id: number) => {
    setActiveSession(id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setActiveSession(null);
  };

  const allTags = Array.from(
    new Set(transport?.flatMap((item) => item.tag) || [])
  );

  const filteredTransport = transport?.filter((item) => {
    const matchesTag = activeTag ? item.tag.includes(activeTag) : true;
    const query = searchQuery.toLowerCase();
    const matchesName = item.model.toLowerCase().includes(query);
    const matchesType = item.type.toLowerCase().includes(query);
    return matchesTag && (matchesName || matchesType);
  });

  if (isLoading) return <div>Завантаження транспорту...</div>;
  if (isError) return <div>Сталася помилка при завантаженні транспорту</div>;

  return (
    <>
      <section className="w-full h-full px-4 py-6">
        {user?.role === "admin" && (
          <button
            onClick={transportModal.onOpen}
            className="mb-4 px-4 py-2 hover:bg-purple-500 bg-purple-400 text-white font-[500] rounded"
          >
            Додати транспорт
          </button>
        )}
        <input
          type="text"
          placeholder="Пошук за моделлю..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
        />
        <DragScroll>
          <button
            onClick={() => setActiveTag(null)}
            className={`inline-block mr-2 px-3 py-1 rounded ${
              activeTag === null
                ? "bg-purple-400 text-white hover:bg-purple-400 hover:text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Усі
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`inline-block mr-2 px-3 py-1 rounded hover:bg-purple-400 hover:text-white ${
                activeTag === tag
                  ? "bg-purple-400 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {tag}
            </button>
          ))}
        </DragScroll>

        <div className="flex flex-wrap -mx-2">
          {filteredTransport?.length === 0 ? (
            <div className="text-gray-600">Нічого не знайдено</div>
          ) : (
            filteredTransport?.map((item, index) => (
              <div
                key={item._id}
                onClick={() => openModal(index)}
                className="w-full sm:w-1/2 md:w-1/3  px-2 mb-4 cursor-pointer"
              >
                <Card
                  title={item.model}
                  description={item.description}
                  tag={item.tag}
                  imageId={item.image_id}
                  type={item.type}
                />
              </div>
            ))
          )}
        </div>
      </section>

      <DynamicCreateModal
        modal={transportModal}
        title="Додати транспорт"
        submitUrl="/transport"
        withImage={true}
        fields={[
          { name: "type", label: "Марка", type: "text", required: true },
          { name: "model", label: "Модель", type: "text", required: true },
          { name: "price", label: "Ціна", type: "number" },
          { name: "speed", label: "Швидкість", type: "text", required: true },
          { name: "forecastle", label: "Бак", type: "text", required: true },
          {
            name: "trunk_capacity",
            label: "Об’єм багажника",
            type: "text",
            required: true,
          },
          {
            name: "description",
            label: "Опис",
            type: "textarea",
            required: true,
          },
          {
            name: "tag",
            label: "Теги (через кому)",
            type: "tags",
            required: true,
          },
        ]}
      />
      {user?.role === "admin" &&
      activeSession !== null &&
      transport &&
      transport[activeSession] ? (
        <DynamicUpdateModal
          modal={{ isOpen, onClose: closeModal }}
          title="Оновити транспорт"
          updateUrl={`/transport/${selectedItem?._id}`}
          defaultValues={{
            type: selectedItem?.type ?? "",
            model: selectedItem?.model ?? "",
            price: selectedItem?.price ?? 0,
            speed: selectedItem?.speed ?? "",
            forecastle: selectedItem?.forecastle ?? "",
            trunk_capacity: selectedItem?.trunk_capacity ?? "",
            description: selectedItem?.description ?? "",
            tag: selectedItem?.tag ?? [],
            image_id: selectedItem?.image_id ?? "",
          }}
          fields={[
            { name: "type", label: "Тип", type: "text", required: true },
            { name: "model", label: "Модель", type: "text", required: true },
            { name: "price", label: "Ціна", type: "number" },
            { name: "speed", label: "Швидкість", type: "text", required: true },
            {
              name: "forecastle",
              label: "Корма",
              type: "text",
              required: true,
            },
            {
              name: "trunk_capacity",
              label: "Об’єм багажника",
              type: "text",
              required: true,
            },
            {
              name: "description",
              label: "Опис",
              type: "textarea",
              required: true,
            },
            {
              name: "tag",
              label: "Теги (через кому)",
              type: "tags",
              required: true,
            },
          ]}
          withImage={true}
        />
      ) : (
        activeSession !== null &&
        transport?.[activeSession] &&
        selectedItem && (
          <ViewSessionModal
            isOpen={isOpen}
            onOpen={() => setIsOpen(true)}
            onClose={closeModal}
            data={{
              _id: selectedItem._id,
              type: selectedItem.type,
              model: selectedItem.model,
              description: selectedItem.description,
              tag: selectedItem.tag,
              image_id: selectedItem.image_id,
              price: selectedItem.price,
              speed: selectedItem.speed,
              forecastle: selectedItem.forecastle,
              trunk_capacity: selectedItem.trunk_capacity,
            }}
          />
        )
      )}
    </>
  );
};

export default Transport;

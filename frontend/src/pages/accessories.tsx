import { useState } from "react";
import { useQuery } from "react-query";
import Card from "../components/ux/card/Card";
import ViewSessionModal from "../components/modals/view-seans-modal";
import DynamicCreateModal from "../components/modals/create-seans-modal";
import { useModal } from "../hooks/useModal";
import { useAuth } from "../providers/AuthProvider";
import { api } from "../utils/server";

interface ClothesItem {
  id: string;
  type: string;
  name?: string;
  description: string;
  tag: string[];
  image_id: string;
}

const Accessories = () => {
  const { user } = useAuth();
  const clothesModal = useModal();
  const [activeSession, setActiveSession] = useState<null | number>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: accessories,
    isLoading,
    isError,
  } = useQuery<ClothesItem[]>("accessories", () =>
    api.get("/accessories").then((res) => res.data)
  );

  console.log(accessories);

  const openModal = (index: number) => {
    setActiveSession(index);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setActiveSession(null);
  };

  const allTags = Array.from(
    new Set(accessories?.flatMap((item) => item.tag) || [])
  );
  const filteredAccessories = accessories?.filter((item) => {
    const matchesTag = activeTag ? item.tag.includes(activeTag) : true;
    const query = searchQuery.toLowerCase();

    const matchesName = item.name?.toLowerCase().includes(query);
    const matchesType = item.type.toLowerCase().includes(query);

    return matchesTag && (matchesName || matchesType);
  });

  if (isLoading) return <div>Завантаження аксесуарів...</div>;
  if (isError) return <div>Сталася помилка при завантаженні аксесуарів</div>;

  return (
    <>
      <section className="w-full h-full px-4 py-6">
        {user?.role === "admin" && (
          <button
            onClick={clothesModal.onOpen}
            className="mb-4 px-4 py-2 bg-purple-400 text-white font-[500] rounded"
          >
            Додати аксесуари
          </button>
        )}
        <input
          type="text"
          placeholder="Пошук за назвою..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
        />
        {/* Кнопки тегів */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`px-3 py-1 rounded ${
              activeTag === null
                ? "bg-purple-400 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Усі
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-3 py-1 rounded ${
                activeTag === tag
                  ? "bg-purple-400 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-4">
          {filteredAccessories?.length === 0 ? (
            <div className="text-gray-600">Нічого не знайдено</div>
          ) : (
            filteredAccessories?.map((item, index) => (
              <div
                key={index}
                onClick={() => openModal(index)}
                className="w-full md:w-1/3 lg:w-1/4 cursor-pointer"
              >
                <Card
                  title={item.name}
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
        modal={clothesModal}
        title="Додати одяг"
        submitUrl="/accessories"
        withImage={true}
        fields={[
          { name: "type", label: "Тип", type: "text", required: true },
          { name: "name", label: "Назва", type: "text" },
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

      {activeSession !== null && accessories && (
        <ViewSessionModal
          isOpen={isOpen}
          onOpen={() => setIsOpen(true)}
          onClose={closeModal}
          data={accessories[activeSession]}
        />
      )}
    </>
  );
};

export default Accessories;

import { useRef, useState } from "react";

const DragScroll = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (ref.current?.offsetLeft ?? 0));
    setScrollStart(ref.current?.scrollLeft ?? 0);
  };

  const onMouseUp = () => setIsDragging(false);
  const onMouseLeave = () => setIsDragging(false);

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - (ref.current.offsetLeft ?? 0);
    const walk = x - startX; // скільки "пройшли" по осі X
    ref.current.scrollLeft = scrollStart - walk; // рухаємо прокрутку навпаки руху миші
  };

  return (
    <div
      ref={ref}
      style={{
        overflowX: "auto",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE 10+
        whiteSpace: "nowrap",
        display: "flex",
        gap: "0.5rem",
        padding: "0.25rem",
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
      }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onDragStart={(e) => e.preventDefault()}
      className="mb-[20px]"
    >
      {children}
      <style>{`
        /* Для Chrome, Edge, Safari */
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default DragScroll;

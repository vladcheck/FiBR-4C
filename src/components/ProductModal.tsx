import {
  HTMLAttributes,
  HTMLInputTypeAttribute,
  useEffect,
  useState,
} from "react";
import Button from "./Button.tsx";
import Label from "./Label.tsx";
import { nanoid } from "nanoid";
import clsx from "clsx";

type ModalMode = "create" | "edit";

export default function ProductModal({
  open,
  mode,
  initialProduct,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: ModalMode;
  initialProduct: Product | null;
  onClose: () => void;
  onSubmit: (payload: Product) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [rating, setRating] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setName(initialProduct?.name || "");
    setCategory(initialProduct?.category || "");
    setDescription(initialProduct?.description || "");
    setPrice(initialProduct?.price.toString() || "");
    setStock(initialProduct?.stock.toString() || "");
    setImage(initialProduct?.image || "");
    setRating(initialProduct?.rating?.toString() || "");
  }, [open, initialProduct]);

  if (!open) return null;

  const title = mode === "edit" ? "Редактирование товара" : "Добавление товара";

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedCategory = category.trim();
    const trimmedDescription = description.trim();
    const parsedPrice = Number(price);
    const parsedStock = Number(stock);
    const parsedRating = rating ? Number(rating) : undefined;

    if (!trimmedName) {
      alert("Введите название товара");
      return;
    }
    if (!trimmedCategory) {
      alert("Введите категорию товара");
      return;
    }
    if (!trimmedDescription) {
      alert("Введите описание товара");
      return;
    }
    if (
      !Number.isFinite(parsedPrice) ||
      parsedPrice <= 0 ||
      parsedPrice > 1000000
    ) {
      alert("Введите корректную цену (0<N<1_000_000)");
      return;
    }
    if (
      !Number.isFinite(parsedStock) ||
      parsedStock < 0 ||
      parsedStock > 1000000
    ) {
      alert("Введите корректное количество на складе (0≤N<1_000_000)");
      return;
    }
    if (
      parsedRating !== undefined &&
      (!Number.isFinite(parsedRating) || parsedRating < 1 || parsedRating > 10)
    ) {
      alert("Рейтинг должен быть числом от 1 до 10");
      return;
    }

    onSubmit({
      id: initialProduct?.id || nanoid(6),
      name: trimmedName,
      category: trimmedCategory,
      description: trimmedDescription,
      price: parsedPrice,
      stock: parsedStock,
      image: image,
      rating: parsedRating!,
    });
  };

  return (
    <div className="backdrop" onMouseDown={onClose}>
      <div
        className="modal"
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <header className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <Button className="iconBtn" onClick={onClose} aria-label="Закрыть">
            X
          </Button>
        </header>
        <form className="form" onSubmit={handleSubmit}>
          <Label title="Название товара">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Серебряная чашка"
              required
              autoFocus
            />
          </Label>
          <Label title="Категория">
            <Input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Посуда"
              required
            />
          </Label>
          <Label title="Описание">
            <textarea
              className="input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Описание товара"
              style={{ minHeight: "80px" }}
              required
            />
          </Label>
          <Label title="Цена (₽)">
            <Input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min={1}
              step={0.1}
              max={10e6}
              inputMode="decimal"
              placeholder="2500.0"
              required
            />
          </Label>
          <Label title="Количество на складе">
            <Input
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              min={0}
              step={1}
              max={1000000}
              inputMode="numeric"
              placeholder="15"
              required
            />
          </Label>
          <Label title="URL изображения (опционально)">
            <Input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </Label>
          <Label title="Рейтинг (1-10, опционально)">
            <Input
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              min={1}
              max={10}
              step={0.1}
              inputMode="decimal"
              placeholder="4.5"
            />
          </Label>
          <div className="modal__footer">
            <Button onClick={onClose}>Отмена</Button>
            <Button type="submit" className="btn--primary">
              {mode === "edit" ? "Сохранить" : "Добавить"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({
  type = "number",
  value,
  min,
  max,
  step,
  placeholder,
  required = false,
  ...args
}: HTMLAttributes<HTMLInputElement> & {
  value: any;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  required?: boolean;
  type?: HTMLInputTypeAttribute;
}) {
  return (
    <input
      type={type}
      value={value}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      className={clsx("input", args.className)}
      required={required}
      {...args}
    />
  );
}

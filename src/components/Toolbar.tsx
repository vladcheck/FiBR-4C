import Button from "./Button.tsx";

export default function Toolbar({ onClick }: { onClick: () => void }) {
  return (
    <div className="toolbar">
      <h1 className="title">Каталог товаров</h1>
      <Button className="btn--primary" onClick={onClick}>
        + Добавить товар
      </Button>
    </div>
  );
}

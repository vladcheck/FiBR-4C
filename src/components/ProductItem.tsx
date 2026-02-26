import { Star, Trash2 } from "lucide-react";
import Button from "./Button.tsx";

export default function ProductItem({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: Product["id"]) => void;
}) {
  return (
    <div className="productRow">
      <div className="productMain">
        <div className="productId">#{product.id}</div>
        <div>
          <div className="productName">{product.name}</div>
          <div className="productCategory">{product.category}</div>
          <div className="productDescription">{product.description}</div>
        </div>
        <div className="productInfo">
          <div className="productPrice">{product.price} ₽</div>
          <div className="productStock">Запас: {product.stock} шт</div>
          {product.rating && (
            <div className="productRating">
              <Star width={16} height={16} />
              {product.rating}/10
            </div>
          )}
        </div>
      </div>

      <div className="productActions">
        <Button onClick={() => onEdit(product)}>Редактировать</Button>
        <Button className="btn--danger" onClick={() => onDelete(product.id)}>
          <Trash2 height={14} width={14} color="red" />
        </Button>
      </div>
    </div>
  );
}

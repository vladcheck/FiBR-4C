import { Product } from "../types.ts";
import ProductItem from "./ProductItem.tsx";

export default function ProductsList({
	products,
	onEdit,
	onDelete,
}: {
	products: Product[];
	onEdit: (...args: any[]) => void;
	onDelete: (...args: any[]) => void;
}) {
	if (!products.length) {
		return <div className='empty'>товаров пока нет</div>;
	}

	return (
		<div className='grid'>
			{products.map((p) => (
				<ProductItem
					key={p.id}
					product={p}
					onEdit={onEdit}
					onDelete={onDelete}
				/>
			))}
		</div>
	);
}


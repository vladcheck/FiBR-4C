import "./ProductsPage.scss";
import { api } from "../../api/index.ts";
import ProductModal from "../../components/ProductModal.tsx";
import ProductsList from "../../components/ProductsList.tsx";
import { useEffect, useState } from "react";
import Header from "../../components/Header.tsx";
import Footer from "../../components/Footer.tsx";
import Loading from "../../components/Loading.tsx";
import Container from "../../components/Container.tsx";
import Toolbar from "../../components/Toolbar.tsx";
import Main from "../../components/Main.tsx";

export default function ProductsPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

	const [modalOpen, setModalOpen] = useState(false);
	const [modalMode, setModalMode] = useState<"create" | "edit">(
		"create",
	);
	const [editingProduct, setEditingProduct] =
		useState<Product | null>(null);

	useEffect(() => {
		loadProducts();
	}, []);

	const loadProducts = async () => {
		try {
			setLoading(true);
			const data = await api.getProducts();
			setProducts(data);
		} catch (err) {
			console.error(err);
			alert("Ошибка загрузки товаров");
		} finally {
			setLoading(false);
		}
	};

	const openCreate = () => {
		setModalMode("create");
		setEditingProduct(null);
		setModalOpen(true);
	};

	const openEdit = (product: Product) => {
		setModalMode("edit");
		setEditingProduct(product);
		setModalOpen(true);
	};

	const closeModal = () => {
		setEditingProduct(null);
		setModalOpen(false);
	};

	const handleDelete = async (id: Product["id"]) => {
		const ok = window.confirm("Удалить товар?");
		if (!ok) return;
		try {
			setProducts((prev) => prev.filter((p) => p.id !== id));

			try {
				await api.deleteProduct(id);
			} catch (err) {
				await loadProducts();
				throw err;
			}
		} catch (err) {
			console.error(err);
			alert("Ошибка удаления товара");
		}
	};

	const handleSubmit = async (payload: Product) => {
		try {
			if (modalMode === "create") {
				const { id, ...productData } = payload;
				const newProduct = await api.createProduct({
					id,
					...productData,
				});
				console.log("Created product:", newProduct);
				if (newProduct && newProduct.id) {
					setProducts((prev) => [...prev, newProduct]);
				} else {
					await loadProducts();
				}
			} else if (modalMode === "edit" && editingProduct) {
				const updatedProduct = await api.updateProduct(payload);
				setProducts((prev) =>
					prev.map((p) => (p.id === payload.id ? updatedProduct : p)),
				);
			}
			closeModal();
		} catch (err) {
			console.error(err);
			alert("Ошибка сохранения данных");
		}
	};

	return (
		<div className='page'>
			<Header />
			<Main>
				<Container>
					<Toolbar onClick={openCreate} />
					{loading ? (
						<Loading />
					) : (
						<ProductsList
							products={products}
							onEdit={openEdit}
							onDelete={handleDelete}
						/>
					)}
				</Container>
			</Main>
			<Footer />
			{modalOpen && (
				<ProductModal
					open={modalOpen}
					mode={modalMode}
					initialProduct={editingProduct}
					onClose={closeModal}
					onSubmit={handleSubmit}
				/>
			)}
		</div>
	);
}


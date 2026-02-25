import axios from "axios";

const PORT = process.env.BACKEND_PORT || 3001;
const apiClient = axios.create({
	baseURL: `http://localhost:${PORT}`,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

export const api = {
	createProduct: async (product: Product) => {
		const response = await apiClient.post("/api/products", product);
		return response.data;
	},
	getProducts: async () => {
		const response = await apiClient.get("/api/products");
		return response.data;
	},
	getProductById: async (id: Product["id"]) => {
		const response = await apiClient.get(`/api/products/${id}`);
		return response.data;
	},
	updateProduct: async (product: Product) => {
		const response = await apiClient.patch(`/api/products`, product);
		return response.data;
	},
	deleteProduct: async (id: Product["id"]) => {
		const response = await apiClient.delete(`/api/products/${id}`);
		return response.data;
	},
};


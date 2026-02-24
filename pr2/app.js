import express from "express";

const products = {};
const colors = ["red", "green", "blue", "violet"];
const items = ["fork", "knife", "plate", "teapot"];

for (let i = 0; i < 100; i++) {
	products[i] = {
		id: i,
		name: colors[i % 4] + " " + items[(i + 1) % 4],
		price: i * 90,
	};
}

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
	res.send("OK");
});

app.get("/products", (req, res) => {
	res.json(products);
});

app.get("/products/:id", (req, res) => {
	const p = products[req.params.id];
	if (p === undefined) res.status(404).send("Product not found");
	else res.json(p);
});

app.post("/products", (req, res) => {
	const { name, price } = req.body;
	const id = Object.entries(products).length;

	const newProduct = { id, name, price };
	products[id] = newProduct;
	res.status(201).json(newProduct);
});

app.patch("/products", (req, res) => {
	const { id, name, price } = req.body;
	if (products[id] !== undefined) {
		if (name) products[id].name = name;
		if (price) products[id].price = price;
		res.status(201).json(products[id]);
	} else {
		res.status(404).json("Product doesn't exist");
	}
});

app.delete("/products/:id", (req, res) => {
	const deletedProduct = products[req.params.id];
	delete products[req.params.id];
	res.json(deletedProduct);
});

app.listen(port, () => {
	console.log(`Сервер запущен на http://localhost:${port}`);
});


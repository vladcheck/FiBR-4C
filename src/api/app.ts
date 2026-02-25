import { nanoid } from "nanoid";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import express, { type Request, type Response } from "express";
import cors from "cors";
import swaggerUi, { type SwaggerOptions } from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { Product } from "../types";
import swaggerSpec from "../swagger";

const ID_SIZE = 6;
const PORT = process.env.BACKEND_PORT || 3001;
export const app = express();

let products: Map<string, Product> = new Map();

const getId = (size: number = ID_SIZE) => nanoid(size);

function createMockProducts(): Map<string, Product> {
	const productsMap = new Map();
	const products = [
		{
			id: getId(),
			name: "Серебряная чашка",
			category: "Посуда",
			description: "Изысканная чашка из чистого серебра",
			price: 2500,
			stock: 15,
			rating: 4.8,
		},
		{
			id: getId(),
			name: "Керамический чайник",
			category: "Посуда",
			description: "Традиционный чайник из красной керамики",
			price: 890,
			stock: 20,
			rating: 4.5,
		},
		{
			id: getId(),
			name: "Льняная скатерть",
			category: "Текстиль",
			description: "Натуральная льняная скатерть 150х200см",
			price: 1200,
			stock: 8,
			rating: 4.7,
		},
		{
			id: getId(),
			name: "Деревянная доска для булки",
			category: "Кухня",
			description: "Массивная дубовая разделочная доска",
			price: 550,
			stock: 25,
			rating: 4.6,
		},
		{
			id: getId(),
			name: "Стеклянные бокалы",
			category: "Посуда",
			description: "Набор из 6 хрустальных бокалов для вина",
			price: 3200,
			stock: 12,
			rating: 4.9,
		},
		{
			id: getId(),
			name: "Льняные салфетки",
			category: "Текстиль",
			description: "Комплект из 12 льняных салфеток 45х45см",
			price: 780,
			stock: 30,
			rating: 4.4,
		},
		{
			id: getId(),
			name: "Фарфоровая тарелка",
			category: "Посуда",
			description: "Декорированная фарфоровая тарелка ручной работы",
			price: 450,
			stock: 40,
			rating: 4.7,
		},
		{
			id: getId(),
			name: "Декоративная ваза",
			category: "Декор",
			description: "Керамическая ваза с ручной росписью",
			price: 1800,
			stock: 7,
			rating: 4.85,
		},
		{
			id: getId(),
			name: "Кухонные полотенца",
			category: "Текстиль",
			description: "Набор из 5 махровых кухонных полотенец",
			price: 650,
			stock: 50,
			rating: 4.3,
		},
		{
			id: getId(),
			name: "Деревянные подставки",
			category: "Декор",
			description: "Набор из 4 подставок под горячее из дерева",
			price: 380,
			stock: 35,
			rating: 4.6,
		},
		{
			id: getId(),
			name: "Серебряный поднос",
			category: "Посуда",
			description: "Филированный серебряный поднос с ручками",
			price: 4500,
			stock: 5,
			rating: 4.9,
		},
		{
			id: getId(),
			name: "Фарфоровый чайный сервиз",
			category: "Посуда",
			description: "Полный чайный сервиз на 6 персон из фарфора",
			price: 5800,
			stock: 6,
			rating: 5,
		},
	];
	for (const product of products) {
		productsMap.set(product.id, product);
	}
	return productsMap;
}

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 *  components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - description
 *         - price
 *         - stock
 *       properties:
 *         id:
 *           type: string
 *           description: Автоматически сгенерированный уникальный ID товара
 *         name:
 *          type: string
 *          description: Название товара
 *         category:
 *          type: string
 *          description: Категория товара
 *         description:
 *          type: string
 *          description: Описание товара
 *         price:
 *          type: number
 *          description: Цена товара в рублях
 *         stock:
 *          type: integer
 *          description: Количество товара на складе
 *         image:
 *          type: string
 *          description: URL изображения товара (опционально)
 *         rating:
 *          type: number
 *          description: Рейтинг товара от 1 до 10 (опционально)
 *         example:
 *          id: "abc123"
 *          name: "Серебряная чашка"
 *          category: "Посуда"
 *          description: "Изысканная чашка из чистого серебра"
 *          price: 2500
 *          stock: 15
 *          rating: 4.8
 */

app.use(
	cors({
		origin: `http://localhost:3000`,
		methods: ["GET", "POST", "PATCH", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);

// Middleware для логирования запросов
app.use((req, res, next) => {
	res.on("finish", () => {
		console.log(`[${new Date().toISOString()}] [${req.method}]
${res.statusCode} ${req.path}`);
		if (
			req.method === "POST" ||
			req.method === "PUT" ||
			req.method === "PATCH" ||
			req.method === "DELETE"
		) {
			console.log("Body:", req.body);
		}
	});
	next();
});

function tryFindProduct(
	id: Product["id"] | unknown,
	res: Response,
): Product | null {
	try {
		const product = [...products.values()].find((p) => p.id == id);
		if (!product) throw Error(ReasonPhrases.NOT_FOUND);
		return product;
	} catch (error) {
		res.status(StatusCodes.NOT_FOUND).json({ error });
		return null;
	}
}

app.get("/api/", (_, res: Response) => {
	res
		.status(StatusCodes.OK)
		.send("Success. Use endpoints to interact.");
});

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Возвращает список всех товаров
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get("/api/products", (_: Request, res: Response) => {
	res.status(StatusCodes.OK).json([...products.values()]);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получает товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Данные товара
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 */
app.get("/api/products/:id", (req: Request, res: Response) => {
	if (req.params.id === undefined || req.params.id === "") {
		res.status(StatusCodes.BAD_REQUEST).send(StatusCodes.BAD_REQUEST);
		return;
	}
	const p = tryFindProduct(req.params.id, res);

	if (p === undefined) {
		res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
	} else {
		res.status(StatusCodes.OK).json(p);
	}
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создает новый товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - description
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               image:
 *                 type: string
 *               rating:
 *                 type: number
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка в теле запроса
 */
app.post("/api/products", (req, res) => {
	if (
		req.body.name === undefined ||
		req.body.category === undefined ||
		req.body.description === undefined ||
		req.body.price === undefined ||
		req.body.stock === undefined
	) {
		res
			.status(StatusCodes.BAD_REQUEST)
			.send(ReasonPhrases.BAD_REQUEST);
		return;
	}
	const { name, category, description, price, stock, image, rating } =
		req.body;
	const id = nanoid(ID_SIZE);

	const newProduct = {
		id,
		name,
		category,
		description,
		price: Number(price),
		stock: Number(stock),
		image,
		rating: rating ? Number(rating) : undefined,
	};
	products.set(id, newProduct);
	console.log("POST Response:", newProduct);
	res.status(StatusCodes.CREATED).json(newProduct);
});

/**
 * @swagger
 * /api/products:
 *   patch:
 *     summary: Обновляет данные товара
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - category
 *               - description
 *               - price
 *               - stock
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               image:
 *                 type: string
 *               rating:
 *                 type: number
 *     responses:
 *       200:
 *         description: Обновленный товар
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Нет данных для обновления
 *       404:
 *         description: Товар не найден
 */
app.patch("/api/products", (req, res) => {
	if (
		req.body.id === undefined ||
		req.body.name === undefined ||
		req.body.category === undefined ||
		req.body.description === undefined ||
		req.body.price === undefined ||
		req.body.stock === undefined
	) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			error: "Nothing to update",
		});
	}

	const {
		id,
		name,
		category,
		description,
		price,
		stock,
		image,
		rating,
	} = req.body;
	const product = tryFindProduct(id, res);

	if (product === undefined) {
		res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND);
		return;
	}
	const productCopy: Product = {
		id,
		name: name.trim(),
		category: category.trim(),
		description: description.trim(),
		price: Number(price),
		stock: Number(stock),
		image,
		rating: rating ? Number(rating) : undefined,
	};
	products.set(id, productCopy);
	res.status(StatusCodes.OK).json(productCopy);
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удаляет товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       204:
 *         description: Товар успешно удален (нет тела ответа)
 *       404:
 *         description: Товар не найден
 */
app.delete("/api/products/:id", (req, res) => {
	const id = req.params.id;
	const deletedProduct = products.get(id);

	if (deletedProduct) {
		products.delete(id);
		res.status(StatusCodes.NO_CONTENT);
	} else {
		res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND);
	}
});

// Для остальных маршрутов
app.use((_, res) => {
	res
		.status(StatusCodes.NOT_FOUND)
		.json({ error: ReasonPhrases.NOT_FOUND });
});

// Глобальный обработчик ошибок (чтобы сервер не падал)
app.use((err: string, req: Request, res: Response, next: any) => {
	console.error(StatusCodes.INTERNAL_SERVER_ERROR, err);
	res
		.status(StatusCodes.INTERNAL_SERVER_ERROR)
		.json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
});

app.listen(PORT, () => {
	products = createMockProducts();
	console.log(`Сервер запущен на http://localhost:${PORT}`);
});


import { type SwaggerOptions } from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const PORT = process.env.BACKEND_PORT || 3001;

const swaggerOptions: SwaggerOptions = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "API управления товарами",
			version: "1.0.0",
			description:
				"API для интернет-магазина предметов домашнего обихода",
		},
		servers: [
			{
				url: `http://localhost:${PORT}`,
				description: "Локальный сервер",
			},
		],
	},
	apis: ["./src/api/app.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
export default swaggerSpec;


import dotenv from "dotenv";
import { Dialect } from "sequelize";

dotenv.config();

export default {
	// MySql
	host: process.env.DB_HOST as string,
	user: process.env.DB_USER as string,
	password: process.env.DB_PASSWORD as string,
	db: process.env.DB_NAME as string,
	dialect: "mysql" as Dialect,
	pool: {
		max: 5,
		min: 0,
		acquire: 1000000,
		idle: 10000,
	},
};

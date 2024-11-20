import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load environment variables
dotenv.config({ path: "./src/config/.env" });

export default defineConfig({
	out: "./drizzle",
	schema: "./src/db/schema.js",
	dialect: "mysql",
	verbose: true,
	strict: true,
	dbCredentials: {
		host: process.env.RDS_HOST,
		port: process.env.RDS_PORT || 3306,
		user: process.env.RDS_USER,
		password: process.env.RDS_PASSWORD,
		database: process.env.RDS_DATABASE,
	},
});

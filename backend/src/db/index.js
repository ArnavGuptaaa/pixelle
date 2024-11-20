import { drizzle } from "drizzle-orm/mysql2";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "./src/config/.env" });

const db = drizzle(
	`mysql://${process.env.RDS_USER}:${process.env.RDS_PASSWORD}@${process.env.RDS_HOST}:${process.env.RDS_PORT || 3306}/${process.env.RDS_DATABASE}`
);

export default db;

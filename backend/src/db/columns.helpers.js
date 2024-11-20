import { timestamp } from "drizzle-orm/mysql-core";

const timestamps = {
	created_at: timestamp().defaultNow().notNull(),
};

export default timestamps;

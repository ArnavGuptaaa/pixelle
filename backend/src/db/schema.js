import { int, mysqlTable, varchar, check } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import timestamps from "./columns.helpers.js";

export const users = mysqlTable("users", {
	id: int().notNull().autoincrement().unique().primaryKey(),
	username: varchar({ length: 25 }).notNull().unique(),
	password: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 100 }).unique().notNull(),
	follower_count: int().notNull().default(0),
	profile_image_url: varchar({ length: 500 }),
	...timestamps,
});

export const follows = mysqlTable(
	"follows",
	{
		id: int().notNull().autoincrement().unique().primaryKey(),
		follower_user_id: int()
			.notNull()
			.references(() => users.id, {
				onDelete: "cascade",
			}),
		following_user_id: int()
			.notNull()
			.references(() => users.id, {
				onDelete: "cascade",
			}),
		...timestamps,
	},
	(table) => ({
		followOwnselfCheck: check(
			"follow_ownself_check",
			sql`${table.following_user_id} != ${table.follower_user_id}`
		),
	})
);

export const posts = mysqlTable("posts", {
	id: int().notNull().autoincrement().unique().primaryKey(),
	image_url: varchar({ length: 500 }).unique(),
	caption: varchar({ length: 200 }),
	likes: int(),
	user_id: int().references(() => users.id, { onDelete: "cascade" }),
	...timestamps,
});

export const comments = mysqlTable("comments", {
	id: int().notNull().autoincrement().unique().primaryKey(),
	comment: varchar({ length: 500 }),
	post_id: int()
		.notNull()
		.references(() => posts.id, { onDelete: "cascade" }),
	user_id: int()
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	...timestamps,
});

export const likes = mysqlTable("likes", {
	id: int().notNull().autoincrement().unique().primaryKey(),
	user_id: int()
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	post_id: int()
		.notNull()
		.references(() => posts.id, { onDelete: "cascade" }),
	...timestamps,
});

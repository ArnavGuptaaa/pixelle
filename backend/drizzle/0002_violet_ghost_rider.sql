CREATE TABLE `likes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`post_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `likes_id` PRIMARY KEY(`id`),
	CONSTRAINT `likes_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
ALTER TABLE `comments` DROP INDEX `comments_comment_unique`;--> statement-breakpoint
ALTER TABLE `comments` MODIFY COLUMN `post_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `comments` MODIFY COLUMN `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `likes` ADD CONSTRAINT `likes_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `likes` ADD CONSTRAINT `likes_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;
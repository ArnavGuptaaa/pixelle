ALTER TABLE `follows` MODIFY COLUMN `follower_user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `follows` MODIFY COLUMN `following_user_id` int NOT NULL;
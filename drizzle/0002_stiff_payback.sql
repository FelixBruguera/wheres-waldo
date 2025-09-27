PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_games` (
	`id` text PRIMARY KEY NOT NULL,
	`player_name` text,
	`start_time` integer DEFAULT (current_timestamp) NOT NULL,
	`end_time` integer,
	`score_in_seconds` integer
);
--> statement-breakpoint
INSERT INTO `__new_games`("id", "player_name", "start_time", "end_time", "score_in_seconds") SELECT "id", "player_name", "start_time", "end_time", "score_in_seconds" FROM `games`;--> statement-breakpoint
DROP TABLE `games`;--> statement-breakpoint
ALTER TABLE `__new_games` RENAME TO `games`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
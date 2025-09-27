CREATE TABLE `coordinates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`x_min` integer NOT NULL,
	`x_max` integer NOT NULL,
	`y_min` integer NOT NULL,
	`y_max` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `found_characters` (
	`character_id` integer NOT NULL,
	`game_id` integer NOT NULL,
	FOREIGN KEY (`character_id`) REFERENCES `coordinates`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `found_characters_game_id_character_id_unique` ON `found_characters` (`game_id`,`character_id`);--> statement-breakpoint
CREATE TABLE `games` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`playerName` text,
	`start_time` integer DEFAULT (current_timestamp) NOT NULL,
	`end_time` integer,
	`score_in_seconds` integer
);

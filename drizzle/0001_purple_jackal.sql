ALTER TABLE `coordinates` RENAME TO `characters`;--> statement-breakpoint
ALTER TABLE `games` RENAME COLUMN "playerName" TO "player_name";--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_found_characters` (
	`character_id` integer NOT NULL,
	`game_id` integer NOT NULL,
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_found_characters`("character_id", "game_id") SELECT "character_id", "game_id" FROM `found_characters`;--> statement-breakpoint
DROP TABLE `found_characters`;--> statement-breakpoint
ALTER TABLE `__new_found_characters` RENAME TO `found_characters`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `found_characters_game_id_character_id_unique` ON `found_characters` (`game_id`,`character_id`);
import { sql } from "drizzle-orm";
import {
  int,
  integer,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";

export const characters = sqliteTable("characters", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text(),
  xMin: integer("x_min").notNull(),
  xMax: integer("x_max").notNull(),
  yMin: integer("y_min").notNull(),
  yMax: integer("y_max").notNull(),
});

export const games = sqliteTable("games", {
  id: text().primaryKey(),
  playerName: text("player_name"),
  startTime: integer("start_time")
    .notNull()
    .default(sql`(current_timestamp)`),
  endTime: integer("end_time"),
  scoreInSeconds: integer("score_in_seconds"),
});

export const foundCharacters = sqliteTable(
  "found_characters",
  {
    characterId: integer("character_id")
      .notNull()
      .references(() => characters.id),
    gameId: integer("game_id")
      .notNull()
      .references(() => games.id),
  },
  (t) => [unique().on(t.gameId, t.characterId)],
);

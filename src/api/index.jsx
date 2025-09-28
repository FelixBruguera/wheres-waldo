import { drizzle } from "drizzle-orm/d1"
import { Hono } from 'hono'
import * as schema from "../db/schema"
import { and, count, eq, isNull, sql } from "drizzle-orm"

const app = new Hono().basePath("/api")

app.get("/games/:id", async (c) => {
  const db = drizzle(c.env.DB, { schema: schema })
  const id = c.req.param("id")
  try {
    const [gameData, characters] = await Promise.all([
      db.select({
      startTime: schema.games.startTime,
      score: schema.games.scoreInSeconds
    })
    .from(schema.games)
    .where(eq(schema.games.id, id)),
    db.select({
      id: schema.characters.id,
      name: schema.characters.name
    })
    .from(schema.characters)
    .leftJoin(schema.foundCharacters, and(
      eq(schema.characters.id, schema.foundCharacters.characterId),
      eq(schema.foundCharacters.gameId, id)
    ))
    .where(isNull(schema.foundCharacters.characterId))
  ])
    return c.json({
      gameData: gameData[0],
      characters: characters
    })
  }
  catch (e) {
    console.log(e)
    return c.newResponse(null, 500)
  }
})

app.post('/games', async (c) => {
  const db = drizzle(c.env.DB, { schema: schema })
  try {
    const response = await db.insert(schema.games).values({ id: crypto.randomUUID()}).returning({ id: schema.games.id })
    return c.json(response)
  }
  catch (e) {
    console.log(e)
    return c.newResponse(null, 500)
  }
})

app.patch("/games/:id", async (c) => {
  const db = drizzle(c.env.DB, { schema: schema })
  const id = c.req.param("id")
  const { x, y, characterId, characterName } = await c.req.json()
  const [coordinates, found, startTime] = await Promise.all([
    db.select({
      xMin: schema.characters.xMin,
      xMax: schema.characters.xMax,
      yMin: schema.characters.yMin,
      yMax: schema.characters.yMax
    })
    .from(schema.characters)
    .where(eq(schema.characters.id, characterId)),
    db.select({
      id: schema.foundCharacters.characterId
    })
    .from(schema.foundCharacters)
    .where(eq(schema.foundCharacters.gameId, id)),
    db.select({
      startTime: schema.games.startTime
    })
    .from(schema.games)
    .where(eq(schema.games.id, id))
  ])
  console.log([found, coordinates])
  if (found.some(foundChar => foundChar.id === characterId)) {
    return c.newResponse(JSON.stringify({error: "You've already found that character"}), 400)
  }
  const correctCoordinates = coordinates[0]
  if (x > correctCoordinates.xMax || x < correctCoordinates.xMin || y > correctCoordinates.yMax || y < correctCoordinates.yMin) {
    return c.newResponse(JSON.stringify({error: "Bad guess"}), 422)
  }
  if (found.length === 3) {
    try {
      const [found, score] = await db.batch([
        db.insert(schema.foundCharacters).values({ characterId: characterId, gameId: id }).returning(),
        db.update(schema.games)
        .set({endTime: sql`(current_timestamp)`, scoreInSeconds: sql`(CAST(strftime('%s', current_timestamp) AS INTEGER) - CAST(strftime('%s', ${startTime[0].startTime}) AS INTEGER))`})
        .returning({ scoreInSeconds: schema.games.scoreInSeconds})
      ])
      console.log(response)
      return c.json({
        status: "finished",
        found: found[0],
        score: score
      })
    }
    catch (e) {
      console.log(e)
      return c.newResponse(null, 500)
    }
  }
  else {
    try {
      const response = await db.insert(schema.foundCharacters)
      .values({ characterId: characterId, gameId: id })
      .returning()
      console.log(response)
      return c.json({
        status: "playing",
        found: {...response[0], name: characterName}
      })
    }
    catch (e) {
      console.log(e)
      return c.newResponse(null, 500)
    }
  }
})

export default app

import { drizzle } from "drizzle-orm/d1"
import { Hono } from 'hono'
import * as schema from "../db/schema"
import { and, asc, count, eq, gte, isNotNull, isNull, lte, or, sql } from "drizzle-orm"

const app = new Hono().basePath("/api")

app.get("/games/:id", async (c) => {
  const db = drizzle(c.env.DB, { schema: schema })
  const id = c.req.param("id")
  try {
    const [gameData, characters] = await Promise.all([
      db.select({
      startTime: schema.games.startTime,
      score: schema.games.scoreInSeconds,
      playerName: schema.games.playerName
    })
    .from(schema.games)
    .where(eq(schema.games.id, id)),
    db.select({
      id: schema.foundCharacters.characterId,
      name: schema.characters.name
    })
    .from(schema.foundCharacters)
    .leftJoin(schema.characters, eq(schema.foundCharacters.characterId, schema.characters.id))
    .where(eq(schema.foundCharacters.gameId, id))
  ])
  if (gameData.length < 1) {
    return c.newResponse(null, 404)
  }
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

app.post("/games/:id", async (c) => {
  const db = drizzle(c.env.DB, { schema: schema })
  const id = c.req.param("id")
  const { x, y } = await c.req.json()
  const [character, found, startTime] = await Promise.all([
    db.select({
      xMin: schema.characters.xMin,
      xMax: schema.characters.xMax,
      yMin: schema.characters.yMin,
      yMax: schema.characters.yMax,
      name: schema.characters.name,
      id: schema.characters.id
    })
    .from(schema.characters)
    .where(and(gte(x, schema.characters.xMin), lte(x, schema.characters.xMax), gte(y, schema.characters.yMin), lte(y, schema.characters.yMax))),
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
  if (character.length < 1) {
    return c.newResponse(JSON.stringify({error: "No character there"}), 422)
  }
  const foundCharacter = character[0]
  if (found.some(foundChar => foundChar.id === foundCharacter.id)) {
    return c.newResponse(JSON.stringify({error: "You've already found that character"}), 400)
  }
  if (found.length === 3) {
    try {
      const [found, score] = await db.batch([
        db.insert(schema.foundCharacters).values({ characterId: foundCharacter.id, gameId: id }).returning(),
        db.update(schema.games)
        .set({endTime: sql`(current_timestamp)`, scoreInSeconds: sql`(CAST(strftime('%s', current_timestamp) AS INTEGER) - CAST(strftime('%s', ${startTime[0].startTime}) AS INTEGER))`})
        .where(eq(schema.games.id, id))
        .returning({ score: schema.games.scoreInSeconds})
      ])
      return c.json({
        status: "finished",
        found: found[0],
        score: score[0].score
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
      .values({ characterId: foundCharacter.id, gameId: id })
      .returning()
      console.log(response)
      return c.json({
        status: "playing",
        found: {...response[0], name: foundCharacter.name}
      })
    }
    catch (e) {
      console.log(e)
      return c.newResponse(null, 500)
    }
  }
})

app.patch("/games/:id", async (c) => {
  const db = drizzle(c.env.DB, { schema: schema })
  const id = c.req.param("id")
  const { name } = await c.req.json()
  if (name.length > 20 || name.length < 3) {
    return c.json({error: "Name must have more than 3 and less than 20 characters"}, 400)
  }
  const response = await db.update(schema.games).set({ playerName: name }).where(and(eq(schema.games.id, id), isNull(schema.games.playerName))).returning({ playerName: schema.games.playerName})
  if (response.length > 0) {
    return c.json(response[0])
  }
  else {
    console.log(response)
    return c.newResponse(null, 500)
  }
})

app.get("/leaderboard", async (c) => {
  const db = drizzle(c.env.DB, { schema: schema })
  const response = await db.
  select({ playerName: schema.games.playerName, score: schema.games.scoreInSeconds})
  .from(schema.games)
  .where(and(isNotNull(schema.games.scoreInSeconds), isNotNull(schema.games.playerName)))
  .orderBy(asc(schema.games.scoreInSeconds))
  .limit(10)
  return c.json(response)
})

export default app

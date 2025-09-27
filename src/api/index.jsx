import { drizzle } from "drizzle-orm/d1"
import { Hono } from 'hono'
import * as schema from "../db/schema"
import { count, eq } from "drizzle-orm"

const app = new Hono().basePath("/api")

app.get("/games/:id", async (c) => {
  const db = drizzle(c.env.DB, { schema: schema })
  const id = c.req.param("id")
  try {
    const response = await db.select({
      startTime: schema.games.startTime,
      found: count(schema.foundCharacters.characterId)
    })
    .from(schema.games)
    .leftJoin(schema.foundCharacters, eq(schema.foundCharacters.gameId, id))
    .where(eq(schema.games.id, id))
    return c.json(response)
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

export default app

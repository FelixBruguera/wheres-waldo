import { Hono } from 'hono'

const app = new Hono().basePath("/api")

app.post('/games', async (c) => {
  const db = c.env.DB
  console.log(db)
  return c.json({message: "Hello!"})
})

export default app

import { Hono } from 'hono'

const app = new Hono().basePath("/api")

app.get('/', (c) => {
  console.log(c)
  return c.json({message: "Hello!"})
})

export default app

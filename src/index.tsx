import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html"
import { swagger } from '@elysiajs/swagger'
import { Counter } from "./components/Counter";

const TODOS = [
  { id: 1, title: 'Buy milk' },
  { id: 2, title: 'Buy eggs' },
  { id: 3, title: 'Buy bread' }
]

const app = new Elysia()
  .use(html())
  .use(swagger())
  .get("/", () => "Hello Elysia", {
    response: t.String()
  })
  .get('/todos', () => TODOS, {
    detail: {
      summary: 'Return all TODOs for the user',
      tags: ['todos']
    },
    response: t.Array(t.Object({
      id: t.Number(),
      title: t.String()
    }))
  })
  .get('/todos/:id', ({ params: { id } }) => {
    return TODOS.find(todo => todo.id === +id)
  }, {
    params: t.Object({
      id: t.Number()
    }),
  })
  .get('/app', () => <Counter />)
  .listen(Bun.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

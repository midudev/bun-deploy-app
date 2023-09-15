import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html"
import { swagger } from '@elysiajs/swagger'
import { Counter } from "./components/Counter";
import { renderToReadableStream } from 'react-dom/server';

const TODOS = [
  { id: 1, title: 'Buy milk' },
  { id: 2, title: 'Buy eggs' },
  { id: 3, title: 'Buy bread' }
]

const app = new Elysia()
  .on('start', app => {
    console.log('Elysia started at http://%s:%s', app.server?.hostname, app.server?.port);
  })
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
      id: t.Numeric() // Cast the type to Number, you can also use tranform object
    }),
  })

  // This will work only if you use server-side apis only if none you should return html with react and do hydration or something =)
  .get('/app', () => <Counter />)
  .get('/react', async () => new Response(await renderToReadableStream(<Counter />,{
    onError: console.error
  }), { 
    headers: {
      'Content-Type': 'text/html'
    }
  }))
  .listen(Bun.env.PORT || 3000);

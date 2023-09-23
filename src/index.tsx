import { Elysia, t } from "elysia";
import { staticPlugin } from '@elysiajs/static';
import { swagger } from '@elysiajs/swagger';
import { Counter } from "./components/Counter";
import { renderToReadableStream } from 'react-dom/server';
import { basename } from "path";
import  App  from "./pages";
import html from "@elysiajs/html";

const {outputs: [hydratratejsAsset, pageAsset]} = await Bun.build({
  entrypoints: ['src/hydrate.tsx', 'src/pages/index.tsx'],
  outdir: 'public',
  target: 'browser',
  splitting: true,
  minify: true,
  publicPath: '/',
}); // You can read automatically from outputs


const TODOS = [
  { id: 1, title: 'Buy milk' },
  { id: 2, title: 'Buy eggs' },
  { id: 3, title: 'Buy bread' }
]

const app = new Elysia()
  .use(html())
  .use(swagger())
  .use(staticPlugin({
    assets: 'public',
    prefix: ''
  }))
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
  .get(basename(hydratratejsAsset.path), () => Bun.file(hydratratejsAsset.path))
  .get('/page', async () => {
    const reactStream = await renderToReadableStream(<App />, {
      bootstrapScriptContent: `globalThis.__CLIENT_COMPONENT_SRC__ = "/pages/${basename(pageAsset.path)}"`,
      bootstrapModules: [basename(hydratratejsAsset.path)],
      onError: console.error
    });
    return new Response(reactStream, {
      headers: { // Not necessary but be explicit in some cases it's fine
        'Content-Type': 'text/html'
      }
    })
  })
  .listen(Bun.env.PORT || 0, ({ hostname, port}) => {
    console.log('Elysia started at http://%s:%s', hostname, port);
  });


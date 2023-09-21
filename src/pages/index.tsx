import { Counter } from "../components/Counter";

export default function IndexPage() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>My app</title>
      </head>
      <body>
        <h1>This is a SSR component with a client side component inside</h1>
        <Counter />
      </body>
    </html>
  );
}
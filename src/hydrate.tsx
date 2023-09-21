import { hydrateRoot } from 'react-dom/client';
const { default: App} = await import(globalThis.__CLIENT_COMPONENT_SRC__)

hydrateRoot(document, <App />);
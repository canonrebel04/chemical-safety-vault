import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App.tsx';
import { Identity } from 'spacetimedb';
import { SpacetimeDBProvider } from 'spacetimedb/react';
import { DbConnection, ErrorContext } from './module_bindings/index.ts';
import SecureLS from 'secure-ls';

const HOST = import.meta.env.VITE_SPACETIMEDB_HOST;
const DB_NAME = import.meta.env.VITE_SPACETIMEDB_DB_NAME;

if (!HOST || !DB_NAME) {
  throw new Error('Environment variables VITE_SPACETIMEDB_HOST and VITE_SPACETIMEDB_DB_NAME must be provided');
}
const TOKEN_KEY = 'spacetimedb_token';
const ls = new SecureLS({ encodingType: 'aes', isCompression: false });

const onConnect = (_conn: DbConnection, identity: Identity, token: string) => {
  try {
    ls.set(TOKEN_KEY, token);
    console.log(
      'Connected to SpacetimeDB with identity:',
      identity.toHexString()
    );
  } catch (e) {
    console.error('Failed to store token securely, falling back to localStorage:', e);
    localStorage.setItem(TOKEN_KEY, token);
  }
};

const onDisconnect = () => {
  console.log('Disconnected from SpacetimeDB');
};

const onConnectError = (_ctx: ErrorContext, err: Error) => {
  const userFriendlyMessage = 'Failed to connect to the database. Please check your network connection and try again.';
  console.error('Error connecting to SpacetimeDB:', err);
  alert(userFriendlyMessage);
};

const connectionBuilder = DbConnection.builder()
  .withUri(HOST)
  .withDatabaseName(DB_NAME)
  .withToken((() => {
    try {
      return ls.get(TOKEN_KEY);
    } catch (e) {
      console.warn('Failed to retrieve token from secure storage, falling back to localStorage:', e);
      return localStorage.getItem(TOKEN_KEY);
    }
  })() || undefined)
  .onConnect(onConnect)
  .onDisconnect(onDisconnect)
  .onConnectError(onConnectError);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then((registration) => {
      console.log('SW registered: ', registration);
    }).catch((registrationError) => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SpacetimeDBProvider connectionBuilder={connectionBuilder}>
      <App />
    </SpacetimeDBProvider>
  </StrictMode>
);

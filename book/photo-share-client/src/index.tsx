import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ApolloClient, { InMemoryCache, NormalizedCacheObject } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { persistCache } from 'apollo-cache-persist';
import { PersistedData, PersistentStorage } from 'apollo-cache-persist/types';
import App from './App';
import reportWebVitals from './reportWebVitals';

const cache = new InMemoryCache();
await persistCache({
  cache,
  storage: localStorage as PersistentStorage<PersistedData<NormalizedCacheObject>>,
});
if (localStorage['apollo-cache-persist']) {
  const cacheData = JSON.parse(localStorage['apollo-cache-persist']);
  cache.restore(cacheData);
}

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache,
  // Add the authorization header to each request
  request: operation => {
    operation.setContext((context: any) => ({
      headers: {
        ...context.headers,
        Authorization: localStorage.getItem('token'),
      },
    }));
  },
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

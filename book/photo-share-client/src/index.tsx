import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ApolloClient, ApolloProvider, createHttpLink, IdGetterObj, InMemoryCache, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { LocalStorageWrapper, persistCache } from 'apollo3-cache-persist';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import App, { User } from './App';
import reportWebVitals from './reportWebVitals';

// Prepare links
const wsLink = new GraphQLWsLink(createClient({ url: process.env.REACT_APP_WS_URI as string }));
const httpLink = createHttpLink({ uri: process.env.REACT_APP_API_URI });
const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    authorization: localStorage.getItem('token'),
  },
}));
const httpAuthLink = authLink.concat(httpLink);
const link = split(
  ({ query }): boolean => {
    const def = getMainDefinition(query);
    return def.kind === 'OperationDefinition' && def.operation === 'subscription';
  },
  wsLink,
  httpAuthLink
);

// Prepare cache
const cache = new InMemoryCache({
  dataIdFromObject: (o: IdGetterObj) => {
    switch (o.__typename) {
      case 'User':
        return (o as User).githubUser;
      default:
        return o.id;
    }
  },
});
const storage = new LocalStorageWrapper(localStorage);
await persistCache({ cache, storage });

// Initialize ApolloClient
const client = new ApolloClient({ link, cache });

// Render the app
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

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ApolloClient, ApolloProvider, createHttpLink, IdGetterObj, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { LocalStorageWrapper, persistCache } from 'apollo3-cache-persist';
import App, { User } from './App';
import reportWebVitals from './reportWebVitals';

// Prepare the cache
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
await persistCache({
  cache,
  storage: new LocalStorageWrapper(localStorage),
});

// Initialize ApolloClient
const httpLink = createHttpLink({ uri: process.env.REACT_APP_API_URI });
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      Authorization: token,
    },
  };
});
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
});

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

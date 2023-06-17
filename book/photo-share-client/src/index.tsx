import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ApolloClient, { gql } from 'apollo-boost';
import App from './App';
import reportWebVitals from './reportWebVitals';

const client = new ApolloClient({ uri: 'http://localhost:4000/graphql' });

const query = gql`
  {
    totalUsers
    totalPhotos
  }
`;

client
  .query({ query })
  .then(({ data }) => console.log('data', data))
  .catch(console.error);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

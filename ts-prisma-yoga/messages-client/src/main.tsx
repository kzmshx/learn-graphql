import React from 'react'
import ReactDOM from 'react-dom/client'
import { cacheExchange, Client, fetchExchange, Provider } from 'urql'
import App from './App'
import './index.css'

const client = new Client({
  url: import.meta.env.VITE_API_URL || 'http://localhost:4000/graphql',
  exchanges: [cacheExchange, fetchExchange],
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider value={client}>
      <App />
    </Provider>
  </React.StrictMode>
)

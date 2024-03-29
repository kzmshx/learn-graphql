import React from 'react';
import { gql } from '@apollo/client';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Users from './components/Users';
import AuthorizedUser from './components/AuthorizedUser';

export type User = {
  id: string;
  githubUser: string;
  name: string;
  avatar: string;
};

export type RootQueryType = {
  totalUsers: number;
  allUsers: User[];
  me: User;
};

export const ROOT_QUERY = gql`
  fragment userInfo on User {
    githubUser
    name
    avatar
  }

  query allUsers {
    totalUsers
    allUsers {
      ...userInfo
    }
    me {
      ...userInfo
    }
  }
`;
export const ADD_FAKE_USERS_MUTATION = gql`
  mutation addFakeUsers($count: Int!) {
    addFakeUsers(count: $count) {
      githubUser
      name
      avatar
    }
  }
`;
export const GITHUB_AUTH_MUTATION = gql`
  mutation githubAuth($code: String!) {
    githubAuth(code: $code) {
      token
    }
  }
`;

const App = () => (
  <BrowserRouter>
    <div>
      <AuthorizedUser />
      <Users />
    </div>
  </BrowserRouter>
);

export default App;

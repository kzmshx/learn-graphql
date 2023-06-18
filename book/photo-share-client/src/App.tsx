import React from 'react';
import { gql } from 'apollo-boost';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Users from './Users';
import AuthorizedUser from './AuthorizedUser';

export type User = {
  githubUser: string;
  name: string;
  avatar: string;
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

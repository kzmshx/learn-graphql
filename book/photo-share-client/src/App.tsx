import React from 'react';
import { gql } from 'apollo-boost';
import './App.css';
import Users from './Users';

export type User = {
  githubUser: string;
  name: string;
  avatar: string;
};

export const ROOT_QUERY = gql`
  query allUsers {
    totalUsers
    allUsers {
      githubUser
      name
      avatar
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

const App = () => <Users />;

export default App;

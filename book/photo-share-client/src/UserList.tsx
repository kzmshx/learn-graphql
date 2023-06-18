import React from 'react';
import { ApolloQueryResult, OperationVariables } from 'apollo-boost';
import UserListItem from './UserListItem';
import { User } from './App';

const UserList = ({
  count,
  users,
  refetchUsers,
}: {
  count: number;
  users: User[];
  refetchUsers: (variables?: OperationVariables | undefined) => Promise<ApolloQueryResult<any>>;
}) => (
  <div>
    <p>{count} Users</p>
    <button onClick={() => refetchUsers()}>Refetch Users</button>
    <ul>
      {users.map(user => (
        <UserListItem key={user.githubUser} name={user.name} avatar={user.avatar} />
      ))}
    </ul>
  </div>
);

export default UserList;

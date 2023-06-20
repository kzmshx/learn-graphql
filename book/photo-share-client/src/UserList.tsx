import React from 'react';
import { ApolloQueryResult, OperationVariables, useMutation } from '@apollo/client';
import UserListItem from './UserListItem';
import { ADD_FAKE_USERS_MUTATION, ROOT_QUERY, RootQueryType, User } from './App';

const UserList = ({
  count,
  users,
  refetchUsers,
}: {
  count: number;
  users: User[];
  refetchUsers: (variables?: OperationVariables | undefined) => Promise<ApolloQueryResult<RootQueryType>>;
}) => {
  const [addFakeUsers, { loading }] = useMutation(ADD_FAKE_USERS_MUTATION, {
    variables: { count: 1 },
    update(cache, { data: { addFakeUsers } }) {
      const data = cache.readQuery<RootQueryType>({ query: ROOT_QUERY });
      if (data) {
        cache.writeQuery({
          query: ROOT_QUERY,
          data: {
            ...data,
            totalUsers: data.totalUsers + addFakeUsers.length,
            allUsers: [...data.allUsers, ...addFakeUsers],
          },
        });
      }
    },
  });

  return (
    <div>
      <p>{count} Users</p>
      <button onClick={() => refetchUsers()}>Refetch Users</button>
      <button onClick={() => addFakeUsers()} disabled={loading}>
        {loading ? 'Submitting...' : 'Add Fake Users'}
      </button>
      <ul>
        {users.map(user => (
          <UserListItem key={user.githubUser} name={user.name} avatar={user.avatar} />
        ))}
      </ul>
    </div>
  );
};

export default UserList;

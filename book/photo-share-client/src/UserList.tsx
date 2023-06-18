import React from 'react';
import { ApolloQueryResult, OperationVariables } from 'apollo-boost';
import { useMutation } from 'react-apollo';
import UserListItem from './UserListItem';
import { ADD_FAKE_USERS_MUTATION, ROOT_QUERY, User } from './App';

const UserList = ({
  count,
  users,
  refetchUsers,
}: {
  count: number;
  users: User[];
  refetchUsers: (variables?: OperationVariables | undefined) => Promise<ApolloQueryResult<any>>;
}) => {
  const [addFakeUsers, { loading }] = useMutation(ADD_FAKE_USERS_MUTATION, {
    variables: { count: 1 },
    refetchQueries: [{ query: ROOT_QUERY }],
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

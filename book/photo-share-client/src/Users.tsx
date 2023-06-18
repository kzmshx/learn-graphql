import React from 'react';
import { useQuery } from 'react-apollo';
import { ROOT_QUERY } from './App';
import UserList from './UserList';

const Users = () => {
  const { data, loading, refetch } = useQuery(ROOT_QUERY);

  if (loading) return <p>Loading users...</p>;

  return (
    <>
      <UserList count={data.totalUsers} users={data.allUsers} refetchUsers={refetch} />
    </>
  );
};

export default Users;

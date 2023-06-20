import React from 'react';
import { useQuery } from '@apollo/client';
import CurrentUser from './CurrentUser';
import { ROOT_QUERY } from './App';

const Me = ({ signingIn, requestCode, logout }: any) => {
  const { data, loading } = useQuery(ROOT_QUERY);

  if (data?.me) {
    return <CurrentUser {...data.me} logout={logout} />;
  }

  return (
    <>
      {loading && <p>Loading...</p>}
      <button onClick={requestCode} disabled={signingIn}>
        Sign In with GitHub
      </button>
    </>
  );
};

export default Me;

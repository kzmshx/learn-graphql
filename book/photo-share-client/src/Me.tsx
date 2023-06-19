import React from 'react';
import { useQuery } from 'react-apollo';
import CurrentUser from './CurrentUser';
import { ROOT_QUERY } from './App';

const Me = ({ signingIn, requestCode, logout }: any) => {
  const { loading, data } = useQuery(ROOT_QUERY);

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

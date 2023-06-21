import React from 'react';
import { useQuery } from '@apollo/client';
import { ROOT_QUERY } from '../App';
import CurrentUser from './CurrentUser';

export type MeProps = {
  signingIn: boolean;
  requestCode: () => void;
  logout: () => void;
};

const Me = ({ signingIn, requestCode, logout }: MeProps) => {
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

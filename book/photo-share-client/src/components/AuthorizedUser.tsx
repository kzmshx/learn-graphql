import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApolloClient, useMutation } from '@apollo/client';
import { GITHUB_AUTH_MUTATION, ROOT_QUERY } from '../App';
import Me from './Me';

const AuthorizedUser = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const client = useApolloClient();

  const [state, setState] = useState({ signingIn: false });

  const [githubAuth] = useMutation(GITHUB_AUTH_MUTATION, {
    update(cache, { data }) {
      // Save the token
      localStorage.setItem('token', data.githubAuth.token);
      // Go to home page
      navigate('/', { replace: true });
      // Enable again sign in button
      setState({ signingIn: false });
    },
    refetchQueries: [{ query: ROOT_QUERY }],
  });

  useEffect(() => {
    (async () => {
      if (search.match(/code=/)) {
        // Disable sign in button
        setState({ signingIn: true });
        // Authorize user
        const code = search.replace('?code=', '');
        await githubAuth({ variables: { code } });
      }
    })();
  }, []);

  const requestCode = () => {
    const clientID = process.env.REACT_APP_GITHUB_CLIENT_ID;
    window.location.assign(`https://github.com/login/oauth/authorize?client_id=${clientID}&scope=user`);
  };

  const logout = async () => {
    localStorage.removeItem('token');
    const data = client.readQuery({ query: ROOT_QUERY });
    client.writeQuery({
      query: ROOT_QUERY,
      data: {
        ...data,
        me: null,
      },
    });
  };

  return <Me signingIn={state.signingIn} requestCode={requestCode} logout={logout} />;
};

export default AuthorizedUser;

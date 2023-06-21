const { PubSub } = require('graphql-subscriptions');

const requestGitHubToken = credentials =>
  fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })
    .then(res => res.json())
    .catch(err => {
      throw new Error(JSON.stringify(err));
    });

const requestGitHubUserAccount = token =>
  fetch(`https://api.github.com/user`, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
    .then(res => res.json())
    .catch(err => {
      throw new Error(JSON.stringify(err));
    });

const authorizeWithGitHub = async credentials => {
  const { access_token } = await requestGitHubToken(credentials);
  const githubUser = await requestGitHubUserAccount(access_token);
  return { ...githubUser, access_token };
};

const pubsub = new PubSub();

const usePubSub = () => pubsub;

module.exports = { authorizeWithGitHub, usePubSub };

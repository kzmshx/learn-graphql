const { readFileSync } = require('fs');

const { request } = require('graphql-request');

const url = 'http://localhost:4000/graphql';

const listUsersQuery = readFileSync('../graphql/operations/list-users.graphql', { encoding: 'utf-8' });

request(url, listUsersQuery).then(console.log).catch(console.error);

const populateQuery = readFileSync('../graphql/operations/populate.graphql', { encoding: 'utf-8' });
const variables = { count: 3 };

request(url, populateQuery, variables).then(console.log).catch(console.error);

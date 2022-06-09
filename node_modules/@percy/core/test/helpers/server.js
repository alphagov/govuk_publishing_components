// aliased to src for coverage during tests without needing to compile this file
const { createServer } = require('@percy/core/dist/server');

function createTestServer(routes, port = 8000) {
  let context = createServer(routes);

  // handle route errors
  context.routes.catch = ({ message }) => [500, 'text/plain', message];

  // track requests
  context.requests = [];
  context.routes.middleware = ({ url, body }) => {
    context.requests.push(body ? [url, body] : [url]);
  };

  // automatically listen
  return context.listen(port);
};

// support commonjs environments
module.exports = createTestServer;
module.exports.createTestServer = createTestServer;

// aliased to src during tests
import Server from '../../dist/server.js';

export function createTestServer({ default: defaultReply, ...replies }, port = 8000, options = {}) {
  let server = new Server();

  // alternate route handling
  let handleReply = (reply, options = {}) => async (req, res) => {
    let [status, headers, body] = typeof reply === 'function' ? await reply(req) : reply;
    if (!Buffer.isBuffer(body) && typeof body !== 'string') body = JSON.stringify(body);

    if (options.noHeaders) {
      return res.writeHead(status).end(body);
    }
    if (options.headersOverride) {
      headers = { ...headers, ...options.headersOverride };
    }
    return res.send(status, headers, body);
  };

  // map replies to alternate route handlers
  server.reply = (p, reply, options = {}) => (replies[p] = handleReply(reply, options), null);
  for (let [p, reply] of Object.entries(replies)) server.reply(p, reply);
  if (defaultReply) defaultReply = handleReply(defaultReply);

  // track requests and route replies
  server.requests = [];
  server.route(async (req, res, next) => {
    let pathname = req.url.pathname;
    if (req.url.search) pathname += req.url.search;
    let reply = replies[pathname] || defaultReply;
    // Chrome >=128 auto-fetches /favicon.ico on every navigation; reply 204
    // by default so it doesn't pollute snapshot resources. Tests can still
    // override via `server.reply('/favicon.ico', ...)`.
    if (req.url.pathname === '/favicon.ico' && !replies['/favicon.ico']) {
      return res.writeHead(204).end();
    }
    server.requests.push(req.body ? [pathname, req.body, req.headers] : [pathname, req.headers]);
    return reply ? await reply(req, res) : next();
  });

  // automatically listen
  return server.listen(port);
};

export default createTestServer;

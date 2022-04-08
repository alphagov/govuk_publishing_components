const nock = require('nock');

const DEFAULT_REPLIES = {
  '/builds': () => [201, {
    data: {
      id: '123',
      attributes: {
        'build-number': 1,
        'web-url': 'https://percy.io/test/test/123'
      }
    }
  }],

  '/builds/123/snapshots': ({ body }) => [201, {
    data: {
      id: '4567',
      attributes: body.attributes,
      relationships: {
        'missing-resources': {
          data: body.data.relationships.resources
            .data.map(({ id }) => ({ id }))
        }
      }
    }
  }]
};

const mockAPI = {
  nock: null,
  requests: null,
  replies: null,

  start(delay = 0) {
    nock.cleanAll();
    nock.disableNetConnect();
    nock.enableNetConnect('storage.googleapis.com|localhost|127.0.0.1');

    let n = this.nock = nock('https://percy.io/api/v1').persist();
    let requests = this.requests = {};
    let replies = this.replies = {};

    function intercept(_, body) {
      let { path, headers, method } = this.req;

      try { body = JSON.parse(body); } catch {}
      path = path.replace('/api/v1', '');

      let req = { body, headers, method };
      let reply = replies[path] && (
        replies[path].length > 1
          ? replies[path].shift()
          : replies[path][0]
      );

      requests[path] = requests[path] || [];
      requests[path].push(req);

      return reply ? reply(req) : (
        DEFAULT_REPLIES[path]
          ? DEFAULT_REPLIES[path](req)
          : [200]
      );
    }

    n.get(/.*/).delay(delay).reply(intercept);
    n.post(/.*/).delay(delay).reply(intercept);
  },

  reply(path, handler) {
    this.replies[path] = this.replies[path] || [];
    this.replies[path].push(handler);
    return this;
  },

  cleanAll() {
    nock.cleanAll();
    return this;
  }
};

module.exports = mockAPI;

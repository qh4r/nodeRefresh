const request = require('supertest');

const {app} = require('./app');

describe('server tests', () => {

  // https://github.com/visionmedia/supertest
  it('should return home route', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .expect('HOME RESPONSE')
      .end(done);
  });

});
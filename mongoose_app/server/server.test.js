const request = require('supertest');
const app = require('./server')();
const Task = require('./models/task');

// it's rly bad test
describe("server", () => {
  beforeEach(async () => {
    await Task.remove({});
  });

  it('handles task post', (done) => {
    const text = "test";
    return request(app)
      .post('/tasks')
      .send({text})
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end(async (err, res) => {
        if (err) {
          return done(err); // if you pass anything to done it will fail
        }
        const result = await Task.find({_id: res.body._id});
        expect(result.length).toBe(1);
        done();
      })
  })
});
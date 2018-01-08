const {add, asyncAdd} = require('./utils');
const chai = require('chai');
const expect = require('expect');
const sinon = require('sinon');
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

// FOR MOCKING REQUIRES IN SOME MODULE
// https://github.com/jhnns/rewire
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ look here
// const test = rewire('.asd');
// const myDb = { secret: "pssst" };
// test.__set__('db', myDb);

// sinon used well with chain EXPECT got linked with jest so it;s not recommended to be used with mocha anymore
describe(' chai assertions', () => {

  it('should retuen valid result of addittion', () => {
    const result = add(5, 7);
    chai.expect(result).to.equal(12);
  });


  describe("asyncAdd", () => {
    let clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    it('should add asynchronously', (done) => {
      asyncAdd(2, 3, (result) => {
        chai.expect(result).to.equal(5);
        done();
      })
      clock.tick(1510); // when clock is mocked this needs to be called for timers to proceed
    });

    it('should call cb with proper args', () => {
      const cb = sinon.spy();
      asyncAdd(3, 4, cb);
      clock.tick(1510);
      chai.expect(cb).to.have.been.calledWith(7);
    })

  });
});


describe(' expect ~ jest style assertions', () => {

  it('should add correctly', () => {
    expect(add(3, 4)).toBe(7);
  });

  describe("asyncAdd", () => {

    // argument passed in asserion signals test is over
    it('should add asynchronously', (done) => {
      asyncAdd(2, 3, (result) => {
        expect(result).toBe(5);
        done();
      })
    });
    //

  });

});
var app = require('./app');
var request = require('supertest').agent(app.listen());
var co = require('co');
var users = require('./userRoutes').users;

describe("Simple user HTTP Crud API", function() {
  var aUser = {};

  beforeEach(function(done) {
    aUser = { name: "Ryan", age: 29, height: 1.95 };
    removeAll(done);
  });

  afterEach(function(done) {
    removeAll(done);
  });

  var removeAll = function(done) {
    co(function * () {
      yield users.remove({});
    }).then(done);
  };

  it("adds new users", function(done) {
    request
      .post("/user")
      .send(aUser)
      .expect("location", /^\/user\/[0-9a-fA-F]{24}$/)
      .expect(200, done)
  });

  it("fails with validation error for users without a name", function(done) {
    delete aUser.name;

    request
      .post("/user")
      .send(aUser)
      .expect("name required")
      .expect(400, done);
  });

  it("updates an exisiting user", function(done) {
    co(function *() {
      var insertedUser = yield users.insert(aUser);
      var url = "/user/" + insertedUser._id;

      request
        .put(url)
        .send({ name: "Herman", age: 11, height: 1.0 })
        .expect("location", url)
        .expect(204, done);
    });
  });

  it("deletes an existing user", function(done) {
    co(function *() {
      var insertedUser = yield users.insert(aUser);
      var url = "/user/" + insertedUser._id;

      request
        .del(url)
        .expect(200, done);
    });
  });

  it("gets existing user by id", function(done) {
    co(function *() {
      var insertedUser = yield users.insert(aUser);
      var url = "/user/" + insertedUser._id;

      request
        .get(url)
        .set("Accept", "application/json")
        .expect("Content-type", /json/)
        .expect(/Ryan/)
        .expect(/29/)
        .expect(200, done);
    });
  });
});

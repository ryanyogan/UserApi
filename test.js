var app = require('./app');
var request = require('supertest').agent(app.listen());
var co = require('co');

describe("Simple user HTTP Crud API", function() {
  var aUser = {};

  beforeEach(function(done) {
    aUser = { name: "Ryan", age: 29, height: 1.95 };
    done();
  });

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

  it("gets existing user by id", function(done) {
    co(function *() {
      var insertedUser = yield app.users.insert(aUser);
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

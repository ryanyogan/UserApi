var app = require('./app');
var request = require('supertest').agent(app.listen());

describe("Simple user HTTP Crud API", function() {
  var aUser = { name: "Ryan", age: 29, height: 1.95 };

  it("adds new users", function(done) {
    request
      .post("/user")
      .send(aUser)
      .expect("location", /^\/user\/[0-9a-fA-F]{24}$/)
      .expect(200, done)
  });
});

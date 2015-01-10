var koa = require('koa');
var app = koa();
var routes = require('koa-route');

// Routes
var userRoutes = require('./userRoutes');
app.use(routes.post('/user', userRoutes.addUser));
app.use(routes.get('/user/:id', userRoutes.getUser));
app.use(routes.put('/user/:id', userRoutes.updateUser));
app.use(routes.del('/user/:id', userRoutes.deleteUser));

app.listen(3000);
console.log("The app is running on port 3000");

module.exports = app;

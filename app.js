require('dotenv').config();
const express = require('express');
const app = express();
// const dbConnection = require('./db');
// const middleware = require('./middleware');
// const controllers = require('./controllers');

// app.use(express.json());
// app.use(middleware.headers);

//app.use('/user', controllers.userController);

app.listen(3000, () => {
    console.log(`[Server]: App is listening on 3000.`);
});
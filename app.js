require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors')
app.use(cors())
const dbConnection = require('./db');
const controllers = require('./controllers');
app.use(express.json());
//app.use(require("./middleware/headers"));

app.use('/user', controllers.usercontroller);
app.use('/post', controllers.postcontroller);

dbConnection.authenticate()
    .then(() => dbConnection.sync())
    .then(() => {
        app.listen(3000, () => {
            console.log(`[Server]: App is listening on 3000.`);
        });
    })
    .catch((error) => {
        console.log(`[Server]: Server crashed. Error = ${error}`);
    });
const { Sequelize } = require('sequelize');

const db = new Sequelize("postgres://postgres:7990ddc8f06d4325a4e16e129363da73@localhost:5432/instapet");

module.exports = db;
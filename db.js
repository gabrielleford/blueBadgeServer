const { Sequelize } = require("sequelize/dist");

const db = new Sequelize(
  process.env.DATABASE_URL ||
  `postgresql://postgres:${encodeURIComponent(process.env.PASS)}@localhost/instapet`,
{
  dialect: 'postgres'
}
)   

module.exports = db;
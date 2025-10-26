require('dotenv').config(); // ensure .env is loaded

module.exports = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT || 'mysql',  // required by Sequelize
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
